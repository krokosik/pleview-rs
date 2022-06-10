import { createEntityAdapter, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { ColorScalePoint } from '../models';
import type { RootState } from '../../store';

const colorsAdapter = createEntityAdapter<ColorScalePoint>({
    selectId: (color) => color.id,
    sortComparer: (a, b) => a.offset - b.offset,
});

const colorScaleSlice = createSlice({
    name: 'colorScale',
    initialState: colorsAdapter.getInitialState({
        selectedPoint: '',
    }),
    reducers: {
        addPoint: (state, action: PayloadAction<number>) => {
            const id = nanoid();
            colorsAdapter.addOne(state, { id, offset: Math.max(0, Math.min(0.99, action.payload)), color: '#000' });
            state.selectedPoint = id;
        },
        removePoint: (state, action: PayloadAction<string>) => {
            colorsAdapter.removeOne(state, action.payload);
        },
        selectPoint: (state, action: PayloadAction<string>) => {
            state.selectedPoint = action.payload;
        },
        updateColor: (state, action: PayloadAction<string>) => {
            colorsAdapter.updateOne(state, { id: state.selectedPoint, changes: { color: action.payload } });
        },
        movePoint: (state, action: PayloadAction<number>) => {
            colorsAdapter.updateOne(state, { id: state.selectedPoint, changes: { offset: Math.max(0, Math.min(0.99, action.payload)) } });
        },
    },
});

export const { addPoint, removePoint, selectPoint, updateColor, movePoint } = colorScaleSlice.actions;
export const colorScaleReducer = colorScaleSlice.reducer;

const sliceSelector = (state: RootState) => state.colorScale;
export const colorScaleSelector = colorsAdapter.getSelectors(sliceSelector).selectAll;
export const selectedPointSelector = createSelector(sliceSelector, (state) => state.selectedPoint);
