import {configureStore} from "@reduxjs/toolkit";
import {boardReducer} from "./slice/board";
import {setupListeners} from "@reduxjs/toolkit/query";

export const store = configureStore({
    reducer: {
        figure: boardReducer
    }
})

setupListeners(store.dispatch)

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>