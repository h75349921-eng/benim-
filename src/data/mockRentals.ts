import { RentalCar } from '../types';

export const mockRentals: RentalCar[] = [
  {
    id: 'r1',
    title: 'Toyota Camry Hybrid SE',
    brand: 'Toyota',
    model: 'Camry Hybrid',
    year: 2023,
    isVerified: true,
    isPremium: true,
    ownerType: 'First Owner',
    dailyRate: 4500,
    mileage: 12000,
    location: 'Mumbai, Maharashtra',
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    images: [
      'https://i.pinimg.com/1200x/55/0d/de/550ddee402f77ae627c7c7e2e31eb282.jpg',
      'https://i.pinimg.com/736x/34/59/63/34596318d2173c64e65e069dd38d6e60.jpg'
    ],
    description: 'Experience pure comfort and efficiency with the latest Camry Hybrid. Perfect for premium city commuting or weekend getaways.',
    specs: {
      engine: '2.5L Dynamic Force 4-Cylinder',
      power: '208 hp',
      torque: '221 Nm'
    },
    features: ['Adaptive Cruise Control', 'Sunroof', 'Leather Seats', 'Apple CarPlay', '360 Camera'],
    availableFrom: '2024-01-01',
    availableTo: '2025-12-31',
    securityDeposit: 5000,
    seller: {
      id: 'd1',
      name: 'Elite Rental Services',
      type: 'Dealer'
    }
  },
  {
    id: 'r2',
    title: 'BMW 330e M Sport',
    brand: 'BMW',
    model: '3 Series Hybrid',
    year: 2022,
    isVerified: true,
    isPremium: false,
    ownerType: 'First Owner',
    dailyRate: 8500,
    mileage: 8500,
    location: 'Delhi, NCR',
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    images: [
      'https://i.pinimg.com/736x/38/d9/bb/38d9bbb40c0a2c7ccccf226889ceba39.jpg',
      'https://i.pinimg.com/1200x/10/3b/0d/103b0da09b41a74ede1f1c19b814daf9.jpg'
    ],
    description: 'The ultimate driving machine now in hybrid avatar. Delivering unmatched performance with an eco-conscious footprint.',
    specs: {
      engine: '2.0L TwinPower Turbo 4-Cylinder',
      power: '288 hp',
      torque: '420 Nm'
    },
    features: ['M Sport Package', 'Harman Kardon Audio', 'Heads-up Display', 'Park Assist'],
    availableFrom: '2024-01-01',
    availableTo: '2025-12-31',
    securityDeposit: 6500,
    seller: {
      id: 'd2',
      name: 'Premium Drive Delhi',
      type: 'Dealer'
    }
  },
  {
    id: 'r3',
    title: 'Lexus NX 350h Luxury',
    brand: 'Lexus',
    model: 'NX 350h',
    year: 2024,
    isVerified: true,
    isPremium: true,
    ownerType: 'First Owner',
    dailyRate: 12000,
    mileage: 5000,
    location: 'Bangalore, Karnataka',
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    images: [
      'https://i.pinimg.com/1200x/47/15/4b/47154b43151c2571038733ec171aea36.jpg',
      'https://i.pinimg.com/736x/1e/1b/d0/1e1bd03a7fcc0855730ecfc3481935c6.jpg'
    ],
    description: 'Pure luxury meets Japanese perfection. The Lexus NX 350h offers a serene driving experience with top-tier efficiency.',
    specs: {
      engine: '2.5L inline-4 with Lexus Hybrid Drive',
      power: '240 hp',
      torque: '239 Nm'
    },
    features: ['Mark Levinson Sound System', 'Ventilated Seats', 'Panoramic Sunroof', 'AWD'],
    availableFrom: '2024-01-01',
    availableTo: '2025-12-31',
    securityDeposit: 8000,
    seller: {
      id: 'd3',
      name: 'South India Rentals',
      type: 'Dealer'
    }
  }
];
