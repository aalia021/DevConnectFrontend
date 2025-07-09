import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import FeedReducer from "./feedSlice";
import ConnectionReducer from "./connectionSlice";
import requestReducer from "./requestsSlice";

export const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: FeedReducer,
    connections: ConnectionReducer,
    requests: requestReducer,
  },
});
