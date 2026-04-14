import { combineReducers } from "@reduxjs/toolkit";
import { api } from "../services/api";
import { pcobApi } from "../services/pcob-api";
import { widgetApi } from "../services/widget-api";


const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  [pcobApi.reducerPath]: pcobApi.reducer,
  [widgetApi.reducerPath]: widgetApi.reducer,
  // Add other reducers here
});

export default rootReducer;
