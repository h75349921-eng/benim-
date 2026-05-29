export interface BrandModelMap {
  [brand: string]: string[];
}

export const CAR_BRANDS: BrandModelMap = {
  "Maruti Suzuki": ["Swift", "Baleno", "Dzire", "Brezza", "Ertiga", "Grand Vitara", "Alto", "WagonR", "Celerio", "S-Presso", "Ignis", "XL6", "Ciaz", "Jimny", "Fronx", "Invicto"],
  "Hyundai": ["i20", "Grand i10 Nios", "Creta", "Venue", "Verna", "Alcazar", "Tucson", "Aura", "Exter", "Kona Electric", "Ioniq 5"],
  "Tata": ["Nexon", "Punch", "Harrier", "Safari", "Tiago", "Tigor", "Altroz", "Curvv", "Indica", "Nano"],
  "Mahindra": ["XUV700", "Thar", "Scorpio-N", "Scorpio Classic", "Bolero", "XUV300", "XUV 3X0", "XUV400", "Marazzo", "Xylo"],
  "Toyota": ["Innova Crysta", "Innova Hycross", "Fortuner", "Urban Cruiser Taisor", "Glanza", "Camry", "Hilux", "Vellfire", "Land Cruiser", "Prius", "Yaris", "Etios"],
  "Honda": ["City", "Amaze", "Elevate", "Civic", "Accord", "Jazz", "WR-V", "Brio"],
  "Kia": ["Seltos", "Sonet", "Carens", "Carnival", "EV6", "EV9"],
  "Skoda": ["Slavia", "Kushaq", "Kodiaq", "Octavia", "Superb", "Rapid", "Fabia", "Yeti"],
  "Volkswagen": ["Virtus", "Taigun", "Tiguan", "Polo", "Vento", "Jetta", "Passat", "Ameo"],
  "MG Motors": ["Hector", "Astor", "Comet EV", "ZS EV", "Gloster", "Hector Plus"],
  "Renault": ["Kwid", "Triber", "Kiger", "Duster", "Pulse", "Scala", "Lodgy"],
  "Nissan": ["Magnite", "Kicks", "Sunny", "Terrano", "GT-R", "Micra"],
  "Jeep": ["Compass", "Meridian", "Wrangler", "Grand Cherokee"],
  "Ford": ["EcoSport", "Endeavour", "Figo", "Aspire", "Mustang", "Fiesta", "Ikon"],
  "Chevrolet": ["Beat", "Cruze", "Spark", "Captiva", "Tavera", "Sail", "Enjoy"],
  "Audi": ["A3", "A4", "A6", "A8L", "Q3", "Q5", "Q7", "Q8", "e-tron", "RS e-tron GT"],
  "BMW": ["2 Series", "3 Series", "5 Series", "7 Series", "X1", "X3", "X5", "X7", "iX", "M4"],
  "Mercedes-Benz": ["A-Class", "C-Class", "E-Class", "S-Class", "GLA", "GLC", "GLE", "GLS", "EQE", "EQS", "C-Class Cabriolet"],
  "Volvo": ["XC40", "XC60", "XC90", "S60", "S90", "C40 Recharge"],
  "Land Rover": ["Range Rover Evoque", "Range Rover Velar", "Range Rover Sport", "Defender", "Discovery", "Discovery Sport"],
  "Jaguar": ["XE", "XF", "F-Pace", "F-Type", "I-Pace"],
  "Lexus": ["ES", "NX", "RX", "LX", "LC", "LM"],
  "Porsche": ["Macan", "Cayenne", "Panamera", "911", "Taycan", "Boxster", "Cayman"],
  "Mini": ["Cooper", "Countryman", "Clubman", "Convertible"],
  "Isuzu": ["D-Max", "MU-X", "V-Cross", "S-Cab"],
  "Mitsubishi": ["Lancer", "Pajero", "Outlander", "Montero", "Cedia"],
  "Fiat": ["Punto", "Linea", "Avventura", "500", "Palio"],
  "BYD": ["Atto 3", "E6", "Seal"],
  "Force": ["Gurkha", "Traveller", "One"],
  "Datsun": ["Redi-GO", "GO", "GO+"],
  "Other": ["Other Model"]
};

export const BRAND_NAMES = Object.keys(CAR_BRANDS).sort();
