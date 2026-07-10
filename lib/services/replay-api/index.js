import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const replayApi = createApi({
  reducerPath: "replayApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/replay" }),
  // The bundled recording never changes during a session — cache it for the
  // full hour. An uploaded match is parsed in the browser, not fetched here.
  keepUnusedDataFor: 3600,
  endpoints: (builder) => ({
    getReplayEvents: builder.query({
      query: () => "/events",
    }),
  }),
});

export const { useGetReplayEventsQuery } = replayApi;
