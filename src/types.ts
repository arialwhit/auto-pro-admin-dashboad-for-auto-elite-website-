export interface Vehicle {
  id: number;
  title: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  status: 'available' | 'sold' | 'reserved';
  condition: 'new' | 'used' | 'certified';
  images: string[];
  description: string;
  featured: boolean;
}

export interface Booking {
  id: number;
  vehicle_id: number;
  vehicle_title: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  booking_date: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

export interface FinancingApplication {
  id: number;
  vehicle_id: number;
  vehicle_title: string;
  customer_name: string;
  customer_email: string;
  income: number;
  credit_score: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  read: boolean;
}

export interface AppSettings {
  websiteName: string;
  contactEmail: string;
  phone: string;
  address: string;
  currency: string;
  aiEnabled: boolean;
  primaryColor: string;
  smtpHost?: string;
  smtpPort?: string;
  smtpUser?: string;
  smtpPass?: string;
  senderEmail?: string;
  autoReplyTemplate?: string;
}
