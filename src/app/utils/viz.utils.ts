import { Colors } from '@blueprintjs/core';
import { Layout, Shape } from 'plotly.js';

export const snapMarker = (x: number, xData: number[]): [number, number] => {
    const x0 = x > 0 ? (xData[x - 1] + xData[x]) / 2 : 2 * xData[x] - xData[x + 1];
    const x1 = x < xData.length - 1 ? (xData[x] + xData[x + 1]) / 2 : 2 * xData[x] - xData[x - 1];

    return [x0, x1];
};

export const getShapeLayout = ({ x0 = 0, x1 = 1, y0 = 0, y1 = 1 }: Partial<{ x0: number; x1: number; y0: number; y1: number }>): Partial<Shape> => ({
    type: 'rect',
    xref: x0 === 0 && x1 === 1 ? 'paper' : 'x',
    x0,
    x1,
    yref: y0 === 0 && y1 === 1 ? 'paper' : 'y',
    y0,
    y1,
    line: {
        color: 'rgb(55, 128, 191)',
        width: 1,
    },
    fillcolor: 'rgba(55, 128, 191, 0.6)',
});

export const blueprintLayout: Partial<Layout> = {
    autosize: true,
    font: {
        color: Colors.LIGHT_GRAY1,
    },
    xaxis: {
        color: Colors.LIGHT_GRAY1,
        titlefont: {
            color: Colors.LIGHT_GRAY1,
        },
        tickfont: {
            color: Colors.LIGHT_GRAY1,
        },
    },
    yaxis: {
        color: Colors.LIGHT_GRAY1,
        titlefont: {
            color: Colors.LIGHT_GRAY1,
        },
        tickfont: {
            color: Colors.LIGHT_GRAY1,
        },
    },
    legend: {
        font: {
            color: Colors.LIGHT_GRAY1,
        },
    },
    margin: { l: 40, r: 40, b: 40, t: 40, pad: 4 },
    plot_bgcolor: 'transparent',
    paper_bgcolor: 'transparent',
};
