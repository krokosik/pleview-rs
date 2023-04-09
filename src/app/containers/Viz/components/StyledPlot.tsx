import Plot, { PlotParams } from 'react-plotly.js';
import { FC } from 'react';
import { Layout } from 'plotly.js';
import merge from 'just-merge';
import { Colors } from '@blueprintjs/core';

const blueprintLayout: Partial<Layout> = {
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
    margin: { l: 24, r: 24, b: 24, t: 24, pad: 4 },
    plot_bgcolor: 'transparent',
    paper_bgcolor: 'transparent',
};

export const StyledPlot: FC<PlotParams> = ({ layout = {}, ...props }) => (
    <Plot {...props} useResizeHandler layout={merge(blueprintLayout, layout)} style={{ height: 'calc(100% - 40px)', width: '100%' }} />
);
