import { Colors } from '@blueprintjs/core';
import { Layout, Shape } from 'plotly.js';

export const snapMarker = (x: number, xData: number[]): [number, number] => {
    const x0 = x > 0 ? (xData[x - 1] + xData[x]) / 2 : 2 * xData[x] - xData[x + 1];
    const x1 = x < xData.length - 1 ? (xData[x] + xData[x + 1]) / 2 : 2 * xData[x] - xData[x - 1];

    return [x0, x1];
};

export const getMarkerShapeLayout = ({
    x0 = 0,
    x1 = 1,
    y0 = 0,
    y1 = 1,
    xData,
    yData,
}: {
    x0?: number;
    x1?: number;
    y0?: number;
    y1?: number;
    xData: number[];
    yData: number[];
}): Array<Partial<Shape>> => {
    const xref = x0 === 0 && x1 === 1 ? 'paper' : 'x';
    const yref = y0 === 0 && y1 === 1 ? 'paper' : 'y';

    const paddingFactor = 0.015;

    const xDataMin = Math.min(...xData);
    const xDataMax = Math.max(...xData);
    const yDataMin = Math.min(...yData);
    const yDataMax = Math.max(...yData);

    const normalizedX = ((x1 + x0) / 2 - xDataMin) / (xDataMax - xDataMin);
    const normalizedY = ((y1 + y0) / 2 - yDataMin) / (yDataMax - yDataMin);

    return [
        {
            type: 'rect',
            xref,
            x0,
            x1,
            yref,
            y0,
            y1,
            line: {
                color: Colors.BLUE5,
                width: 1,
            },
            fillcolor: 'rgb(45, 114, 210, 0.2)',
        },
        {
            type: 'rect',
            xref: 'paper',
            x0: xref === 'x' ? normalizedX - paddingFactor : 0,
            x1: xref === 'x' ? normalizedX + paddingFactor : 1,
            yref: 'paper',
            y0: yref === 'y' ? normalizedY - paddingFactor : 0,
            y1: yref === 'y' ? normalizedY + paddingFactor : 1,
            line: { width: 0 },
            fillcolor: 'transparent',
        },
    ];
};

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
