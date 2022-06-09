import { configureStore } from '@reduxjs/toolkit';
import { colorScaleReducer } from './app/store';

export const store = configureStore({
    reducer: {
        colorScale: colorScaleReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
