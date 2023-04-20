import { FC, useCallback, useMemo, useRef } from 'react';
import Plotly, { ColorScale, Data, PlotMouseEvent } from 'plotly.js';
import createPlotlyComponent from 'react-plotly.js/factory';
import { select } from 'd3-selection';
import { merge } from 'lodash';
import { D3DragEvent, drag } from 'd3-drag';
import { useSelector } from 'react-redux';
import { blueprintLayout, getMarkerShapeLayout, snapMarker } from '../../../utils';
import { colorScaleSelector } from '../../ColorScalePicker/color-scale.slice';
import { ColorScalePoint } from '../../../models';
import { useDebounce } from '../../../hooks';

const Plot = createPlotlyComponent(Plotly);

interface HeatmapProps {
    xData: number[];
    yData: number[];
    centralPixelX: number;
    centralPixelY: number;
    zGrid: number[][];
    onMarkerDragX?: (pixel: number) => void;
    onMarkerDragY?: (pixel: number) => void;
}

export const Heatmap: FC<HeatmapProps> = ({ zGrid, xData, yData, centralPixelX, centralPixelY, onMarkerDragX, onMarkerDragY }) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const colorScale = useSelector(colorScaleSelector);

    const colorscale = useDebounce(colorScaleMapper(colorScale), 100);
    const data: Partial<Data> = useMemo(
        () => ({
            x: xData,
            y: yData,
            z: zGrid,
            type: 'heatmap',
        }),
        [xData, yData, zGrid],
    );
    data.colorscale = colorscale;

    const [x0, x1] = snapMarker(centralPixelX, xData);
    const [y0, y1] = snapMarker(centralPixelY, yData);

    const layout = useMemo(
        () =>
            merge({}, blueprintLayout, {
                shapes: [...getMarkerShapeLayout({ x0, x1, xData, yData }), ...getMarkerShapeLayout({ y0, y1, xData, yData })],
            }),
        [x0, x1, y0, y1, xData, yData],
    );

    const registerDrag = useCallback(() => {
        const shape = select(ref.current).select('g.layer-above').select('g.shapelayer').selectAll('path');
        shape
            .style('pointer-events', 'all')
            .style('cursor', 'move')
            // eslint-disable-next-line func-names
            .each(function (_, i) {
                if (i % 2 === 0) {
                    select(this).style('fill-opacity', '0.4');
                }
            });
        let closestIndexX = centralPixelX;
        let closestIndexY = centralPixelY;
        shape.call(
            // @ts-ignore - d3 typings are terrible, I don't think it's worth fixing
            drag().on('drag', (e: D3DragEvent<SVGPathElement, never, number>) => {
                const { x, y, width, height } = (select(ref.current).select('g.plot').node() as SVGPathElement).getBoundingClientRect();
                closestIndexX = Math.max(Math.min(Math.round(((e.x - x) / width) * (xData.length - 1)), xData.length - 1), 0);
                if (closestIndexX !== centralPixelX) {
                    onMarkerDragX?.(closestIndexX);
                }
                closestIndexY = Math.max(Math.min(Math.round((1 - (e.y - y) / height) * (yData.length - 1)), yData.length - 1), 0);
                if (closestIndexY !== centralPixelY) {
                    onMarkerDragY?.(closestIndexY);
                }
            }),
        );
    }, [centralPixelX, centralPixelY, onMarkerDragX, onMarkerDragY, xData.length, yData.length]);

    const onClick = useCallback(
        ({ points: [point] }: PlotMouseEvent) => {
            if (point) {
                const [pointIndexY, pointIndexX] = point.pointIndex as unknown as number[];
                if (pointIndexX !== centralPixelX) {
                    onMarkerDragX?.(pointIndexX);
                }
                if (pointIndexY !== centralPixelY) {
                    onMarkerDragY?.(pointIndexY);
                }
            }
        },
        [centralPixelX, centralPixelY, onMarkerDragX, onMarkerDragY],
    );

    return (
        <div ref={ref} style={{ height: '100%', width: '100%' }}>
            <Plot
                data={[data]}
                layout={layout}
                useResizeHandler
                style={{ height: '100%', width: '100%' }}
                onClick={onClick}
                onAfterPlot={registerDrag}
            />
        </div>
    );
};

const colorScaleMapper = (colorScale: ColorScalePoint[]): ColorScale | string => {
    if (colorScale.length === 0) {
        return 'RdBu';
    }

    const result = colorScale.map(({ offset, color }) => [offset, color] as const);
    if (result[0][0] !== 0) {
        result.unshift([0, result[0][1]]);
    }
    if (result[result.length - 1][0] !== 1) {
        result.push([1, result[result.length - 1][1]]);
    }
    return result as ColorScale;
};
