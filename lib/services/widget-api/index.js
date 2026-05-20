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
      query: ({ tournamentID }) => `vmix/${tournamentID}/match/wwcd-team`,
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
    // Live ranking initial fetch — real-time updates handled via WebSocket in the component
    getLiveRanking: builder.query({
      query: ({ tournamentID }) =>
        `/matches/active-match/rank-data/${tournamentID}`,
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
