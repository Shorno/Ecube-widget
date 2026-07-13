import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL;

export const widgetApi = createApi({
  reducerPath: "widgetApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
  }),
  keepUnusedDataFor: 5,
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    getAfterMatchScore: builder.query({
      query: ({ tournamentID }) =>
        `/vmix/${tournamentID}/match/team-scoreboard`,
    }),
    getAfterMatchScoreGroup: builder.query({
      query: ({ tournamentID }) =>
        `/vmix/${tournamentID}/group/team-scoreboard`,
    }),
    getWwcdTeamStats: builder.query({
      query: ({ tournamentID }) => `/vmix/${tournamentID}/match/wwcd-team`,
    }),
    getMatchSummary: builder.query({
      query: ({ tournamentID }) => `/vmix/${tournamentID}/match/summary`,
    }),
    getMapRotation: builder.query({
      query: ({ tournamentID, cacheBuster }) => {
        const path = `/vmix/${tournamentID}/map-rotation`;
        return cacheBuster ? `${path}?_=${cacheBuster}` : path;
      },
    }),
    getLiveMatchInfo: builder.query({
      query: ({ tournamentID }) => ({
        url: `/vmix/${tournamentID}/live-match-info`,
        cache: "no-store",
      }),
    }),
    getTopPlayers: builder.query({
      query: ({ tournamentID }) =>
        `/vmix/${tournamentID}/match/top-players?limit=5`,
    }),
    getTopPlayersGroup: builder.query({
      query: ({ tournamentID }) =>
        `/vmix/${tournamentID}/group/top-players?limit=5`,
    }),
    getHeadToHead: builder.query({
      query: ({ tournamentID }) =>
        `/vmix/${tournamentID}/match/top-teams?limit=2`,
    }),
    getMvpMatch: builder.query({
      query: ({ tournamentID }) => `/vmix/${tournamentID}/match/mvp`,
    }),
    getMvpGroup: builder.query({
      query: ({ tournamentID }) => `/vmix/${tournamentID}/group/mvp`,
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
  useGetMapRotationQuery,
  useGetLiveMatchInfoQuery,
  useGetTopPlayersQuery,
  useGetTopPlayersGroupQuery,
  useGetHeadToHeadQuery,
  useGetMvpMatchQuery,
  useGetMvpGroupQuery,
  useGetLiveRankingQuery,
} = widgetApi;
