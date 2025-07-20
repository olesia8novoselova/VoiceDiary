// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { API_CONFIG } from "../../config";


// export const totalsApi = createApi({
//   reducerPath: "totalsApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: API_CONFIG.BASE_URL,
//     credentials: "include",
//     prepareHeaders: (headers, { getState }) => {
//       return headers;
//     },
//   }),
//   tagTypes: ["Totals"],
//   endpoints: (builder) => ({
//     getTotals: builder.query({
//       query: ({ userId, startDate, endDate }) => ({
//         url: API_CONFIG.ENDPOINTS.TOTALS.GET.replace(":userID", userId),
//         params: { start_date: startDate, end_date: endDate },
//       }),
//       providesTags: ["Totals"],
//       transformResponse: (response) => {
//         if (!response.success) {
//           console.error("[GET TOTALS] Error response:", response);
//           return { success: false, data: [] };
//         }
//         console.log("[GET TOTALS] Success:", response);
//         return response;
//       },
//       transformErrorResponse: (response) => {
//         console.error("[GET TOTALS] Error:", {
//           status: response.status,
//           data: response.data,
//         });
//         return {
//           success: false,
//           error: response.data?.error || "Failed to fetch totals",
//         };
//       },
//     }),
//     recalculateTotals: builder.mutation({
//       query: ({ userId, date }) => ({
//         url: API_CONFIG.ENDPOINTS.TOTALS.RECALCULATE
//           .replace(":userID", userId)
//           .replace(":date", date),
//         method: "POST",
//       }),
//       invalidatesTags: ["Totals"],
//       transformResponse: (response) => {
//         console.log("[RECALCULATE TOTALS] Success:", response);
//         return response;
//       },
//       transformErrorResponse: (response) => {
//         console.error("[RECALCULATE TOTALS] Error:", {
//           status: response.status,
//           data: response.data,
//         });
//         return response;
//       },
//     }),
//   }),
// });

// export const { useGetTotalsQuery, useRecalculateTotalsMutation } = totalsApi;


import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_CONFIG } from "../../config";

export const totalsApi = createApi({
  reducerPath: "totalsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.BASE_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      return headers;
    },
  }),
  tagTypes: ["Totals"],
  endpoints: (builder) => ({
    getTotals: builder.query({
      query: ({ userId, startDate, endDate }) => ({
        url: API_CONFIG.ENDPOINTS.TOTALS.GET.replace(":userID", userId),
        params: { start_date: startDate, end_date: endDate },
      }),
      providesTags: ["Totals"],
      transformResponse: (response) => {
        if (!response.success) {
          console.error("[GET TOTALS] Error response:", response);
          return { success: false, data: [] };
        }
        console.log("[GET TOTALS] Success:", response);
        return response;
      },
      transformErrorResponse: (response) => {
        console.error("[GET TOTALS] Error:", {
          status: response.status,
          data: response.data,
        });
        return {
          success: false,
          error: response.data?.error || "Failed to fetch totals",
        };
      },
    }),
    recalculateTotals: builder.mutation({
      query: ({ userId, date }) => ({
        url: API_CONFIG.ENDPOINTS.TOTALS.RECALCULATE
          .replace(":userID", userId)
          .replace(":date", date),
        method: "POST",
      }),
      invalidatesTags: ["Totals"],
      transformResponse: (response) => {
        console.log("[RECALCULATE TOTALS] Success:", response);
        return response;
      },
      transformErrorResponse: (response) => {
        console.error("[RECALCULATE TOTALS] Error:", {
          status: response.status,
          data: response.data,
        });
        return response;
      },
    }),
    updateMood: builder.mutation({
      query: ({ userId, date, emotion }) => ({
        url: API_CONFIG.ENDPOINTS.TOTALS.UPDATE_MOOD
          .replace(":userID", userId)
          .replace(":date", date),
        method: "POST",
        body: { emotion },
      }),
      invalidatesTags: ["Totals"],
      transformResponse: (response) => {
        console.log("[UPDATE MOOD] Success:", response);
        return response;
      },
      transformErrorResponse: (response) => {
        console.error("[UPDATE MOOD] Error:", {
          status: response.status,
          data: response.data,
        });
        return {
          success: false,
          error: response.data?.error || "Failed to update mood",
        };
      },
    }),
  }),
});

export const { 
  useGetTotalsQuery, 
  useRecalculateTotalsMutation,
  useUpdateMoodMutation 
} = totalsApi;