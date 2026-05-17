import { combineReducers } from "@reduxjs/toolkit";
import { widgetApi } from "../services/widget-api";

const rootReducer = combineReducers({
  [widgetApi.reducerPath]: widgetApi.reducer,
});

export default rootReducer;
