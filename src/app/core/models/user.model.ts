// src/app/core/models/user.model.ts
export interface AppUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  profilePictureUrl?: string | null;
  role?: string;
}
