import { combineReducers } from "@reduxjs/toolkit";
import { widgetApi } from "../services/widget-api";
import { replayApi } from "../services/replay-api";

const rootReducer = combineReducers({
  [widgetApi.reducerPath]: widgetApi.reducer,
  [replayApi.reducerPath]: replayApi.reducer,
});

export default rootReducer;
