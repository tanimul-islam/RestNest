export interface CreatePropertyInput {
  title: string;
  description: string;
  price: number;
  area: number;
  address: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  categoryId: string;
}

export interface PropertyFilters {
  location?: string;
  minPrice?: string;
  maxPrice?: string;
  type?: string;
}
