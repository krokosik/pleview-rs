import { FC } from 'react';
import { Data, Layout } from 'plotly.js';
import Plot from 'react-plotly.js';
import { blueprintLayout } from '../common-layout';

interface HeatmapProps {
    zGrid: number[][];
}

export const Heatmap: FC<HeatmapProps> = ({ zGrid }) => {
    const data: Partial<Data> = {
        z: zGrid,
        type: 'heatmap',
    };

    const layout: Partial<Layout> = {
        ...blueprintLayout,
    };

    return <Plot data={[data]} layout={layout} useResizeHandler style={{ height: '100%', width: '100%' }} />;
};
