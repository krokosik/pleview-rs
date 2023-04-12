import { FC, useMemo } from 'react';
import { Data, Layout } from 'plotly.js';
import Plot from 'react-plotly.js';
import { merge } from 'lodash';
import { blueprintLayout } from '../common-layout';

interface LinechartProps {
    xData: number[];
    yData: number[];
    centralPixel: number;
    onMarkerDrag?: (pixel: number) => void;
    onMarkerDragEnd?: (pixel: number) => void;
}

export const Linechart: FC<LinechartProps> = ({ xData, yData, centralPixel, onMarkerDrag, onMarkerDragEnd }) => {
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

    return (
        <div style={{ height: '100%', width: '100%' }}>
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
