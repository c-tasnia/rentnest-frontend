import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  role: z.enum(["TENANT", "LANDLORD"], { errorMap: () => ({ message: "Choose a role" }) }),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const propertySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  address: z.string().min(3, "Address is required"),
  city: z.string().min(2, "City is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  bedrooms: z.coerce.number().int().min(0).default(1),
  bathrooms: z.coerce.number().int().min(0).default(1),
  amenities: z.string().optional(),
  images: z.string().optional(),
  categoryId: z.string().min(1, "Choose a category"),
  status: z.enum(["AVAILABLE", "UNAVAILABLE", "RENTED"]).optional(),
});
export type PropertyInput = z.infer<typeof propertySchema>;

export const rentalRequestSchema = z.object({
  moveInDate: z.string().min(1, "Move-in date is required"),
  message: z.string().optional(),
});
export type RentalRequestInput = z.infer<typeof rentalRequestSchema>;

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1, "Pick a rating").max(5),
  comment: z.string().optional(),
});
export type ReviewInput = z.infer<typeof reviewSchema>;
