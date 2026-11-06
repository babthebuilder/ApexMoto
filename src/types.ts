export type UserRole = 'customer' | 'mechanic' | 'admin' | null;

export type ViewMode = 
  | 'landing' 
  | 'dashboard' 
  | 'vehicles' 
  | 'book' 
  | 'confirmation' 
  | 'bookings' 
  | 'invoices' 
  | 'mechanic'
  | 'admin'
  | 'customer-portal'
  | 'customer-login'
  | 'mechanic-login'
  | 'admin-login'
  | 'login'
  | 'access-denied';

export interface ApexAccount {
  id: string; // e.g. "CUST-101", "TECH-08", "ADM-01"
  role: 'customer' | 'mechanic' | 'admin';
  name: string;
  email: string;
  pass: string;
  pin?: string;
  badgeId?: string;
  station?: string;
  title?: string;
  tier?: string;
  phone?: string;
  defaultVehicleId?: string;
}

export interface AuthSession {
  role: UserRole;
  user: {
    id: string;
    name: string;
    email?: string;
    badgeId?: string;
    title?: string;
    station?: string;
    tier?: string;
  } | null;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  tier: string;
  defaultVehicleId?: string;
  registeredDate?: string;
}

export interface Vehicle {
  id: string;
  name: string;
  edition: string;
  specs: string;
  plate: string;
  vin: string;
  body: string;
  mileage: string;
  healthScore: number;
  healthLabel: string;
  status: 'IN BAY 04 • LIVE DIAG' | 'READY / HEALTHY' | 'BOOKING PENDING';
  statusColor: 'blue' | 'green' | 'amber';
  image: string;
  activeBay?: string;
  warrantyValid: boolean;
}

export interface ServicePackage {
  id: string;
  title: string;
  price: number;
  description: string;
  features: string[];
  duration: string;
  icon: string;
}

export interface WorkOrderStep {
  stepNumber: number;
  title: string;
  status: 'completed' | 'active' | 'queued';
  time: string;
  description: string;
  progressPercent?: number;
  metricLabel?: string;
  metricValue?: string;
  tolerances?: string;
  estClearance?: string;
}

export interface WorkOrder {
  id: string;
  token: string;
  vehicleId: string;
  vehicleName: string;
  vehicleChassis: string;
  serviceTitle: string;
  date: string;
  status: 'In Progress' | 'Pending' | 'Completed' | 'Delivered';
  leadTechnician: {
    name: string;
    id: string;
    cert: string;
    avatar?: string;
  };
  assignedBay: string;
  currentStage: number;
  totalStages: number;
  stageName: string;
  progressPercent: number;
  estCompletion: string;
  steps: WorkOrderStep[];
  technicianLog?: {
    id: string;
    techName: string;
    timeAgo: string;
    note: string;
    camImage: string;
    camLabel: string;
  };
  invoiced?: boolean;
  invoiceId?: string;
  invoiceNumber?: string;
  basePrice?: number;
  customerName?: string;
  customerEmail?: string;
  allocatedParts?: {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
    note?: string;
  }[];
}

export interface InvoiceItem {
  id: string;
  number: string;
  bookingRef: string;
  vehicleName: string;
  serviceDescription: string;
  dateIssued: string;
  paymentMethod: string;
  amount: number;
  status: 'Paid' | 'Pending';
  customerName?: string;
  customerEmail?: string;
  laborCost?: number;
  partsCost?: number;
  allocatedPartsList?: { name: string; qty: number; unitPrice: number; total: number }[];
  taxAmount?: number;
  discount?: number;
  notes?: string;
  generatedBy?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  unitPrice: number;
  stock: number;
  location: string;
  category: string;
}
