import { Colors } from '@blueprintjs/core';
import { Layout } from 'plotly.js';

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
