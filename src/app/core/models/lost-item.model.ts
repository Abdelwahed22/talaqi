// src/app/core/models/lost-item.model.ts
export interface LocationDto {
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  city?: string | null;
  governorate?: string | null;
}

export interface LostItem {
  id: string;
  userId?: string | null;
  userName?: string | null;
  userProfilePicture?: string | null;
  category?: string | null;
  title?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  location?: LocationDto | null;
  dateLost?: string | null;
  dateFound?: string | null;
  createdAt?: string | null;
  foundAt?: string | null;
  contactInfo?: string | null;
  status?: string | null;    // e.g. "Active", "Found", "Closed"
  isFound?: boolean | null;  // convenience flag
  matchCount?: number | null;
}
