import { FC, useMemo } from 'react';
import { Data, Layout } from 'plotly.js';
import Plot from 'react-plotly.js';
import { blueprintLayout } from '../common-layout';

interface LinechartProps {
    xData: number[];
    yData: number[];
    centralPixel: number;
}

export const Linechart: FC<LinechartProps> = ({ xData, yData, centralPixel }) => {
    const data: Partial<Data> = {
        x: xData,
        y: yData,
        type: 'scatter',
        marker: { color: 'red' },
    };

    const x0 = centralPixel > 0 ? (xData[centralPixel - 1] + xData[centralPixel]) / 2 : 2 * xData[centralPixel] - xData[centralPixel + 1];
    const x1 =
        centralPixel < xData.length - 1 ? (xData[centralPixel] + xData[centralPixel + 1]) / 2 : 2 * xData[centralPixel] - xData[centralPixel - 1];

    const layout: Partial<Layout> = useMemo(
        () => ({
            ...blueprintLayout,
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
                        width: 3,
                    },
                    fillcolor: 'rgba(55, 128, 191, 0.6)',
                },
            ],
        }),
        [x0, x1],
    );

    return <Plot data={[data]} layout={layout} useResizeHandler style={{ height: 'calc(100% - 40px)', width: '100%' }} />;
};
