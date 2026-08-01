export type Role = "TENANT" | "LANDLORD" | "ADMIN";
export type UserStatus = "ACTIVE" | "BANNED";
export type PropertyStatus = "AVAILABLE" | "UNAVAILABLE" | "RENTED";
export type RentalStatus = "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "COMPLETED";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: Role;
  status: UserStatus;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  status: PropertyStatus;
  createdAt: string;
  landlordId: string;
  categoryId: string;
  category?: Category;
  landlord?: { id: string; name: string; email?: string };
  reviews?: { id: string; rating: number; comment?: string | null; tenant?: { id: string; name: string } }[];
}

export interface RentalRequest {
  id: string;
  status: RentalStatus;
  moveInDate: string;
  message?: string | null;
  createdAt: string;
  tenantId: string;
  propertyId: string;
  property?: Property;
  tenant?: { id: string; name: string; email: string };
  payment?: Payment | null;
}

export interface Payment {
  id: string;
  transactionId: string;
  amount: string;
  method: string;
  provider: string;
  status: PaymentStatus;
  paidAt?: string | null;
  rentalRequestId: string;
  rentalRequest?: RentalRequest;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
  meta?: { page: number; limit: number; total: number; totalPages: number };
}

export interface ApiError {
  success: false;
  message: string;
  errorDetails?: { field: string; message: string }[] | string | null;
}
