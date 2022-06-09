import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ColorScalePoint } from '../models';
import type { RootState } from '../../store';

export interface ColorScaleState {
    colorScale: ColorScalePoint[];
    selectedPoint: number;
}

const initialState: ColorScaleState = {
    colorScale: [
        { offset: 0, color: '#00f' },
        { offset: 0.5, color: '#0f0' },
        { offset: 1, color: '#f00' },
    ],
    selectedPoint: 1,
};

const colorScaleSlice = createSlice({
    name: 'colorScale',
    initialState,
    reducers: {
        addPoint: (state, action: PayloadAction<number>) => {
            state.colorScale.push({ offset: 10, color: '#000' });
            state.colorScale.sort((a, b) => a.offset - b.offset);
            state.selectedPoint = state.colorScale.findIndex((p) => p.offset === 10);
            state.colorScale[state.selectedPoint].offset = action.payload;
        },
        removePoint: (state, action: PayloadAction<number>) => {
            state.colorScale.splice(action.payload, 1);
        },
        selectPoint: (state, action: PayloadAction<number>) => {
            state.selectedPoint = action.payload;
        },
        updateColor: (state, action: PayloadAction<string>) => {
            state.colorScale[state.selectedPoint].color = action.payload;
        },
        movePoint: (state, action: PayloadAction<number>) => {
            state.colorScale[state.selectedPoint].offset = action.payload;
        },
    },
});

export const { addPoint, removePoint, selectPoint, updateColor, movePoint } = colorScaleSlice.actions;
export const colorScaleReducer = colorScaleSlice.reducer;

const sliceSelector = (state: RootState) => state.colorScale;
export const colorScaleSelector = createSelector(sliceSelector, (state) => state.colorScale);
export const selectedPointSelector = createSelector(sliceSelector, (state) => state.selectedPoint);
