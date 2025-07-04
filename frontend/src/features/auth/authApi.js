import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_CONFIG } from "../../config";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.BASE_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (credentials) => ({
        url: API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response) => {
        console.log("Server response:", response);
        return response;
      },
      transformErrorResponse: (response) => {
        console.error("Server error:", response);
        return response;
      },
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        method: "POST",
        body: credentials,
      }),
    }),
    getMe: builder.query({
      query: () => API_CONFIG.ENDPOINTS.AUTH.ME,
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useGetMeQuery } = authApi;
