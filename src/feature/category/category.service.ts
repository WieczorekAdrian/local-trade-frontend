import { api } from "@/auth/axiosConfig";
import type { Category, CategoryResponse } from "@/feature/category/category.types";

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get<CategoryResponse>("/categories");
  return response.data.categories;
};
