import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./userSlice";
import movieSlice from "./movieSlice";
import showSlice from "./showSlice";
import theaterSlice from "./theaterSlice";
import bookingSlice from "./bookingSlice";

const store = configureStore({
    reducer: {
        userState: userSlice.reducer,
        movieState: movieSlice.reducer,
        showState: showSlice.reducer,
        theaterState: theaterSlice.reducer,
        bookingState: bookingSlice.reducer
    }
});

export default store;