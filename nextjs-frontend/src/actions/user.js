"use server";
import { postRequest } from "@/lib/api";
import apiRoutes from "@/routes/api-route";

export const signup = async (data) => {
  const result = await postRequest(apiRoutes.SIGNUP, data);
  return result;
};

export const updateProfile = async (data) => {
  const result = await postRequest(apiRoutes.USER_UPDATE, data);
  return result;
};
