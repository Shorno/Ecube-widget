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
      query: ({ tournamentID }) => `${tournamentID}/match/team-scoreboard`,
    }),
    getAfterMatchScoreGroup: builder.query({
      query: ({ tournamentID }) => `${tournamentID}/after-match-score-group`,
    }),
    getWwcdTeamStats: builder.query({
      query: ({ tournamentID }) => `${tournamentID}/wwcd`,
    }),
    getMatchSummary: builder.query({
      query: ({ tournamentID }) => `${tournamentID}/match-summary`,
    }),
    getTopPlayers: builder.query({
      query: ({ tournamentID }) => `${tournamentID}/top-players`,
    }),
    getTopPlayersGroup: builder.query({
      query: ({ tournamentID }) => `${tournamentID}/top-players-group`,
    }),
    getHeadToHead: builder.query({
      query: ({ tournamentID }) => `${tournamentID}/head-to-head`,
    }),
    getMvpMatch: builder.query({
      query: ({ tournamentID }) => `${tournamentID}/mvp-match`,
    }),
    getMvpGroup: builder.query({
      query: ({ tournamentID }) => `${tournamentID}/mvp-group`,
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
} = widgetApi;
