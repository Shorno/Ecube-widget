import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const replayApi = createApi({
  reducerPath: "replayApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/replay" }),
  // The recording never changes during a session — cache it for the full hour.
  keepUnusedDataFor: 3600,
  endpoints: (builder) => ({
    getReplayEvents: builder.query({
      query: () => "/events",
    }),
  }),
});

export const { useGetReplayEventsQuery } = replayApi;
