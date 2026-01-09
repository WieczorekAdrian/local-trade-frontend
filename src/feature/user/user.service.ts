import { api } from "@/auth/axiosConfig";
import { type UserDashboardDto } from "./user.types";

export const getLoggedInUser = async () => {
  const response = await api.get<UserDashboardDto>("/users/me");
  return response.data;
};
