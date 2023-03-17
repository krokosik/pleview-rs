import { configureStore } from '@reduxjs/toolkit';
import { colorScaleReducer } from './app/containers/ColorScalePicker';
import { navbarReducer } from './app/containers/Navbar';

export const store = configureStore({
    reducer: {
        navbar: navbarReducer,
        colorScale: colorScaleReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
