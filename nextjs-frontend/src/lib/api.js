import { getServerSession } from "next-auth";

import { authOptions } from "./auth";
import { getSession } from "next-auth/react";

const BASE_URL = process.env.API_BASE_URL || "https://api.example.com";

const getToken = async () => {
  let token = null;
  if (typeof window !== "undefined") {
    const session = await getSession();
    token = session?.token;
  } else {
    const session = await getServerSession(authOptions);
    token = session?.token;
  }
  return token;
};
export const getRequest = async (endpoint, options = {}) => {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
      ...options.headers,
    },
    ...options,
  });
  return handleResponse(res);
};

export const postRequest = async (endpoint, data = {}, options = {}) => {
  const token = await getToken();
  const isFormData = data instanceof FormData;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      authorization: `Bearer ${token}`,
      ...options?.headers,
    },
    body: isFormData ? data : JSON.stringify(data),
  });

  return handleResponse(res);
};

export const deleteRequest = async (endpoint, id, options = {}) => {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}${endpoint}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });
  return handleResponse(res);
};

const handleResponse = async (response) => {
  try {
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));

      return {
        status: false,
        message: error?.message || "Something went wrong",
      };
    }
    const data = await response.json();
    return { status: true, ...data };
  } catch (error) {
    return {
      status: false,
      message: error?.message || "Something went wrong",
    };
  }
};
