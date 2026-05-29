export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'Plug-in Hybrid' | 'CNG' | 'LPG';
export type Transmission = 'Manual' | 'Automatic';
export type ListingStatus = 'Standard' | 'Verified' | 'Prime';

export interface Car {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  location: string;
  state?: string;
  fuelType: FuelType;
  transmission: Transmission;
  status: ListingStatus;
  isVerified: boolean;
  isPremium: boolean;
  premiumUntil?: string;
  boostPlanName?: string;
  boostStartDate?: string;
  boostExpiresAt?: string;
  isVerificationPending?: boolean;
  verificationStatus?: 'pending' | 'approved' | 'rejected' | 'none';
  ownerType: 'First Owner' | 'Second Hand' | 'Third Owner';
  images: string[];
  description: string;
  createdAt?: any;
  updatedAt?: any;
  specs: {
    engine: string;
    power: string;
    torque: string;
    bodyType?: string;
    seatingCapacity?: number;
    driveTrain?: string;
    maxPower?: string;
    minPower?: string;
    batteryCapacity?: string;
    color?: string;
    insuranceStatus?: string;
    accidentHistory?: 'No' | 'Minor' | 'Major';
    serviceHistory?: string;
    steeringType?: string;
    adjustableSteering?: boolean;
    bluetooth?: boolean;
  };
  seller: {
    name: string;
    type: 'Individual' | 'Dealer';
    id: string;
    isVerified?: boolean;
  };
}

export interface Inquiry {
  id: string;
  carId: string;
  carTitle: string;
  buyerName: string;
  message: string;
  timestamp: string;
}

export interface RentalCar extends Omit<Car, 'price' | 'status'> {
  dailyRate: number;
  availableFrom: string;
  availableTo: string;
  features: string[];
  securityDeposit: number;
}

export interface RentalBooking {
  id: string;
  rentalId: string;
  userId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
}
