import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import rootReducer from "./rootReducer";
import { api } from "../services/api";
import { pcobApi } from "../services/pcob-api";
import { widgetApi } from "../services/widget-api";

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware, pcobApi.middleware, widgetApi.middleware),
  });
};

setupListeners(makeStore().dispatch);
