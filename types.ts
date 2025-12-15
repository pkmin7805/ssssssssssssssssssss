export interface Book {
  id: number;
  title: string;
  author: string;
  // price removed
  category: string;
  subcategory: string;
  rating: number;
  description: string;
  fileUrl?: string; // URL for the uploaded file (Blob URL)
  fileName?: string; // Original file name
  externalUrl?: string; // Link to external website/resource
  isNew?: boolean;
  isBestSeller?: boolean;
}

// AI Service types for Description Generation
export interface AIDescriptionRequest {
  title: string;
  author: string;
  category: string;
  subcategory: string;
}

// AI Service types for Recommendations
export interface AIRecommendation {
  bookId: number;
  reason: string;
}

export interface AIRecommendationResponse {
  recommendations: AIRecommendation[];
  summary: string;
}