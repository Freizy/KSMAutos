export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price?: number;
  topSpeed?: number;
  acceleration?: number;
  horsepower?: number;
  transmission?: string;
  engine?: string;
  torque?: string;
  weight?: string;
  downforce?: string;
  fuelDelivery?: string;
  imageUrl: string;
  category: 'Hypercars' | 'Customs' | 'Vintage' | 'Prototype';
  status: 'available' | 'sold' | 'pre-order';
  vin?: string;
  mileage?: number;
  ownerUid?: string;
  isFeatured?: boolean;
  description?: string;
  features?: string[];
  exteriorColor?: string;
  interiorColor?: string;
  images?: string[];
}

export interface Inquiry {
  id: string;
  vehicleId: string;
  vehicleName: string;
  userName: string;
  userEmail: string;
  message: string;
  status: 'pending' | 'contacted' | 'closed';
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string;
  photoUrl: string | null;
  role: 'user' | 'admin' | 'elite';
  createdAt: string;
}

export interface SiteSettings {
  maintenanceMode: boolean;
  inquiryNotifications: boolean;
  primaryAccentColor: string;
  contactEmail: string;
}
