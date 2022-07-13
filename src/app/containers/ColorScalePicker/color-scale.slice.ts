import { createEntityAdapter, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { find, isObject } from 'remeda';
import type { RgbColor } from 'react-colorful';
import { ColorScalePoint } from '../../models';
import type { RootState } from '../../../store';
import { lerpColor, rgbToHex } from '../../utils';

const colorsAdapter = createEntityAdapter<ColorScalePoint>({
    selectId: (color) => color.id,
    sortComparer: (a, b) => a.offset - b.offset,
});

const colorScaleSlice = createSlice({
    name: 'colorScale',
    initialState: colorsAdapter.getInitialState({
        selectedPointId: '1',
        colorInput: '#0f0',
        ids: ['0', '1', '2'],
        entities: {
            '0': { id: '0', color: '#ff0000', offset: 0 },
            '1': { id: '1', color: '#00ff00', offset: 0.5 },
            '2': { id: '2', color: '#0000ff', offset: 0.99 },
        },
    }),
    reducers: {
        addPoint: (state, action: PayloadAction<number>) => {
            const id = nanoid();
            colorsAdapter.addOne(state, {
                id,
                offset: Math.max(0, Math.min(0.99, action.payload)),
                color: state.colorInput.length === 7 || state.colorInput.length === 4 ? state.colorInput : '#fff',
            });
            state.selectedPointId = id;

            if (state.ids.length <= 1) {
                return;
            }

            const newIndex = state.ids.indexOf(id);
            const newPoint = state.entities[id]!;

            if (newIndex <= 0) {
                state.entities[id]!.color = state.entities[state.ids[1]]!.color;
            } else if (newIndex >= state.ids.length) {
                state.entities[id]!.color = state.entities[state.ids[state.ids.length - 2]]!.color;
            } else {
                const prev = state.entities[state.ids[newIndex - 1]]!;
                const next = state.entities[state.ids[newIndex + 1]]!;
                const factor = (newPoint.offset - prev.offset) / (next.offset - prev.offset);
                const color = lerpColor(prev.color, next.color, factor);
                colorsAdapter.updateOne(state, { id, changes: { color } });
                state.colorInput = color;
            }
        },
        removePoint: (state, action: PayloadAction<string>) => {
            colorsAdapter.removeOne(state, action.payload);
            state.selectedPointId = '';
        },
        selectPoint: (state, action: PayloadAction<string>) => {
            state.selectedPointId = action.payload;
            state.colorInput = colorsAdapter.getSelectors().selectById(state, action.payload)!.color;
        },
        updateColor: (state, action: PayloadAction<string | RgbColor>) => {
            let color = isObject(action.payload) ? rgbToHex(action.payload) : action.payload;
            if (color[0] !== '#') {
                color = `#${color}`;
            }
            if (color.length === 7 || color.length === 4) {
                state.colorInput = color;
                colorsAdapter.updateOne(state, { id: state.selectedPointId, changes: { color } });
            }
        },
        movePoint: (state, action: PayloadAction<number | string>) => {
            if (Number.isNaN(Number(action.payload))) {
                return;
            }
            colorsAdapter.updateOne(state, {
                id: state.selectedPointId,
                changes: { offset: Math.max(0, Math.min(0.99, Number(action.payload))) },
            });
        },
    },
});

export const { addPoint, removePoint, selectPoint, updateColor, movePoint } = colorScaleSlice.actions;
export const colorScaleReducer = colorScaleSlice.reducer;

const sliceSelector = (state: RootState) => state.colorScale;

const colorsSelectors = colorsAdapter.getSelectors(sliceSelector);
export const colorScaleSelector = colorsSelectors.selectAll;

export const selectedPointIdSelector = createSelector(sliceSelector, (state) => state.selectedPointId);

export const colorInputSelector = createSelector(sliceSelector, (state) => state.colorInput);

export const isPointSelectedSelector = createSelector(sliceSelector, (state) => state.selectedPointId !== '');

export const selectedPointSelector = createSelector(colorScaleSelector, selectedPointIdSelector, (colors, selectedPointId) =>
    find(colors, ({ id }) => id === selectedPointId),
);

export const selectedPointColorSelector = createSelector(selectedPointSelector, (point) => point?.color);