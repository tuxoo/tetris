import {configureStore} from "@reduxjs/toolkit";
import {figureReducer} from "./slice/figure.slice";
import {setupListeners} from "@reduxjs/toolkit/query";

export const store = configureStore({
    reducer: {
        figure: figureReducer
    }
})

setupListeners(store.dispatch)

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>