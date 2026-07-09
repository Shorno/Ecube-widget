import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import rootReducer from "./rootReducer";
import { widgetApi } from "../services/widget-api";
import { replayApi } from "../services/replay-api";

export const makeStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(widgetApi.middleware, replayApi.middleware),
  });

  setupListeners(store.dispatch);
  return store;
};
