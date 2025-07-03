"use server";

import { deleteRequest, postRequest } from "@/lib/api";
import routePath from "@/routes";
import apiRoutes from "@/routes/api-route";
import { revalidatePath } from "next/cache";

export const addNoteAction = async (data) => {
  const response = await postRequest(apiRoutes.NOTE_ADD, data);
  revalidatePath(routePath.NOTE);
  return response;
};

export const updateNoteAction = async (id, data) => {
  const response = await postRequest(apiRoutes.NOTE_UPDATE, { id, ...data });
  revalidatePath(routePath.NOTE);
  return response;
};

export const deleteNoteAction = async (id) => {
  const response = await deleteRequest(apiRoutes.NOTE_DELETE, id);
  revalidatePath(routePath.NOTE);
  return response;
};
