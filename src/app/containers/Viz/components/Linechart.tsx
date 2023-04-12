import { FC, useCallback, useMemo, useRef } from 'react';
import { Data, Layout } from 'plotly.js';
import Plot from 'react-plotly.js';
import { select } from 'd3-selection';
import { D3DragEvent, drag } from 'd3-drag';
import { merge } from 'lodash';
import { blueprintLayout } from '../common-layout';

interface LinechartProps {
    xData: number[];
    yData: number[];
    centralPixel: number;
    onMarkerDrag?: (pixel: number) => void;
}

// TODO: fix marker not working on first render and weird jump at the beginning
export const Linechart: FC<LinechartProps> = ({ xData, yData, centralPixel, onMarkerDrag }) => {
    const ref = useRef<HTMLDivElement | null>(null);

    const data: Partial<Data> = {
        x: xData,
        y: yData,
        type: 'scatter',
        marker: { color: 'red' },
    };

    const [x0, x1] = snapMarker(centralPixel, xData);

    const layout = useMemo(
        () =>
            merge({}, blueprintLayout, {
                shapes: [
                    {
                        type: 'rect',
                        xref: 'x',
                        x0,
                        x1,
                        yref: 'paper',
                        y0: 0,
                        y1: 1,
                        line: {
                            color: 'rgb(55, 128, 191)',
                            width: 1,
                        },
                        fillcolor: 'rgba(55, 128, 191, 0.6)',
                    },
                ],
                hovermode: 'x',
            } as Partial<Layout>),
        [x0, x1],
    );

    const registerDrag = useCallback(() => {
        const shape = select(ref.current).select('g.layer-above').select('g.shapelayer').select('path');
        shape.style('pointer-events', 'all').style('cursor', 'ew-resize');
        let closestIndex = centralPixel;
        shape.call(
            // @ts-ignore - d3 typings are terrible, I don't think it's worth fixing
            drag().on('drag', (e: D3DragEvent<SVGPathElement, never, number>) => {
                const { x, width } = (select(ref.current).select('g.plot').node() as SVGPathElement).getBoundingClientRect();
                closestIndex = Math.max(Math.min(Math.round(((e.x - x) / width) * (xData.length - 1)), xData.length - 1), 0);
                if (closestIndex !== centralPixel) {
                    onMarkerDrag?.(closestIndex);
                }
            }),
        );
    }, [centralPixel, onMarkerDrag, xData.length]);

    return (
        <div style={{ height: '100%', width: '100%' }} ref={ref}>
            <Plot
                data={[data]}
                layout={layout}
                useResizeHandler
                style={{ height: '100%', width: '100%' }}
                onClick={({ points: [point] }) => {
                    if (point && point.pointIndex !== centralPixel) {
                        onMarkerDrag?.(point.pointIndex);
                    }
                }}
                onAfterPlot={registerDrag}
            />
            ;
        </div>
    );
};

const snapMarker = (x: number, xData: number[]): [number, number] => {
    const x0 = x > 0 ? (xData[x - 1] + xData[x]) / 2 : 2 * xData[x] - xData[x + 1];
    const x1 = x < xData.length - 1 ? (xData[x] + xData[x + 1]) / 2 : 2 * xData[x] - xData[x - 1];

    return [x0, x1];
};
