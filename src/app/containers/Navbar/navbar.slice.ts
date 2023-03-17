import { createSelector, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../../store';

type NavbarState = {
    colorScaleEnabled: boolean;
};

const initialState: NavbarState = {
    colorScaleEnabled: false,
};

const navbarSlice = createSlice({
    name: 'navbar',
    initialState,
    reducers: {
        toggleColorScale: (state) => void (state.colorScaleEnabled = !state.colorScaleEnabled),
    },
});

export const { toggleColorScale } = navbarSlice.actions;
export const navbarReducer = navbarSlice.reducer;

const sliceSelector = (state: RootState) => state.navbar;

export const colorScaleEnabledSelector = createSelector(sliceSelector, (state) => state.colorScaleEnabled);
