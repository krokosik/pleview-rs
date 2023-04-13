import { FC, useCallback, useMemo, useRef } from 'react';
import { Data } from 'plotly.js';
import Plot from 'react-plotly.js';
import { select } from 'd3-selection';
import { merge } from 'lodash';
import { D3DragEvent, drag } from 'd3-drag';
import { blueprintLayout, getShapeLayout, snapMarker } from '../../../utils';

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

    const data: Partial<Data> = {
        x: xData,
        y: yData,
        z: zGrid,
        type: 'heatmap',
    };

    const [x0, x1] = snapMarker(centralPixelX, xData);
    const [y0, y1] = snapMarker(centralPixelY, yData);

    const layout = useMemo(() => merge({}, blueprintLayout, { shapes: [getShapeLayout({ x0, x1 }), getShapeLayout({ y0, y1 })] }), [x0, x1, y0, y1]);

    const registerDrag = useCallback(() => {
        const shape = select(ref.current).select('g.layer-above').select('g.shapelayer').selectAll('path');
        shape.style('pointer-events', 'all').style('cursor', 'move');
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

    return (
        <div ref={ref} style={{ height: '100%', width: '100%' }}>
            <Plot
                data={[data]}
                layout={layout}
                useResizeHandler
                style={{ height: '100%', width: '100%' }}
                onClick={({ points: [point] }) => {
                    if (point) {
                        const [pointIndexY, pointIndexX] = point.pointIndex as unknown as number[];
                        if (pointIndexX !== centralPixelX) {
                            onMarkerDragX?.(pointIndexX);
                        }
                        if (pointIndexY !== centralPixelY) {
                            onMarkerDragY?.(pointIndexY);
                        }
                    }
                }}
                onAfterPlot={registerDrag}
            />
        </div>
    );
};
