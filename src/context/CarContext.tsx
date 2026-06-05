import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  addDoc, 
  query, 
  orderBy,
  where,
  or,
  serverTimestamp,
  getDoc,
  getDocs,
  limit
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Car } from '../types';
import { mockCars } from '../data/mockCars';

interface Booking {
  id: string;
  carId: string;
  carTitle: string;
  userId: string;
  userName: string;
  type: 'Booking' | 'PhoneView' | 'Chat';
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  timestamp: any;
  sellerId: string;
}

interface Payment {
  id: string;
  listingId: string;
  listingTitle: string;
  amount: number;
  date: string;
  type: string;
  status: 'Completed' | 'Pending';
  userId: string;
}

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface CarContextType {
  cars: Car[];
  favorites: string[];
  payments: Payment[];
  bookings: Booking[];
  toggleFavorite: (carId: string) => Promise<void>;
  boostListing: (carId: string, plan: { name: string; price: number }) => Promise<void>;
  addListing: (carData: Partial<Car>, sellerInfo: { name: string; id: string }) => Promise<void>;
  bookCar: (carId: string) => Promise<void>;
  logInteraction: (carId: string, type: 'PhoneView' | 'Share' | 'Chat') => Promise<void>;
  isFavorite: (carId: string) => boolean;
  isLoading: boolean;
  addServicePayment: (type: string, listingTitle: string, amount: number) => Promise<void>;
}

const CarContext = createContext<CarContextType | undefined>(undefined);

