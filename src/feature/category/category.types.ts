export interface Category {
  id: number;
  name: string;
  description: string;
  parentCategory: string;
}
export interface CategoryResponse {
  categories: Category[];
}
