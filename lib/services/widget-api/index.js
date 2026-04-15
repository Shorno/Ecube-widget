import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL;

export const widgetApi = createApi({
  reducerPath: "widgetApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
  }),
  keepUnusedDataFor: 5,
  refetchOnMountOrArgChange: false,
  endpoints: (builder) => ({
    getAfterMatchScore: builder.query({
      query: ({ tournamentID }) => `vmix/${tournamentID}/match/team-scoreboard`,
    }),
    getAfterMatchScoreGroup: builder.query({
      query: ({ tournamentID }) => `vmix/${tournamentID}/group/team-scoreboard`,
    }),
    getWwcdTeamStats: builder.query({
      query: ({ tournamentID }) => `vmix/${tournamentID}/wwcd`,
    }),
    getMatchSummary: builder.query({
      query: ({ tournamentID }) => `vmix/${tournamentID}/match/summary`,
    }),
    getTopPlayers: builder.query({
      query: ({ tournamentID }) => `vmix/${tournamentID}/top-players`,
    }),
    getTopPlayersGroup: builder.query({
      query: ({ tournamentID }) => `vmix/${tournamentID}/top-players-group`,
    }),
    getHeadToHead: builder.query({
      query: ({ tournamentID }) =>
        `vmix/${tournamentID}/match/top-teams?limit=2`,
    }),
    getMvpMatch: builder.query({
      query: ({ tournamentID }) => `vmix/${tournamentID}/match/mvp`,
    }),
    getMvpGroup: builder.query({
      query: ({ tournamentID }) => `vmix/${tournamentID}/group/mvp`,
    }),
    // --- UPDATED WITH SSE ---
    getLiveRanking: builder.query({
      // 1. Initial query
      query: ({ tournamentID }) =>
        `/matches/active-match/rank-data/${tournamentID}`,

      // 2. SSE lifecycle method
      async onCacheEntryAdded(
        { tournamentID },
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        // Construct your EventSource URL.
        // Note: may need to adjust this URL if server uses a specific path for the stream (e.g., adding '/stream' at the end)
        const streamUrl = `${apiBaseUrl}/matches/active-match/rank-data/${tournamentID}`;
        const eventSource = new EventSource(streamUrl);

        try {
          // Wait for the initial query to finish
          await cacheDataLoaded;

          // Listen for incoming SSE messages
          eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);

            updateCachedData((draft) => {
              // Assuming the server sends the fully updated ranking list,
              // we replace the current draft with the new data.
              // If it sends partial updates, you would mutate 'draft' here instead.
              return data;
            });
          };

          eventSource.onerror = (error) => {
            console.error("SSE Error in getLiveRanking:", error);
          };
        } catch (error) {
          console.error(
            "Cache initialization failed for getLiveRanking:",
            error,
          );
        }

        // Clean up the SSE connection when the component unmounts
        await cacheEntryRemoved;
        eventSource.close();
      },
    }),
  }),
});

export const {
  useGetAfterMatchScoreQuery,
  useGetAfterMatchScoreGroupQuery,
  useGetWwcdTeamStatsQuery,
  useGetMatchSummaryQuery,
  useGetTopPlayersQuery,
  useGetTopPlayersGroupQuery,
  useGetHeadToHeadQuery,
  useGetMvpMatchQuery,
  useGetMvpGroupQuery,
  useGetLiveRankingQuery,
} = widgetApi;