export function CarProvider({ children }: { children: React.ReactNode }) {
  const [cars, setCars] = useState<Car[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    // Seed if truly empty (isolated from listener)
    const checkAndSeed = async (user: any) => {
      const isAdmin = user && (
        user.email === 'adilnida778@gmail.com' || 
        user.email === 'fhghghh83@gmail.com' ||
        user.email === 'premium@test.com'
      );
      if (!isAdmin) return;
      if (isSeeding) return;

      try {
        // Check if we need to seed or update
        const snap = await getDocs(query(collection(db, 'cars')));
        const existingDocs = snap.docs.reduce((acc, d) => {
          acc[d.id] = d.data();
          return acc;
        }, {} as Record<string, any>);
        
        const existingIds = Object.keys(existingDocs);
        const needsSeeding = mockCars.some(mc => !existingIds.includes(mc.id));
        
        // Find if any of the existing cars has mismatched images
        const needsUpdates = mockCars.filter(mc => {
          const docData = existingDocs[mc.id];
          if (!docData) return false;
          const localFirstImg = mc.images[0];
          const dbFirstImg = docData.images?.[0];
          return localFirstImg !== dbFirstImg;
        });

        if (needsSeeding || needsUpdates.length > 0) {
          setIsSeeding(true);
          console.log('Seeding or updating mock cars...');
          
          // Seed Dummy Seller Account
          const dummySellerRef = doc(db, 'users', 'dealer_dummy');
          await setDoc(dummySellerRef, {
            id: 'dealer_dummy',
            name: 'Premium Autos (Test Account)',
            email: 'premium@test.com',
            role: 'dealer',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150',
            favorites: []
          }, { merge: true });
          
          // Seed missing Cars
          let seededCount = 0;
          for (const car of mockCars) {
            if (!existingIds.includes(car.id)) {
              try {
                const carRef = doc(db, 'cars', car.id);
                await setDoc(carRef, {
                  ...car,
                  createdAt: serverTimestamp(),
                  updatedAt: serverTimestamp()
                });
                seededCount++;
              } catch (carErr) {
                console.error(`Failed to seed car ${car.id}:`, carErr);
              }
            }
          }
          if (seededCount > 0) {
            console.log(`Successfully seeded ${seededCount} missing cars.`);
          }

          // Update existing cars that need synchronization
          let updatedCount = 0;
          for (const car of needsUpdates) {
            try {
              const carRef = doc(db, 'cars', car.id);
              await updateDoc(carRef, {
                images: car.images,
                updatedAt: serverTimestamp()
              });
              updatedCount++;
            } catch (updateErr) {
              console.error(`Failed to update car ${car.id}:`, updateErr);
            }
          }
          if (updatedCount > 0) {
            console.log(`Successfully synchronized ${updatedCount} cars with new details.`);
          }
        } else {
          console.log('All mock cars already present and synchronized.');
        }
      } catch (err) {
        console.error("Seeding error:", err);
      } finally {
        setIsSeeding(false);
      }
    };

    // 1. Sync Cars
    // Temporary: Remove orderBy to see if documents with missing timestamps were the issue
    const carsQuery = query(collection(db, 'cars'));
    const unsubscribeCars = onSnapshot(carsQuery, (snapshot) => {
      console.log(`Cars Sync: Received ${snapshot.docs.length} listings from database.`);
      const now = new Date();
      
      const carsData = snapshot.docs.map(snapshotDoc => {
        const data = snapshotDoc.data() as any;
        const id = snapshotDoc.id;
        
        let isPremium = data.isPremium;
        let boostPlanName = data.boostPlanName;
        let boostStartDate = data.boostStartDate;
        let boostExpiresAt = data.boostExpiresAt;
        let status = data.status;

        if (boostExpiresAt) {
          const expiryDate = new Date(boostExpiresAt);
          if (expiryDate <= now) {
            // Expired! Clean up in UI immediately and update Firestore
            isPremium = false;
            boostPlanName = null;
            boostStartDate = null;
            boostExpiresAt = null;
            if (status === 'Prime') {
              status = 'Standard';
            }
            
            // Asynchronously resolve Firestore cleanup
            updateDoc(doc(db, 'cars', id), {
              isPremium: false,
              boostPlanName: null,
              boostStartDate: null,
              boostExpiresAt: null,
              status: status === 'Prime' ? 'Standard' : status,
              updatedAt: serverTimestamp()
            }).catch(err => console.error(`Failed to clean up expired boost for car ${id}:`, err));
          }
        }
        
        return {
          ...data,
          id,
          isPremium,
          boostPlanName,
          boostStartDate,
          boostExpiresAt,
          status
        } as Car;
      });
      
      if (snapshot.docs.length < 5 && !isSeeding) {
        console.warn('Very few cars found in database. Seeding might be needed.');
      }
      
      // Sort manually in memory for now to be safe
      const sortedCarsRaw = carsData.sort((a, b) => {
        const getSeconds = (ts: any) => {
          if (!ts) return 0;
          if (typeof ts.seconds === 'number') return ts.seconds;
          if (ts instanceof Date) return ts.getTime() / 1000;
          if (typeof ts === 'number') return ts / 1000;
          const parsed = Date.parse(ts);
          if (!isNaN(parsed)) return parsed / 1000;
          return 0;
        };

        const getRawScore = (car: Car) => {
          let baseScore = 0;
          const nowMs = Date.now();
          const createdAtSeconds = getSeconds(car.createdAt);
          const carTimeMs = createdAtSeconds * 1000;

          const isPrime = car.status === 'Prime' || car.isPremium === true;
          const ONE_DAY_MS = 24 * 60 * 60 * 1000;
          const isLatest = carTimeMs > 0 && (nowMs - carTimeMs) <= ONE_DAY_MS;
          const isVerified = car.isVerified === true || car.status === 'Verified';

          // Base priority score - additive approach to reward listings with cumulative matches
          if (isPrime) {
            baseScore += 500000;
          }
          if (isLatest) {
            baseScore += 300000;
          }
          if (isVerified) {
            baseScore += 150000;
          }

          // Down-prioritize unverified, non-prime listings that are older than 3 days to keep them at the bottom
          const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
          const isOldUnverifiedNonPrime = !isPrime && !isVerified && carTimeMs > 0 && (nowMs - carTimeMs) > THREE_DAYS_MS;
          if (isOldUnverifiedNonPrime) {
            baseScore -= 1000000;
          }

          // Intra-tier quality scoring
          let qualityBonus = 0;

          // Freshness bonus within the tier code (fresher = higher)
          if (createdAtSeconds > 0) {
            qualityBonus += (createdAtSeconds / 20000); 
          }

          // Premium start boost timestamp weighting
          if (isPrime && car.boostStartDate) {
            const parsed = Date.parse(car.boostStartDate);
            if (!isNaN(parsed)) {
              qualityBonus += (parsed / 20000000);
            }
          }

          // Complete with images bonus
          if (car.images && car.images.length > 0) {
            qualityBonus += 1000;
            qualityBonus += Math.min(car.images.length, 5) * 200;
          } else {
            qualityBonus -= 2000;
          }

          // Description & details bonus
          if (car.description) {
            if (car.description.length > 150) {
              qualityBonus += 500;
            } else if (car.description.length > 50) {
              qualityBonus += 250;
            }
          }

          // Technical data completeness
          if (car.specs) {
            let specCount = 0;
            if (car.specs.engine) specCount++;
            if (car.specs.power || car.specs.maxPower) specCount++;
            if (car.specs.color) specCount++;
            if (car.specs.insuranceStatus) specCount++;
            if (car.specs.serviceHistory) specCount++;
            qualityBonus += specCount * 200;
          }

          return baseScore + qualityBonus;
        };

        return getRawScore(b) - getRawScore(a);
      });

      // Split into Paid and Organic based on Prime/isPremium status
      const paid: Car[] = [];
      const organic: Car[] = [];
      for (const car of sortedCarsRaw) {
        const isPrime = car.status === 'Prime' || car.isPremium === true;
        if (isPrime) {
          paid.push(car);
        } else {
          organic.push(car);
        }
      }

      // Interleave at a controlled 1 Paid : 3 Organic ratio
      const interleavedSortedCars: Car[] = [];
      let pIdx = 0;
      let oIdx = 0;
      while (pIdx < paid.length || oIdx < organic.length) {
        if (pIdx < paid.length) {
          interleavedSortedCars.push(paid[pIdx]);
          pIdx++;
        }
        for (let i = 0; i < 3; i++) {
          if (oIdx < organic.length) {
            interleavedSortedCars.push(organic[oIdx]);
            oIdx++;
          }
        }
      }
      
      setCars(interleavedSortedCars);
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'cars');
      setIsLoading(false);
    });

    // 2. Sync User Favorites and Payments if logged in
    let unsubscribeUser = () => {};
    const authUnsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        checkAndSeed(user);
        const unsubU = onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
          if (snapshot.exists()) {
            setFavorites(snapshot.data().favorites || []);
          }
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        });

        // Sync Payments
        const paymentsQuery = query(
          collection(db, 'payments'), 
          where('userId', '==', user.uid)
        );
        const unsubscribePayments = onSnapshot(paymentsQuery, (snapshot) => {
          const paymentsData = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as Payment))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setPayments(paymentsData);
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, 'payments');
        });

        // Sync Bookings (as buyer or seller)
        const bookingsQuery = query(
          collection(db, 'bookings'), 
          or(
            where('userId', '==', user.uid),
            where('sellerId', '==', user.uid)
          )
        );
        const unsubscribeBookings = onSnapshot(bookingsQuery, (snapshot) => {
          const bookingsData = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as Booking))
            .sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
          setBookings(bookingsData);
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, 'bookings');
        });

        unsubscribeUser = () => {
          unsubU();
          unsubscribePayments();
          unsubscribeBookings();
        };
      } else {
        setFavorites([]);
        setPayments([]);
        setBookings([]);
        unsubscribeUser();
      }
    });

    return () => {
      unsubscribeCars();
      unsubscribeUser();
      authUnsubscribe();
    };
  }, []);

  const toggleFavorite = async (carId: string) => {
    const user = auth.currentUser;
    if (!user) return;

    const newFavorites = favorites.includes(carId)
      ? favorites.filter(id => id !== carId)
      : [...favorites, carId];

    try {
      await updateDoc(doc(db, 'users', user.uid), { favorites: newFavorites });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const isFavorite = (carId: string) => favorites.includes(carId);

  const addListing = async (carData: Partial<Car>, sellerInfo: { name: string; id: string }) => {
    try {
      const carRef = doc(collection(db, 'cars'));
      const newCar = {
        ...carData,
        id: carRef.id,
        status: 'Standard',
        isVerified: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        seller: {
          ...carData.seller,
          id: sellerInfo.id,
          name: sellerInfo.name,
          type: 'Individual',
          isVerified: true
        },
        specs: {
          engine: '2.0L Dynamic Force',
          power: '170 HP',
          torque: '200 Nm',
          ...carData.specs
        }
      };
      await setDoc(carRef, newCar);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'cars');
    }
  };

  const boostListing = async (carId: string, plan: { name: string; price: number }) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const start = new Date();
      let days = 30; // standard 1 month / 30 days
      if (plan.name.toLowerCase().includes('3 month') || plan.name.toLowerCase().includes('prime boost')) {
        days = 90;
      } else if (plan.name.toLowerCase().includes('elite')) {
        days = 30;
      }
      const expiresAt = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);

      // 1. Update Car with boost metadata
      await updateDoc(doc(db, 'cars', carId), {
        isPremium: true,
        boostPlanName: plan.name,
        boostStartDate: start.toISOString(),
        boostExpiresAt: expiresAt.toISOString(),
        updatedAt: serverTimestamp()
      });

      // 2. Add Payment
      const carDoc = await getDoc(doc(db, 'cars', carId));
      const carTitle = carDoc.exists() ? carDoc.data().title : 'Unknown Listing';

      await addDoc(collection(db, 'payments'), {
        listingId: carId,
        listingTitle: carTitle,
        amount: plan.price,
        date: new Date().toISOString(),
        type: 'Boost',
        status: 'Completed',
        userId: user.uid
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'boost_operation');
    }
  };

  const addServicePayment = async (type: string, listingTitle: string, amount: number) => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      await addDoc(collection(db, 'payments'), {
        listingId: 'N/A',
        listingTitle,
        amount,
        date: new Date().toISOString(),
        type,
        status: 'Completed',
        userId: user.uid
      });
    } catch (error) {
      console.error('Error adding service payment:', error);
      handleFirestoreError(error, OperationType.WRITE, 'payments');
    }
  };

  const bookCar = async (carId: string) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const carDoc = await getDoc(doc(db, 'cars', carId));
      const carData = carDoc.data();

      await addDoc(collection(db, 'bookings'), {
        carId,
        carTitle: carData?.title || 'Unknown Car',
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        type: 'Booking',
        status: 'Pending',
        timestamp: serverTimestamp(),
        sellerId: carData?.seller?.id
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'bookings');
    }
  };

  const logInteraction = async (carId: string, type: 'PhoneView' | 'Share' | 'Chat') => {
    const user = auth.currentUser;
    try {
      // 1. Log basic interaction
      await addDoc(collection(db, 'interactions'), {
        carId,
        type,
        userId: user?.uid || 'guest',
        timestamp: serverTimestamp()
      });

      // 2. If it's a PhoneView or Chat, also add it to bookings as an inquiry
      if ((type === 'PhoneView' || type === 'Chat') && user) {
        const carDoc = await getDoc(doc(db, 'cars', carId));
        if (carDoc.exists()) {
          const carData = carDoc.data();
          
          // Check if this user already has an inquiry of this type for this car to avoid duplicates
          const existingQuery = query(
            collection(db, 'bookings'),
            where('carId', '==', carId),
            where('userId', '==', user.uid),
            where('type', '==', type)
          );
          const existingSnap = await getDocs(existingQuery);
          
          if (existingSnap.empty) {
            await addDoc(collection(db, 'bookings'), {
              carId,
              carTitle: carData.title || 'Unknown Car',
              userId: user.uid,
              userName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
              type: type,
              status: 'Completed',
              timestamp: serverTimestamp(),
              sellerId: carData.seller?.id
            });
          }
        }
      }
    } catch (error) {
      console.error('Log Interaction Error:', error);
    }
  };

  return (
    <CarContext.Provider value={{ cars, favorites, payments, bookings, toggleFavorite, boostListing, addListing, bookCar, logInteraction, isFavorite, isLoading: isLoading || isSeeding, addServicePayment }}>
      {children}
    </CarContext.Provider>
  );
}

export function useCars() {
  const context = useContext(CarContext);
  if (context === undefined) {
    throw new Error('useCars must be used within a CarProvider');
  }
  return context;
}
