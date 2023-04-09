import { FC } from 'react';
import { StyledPlot } from './StyledPlot';

interface HeatmapProps {
    zGrid: number[][];
}

export const Heatmap: FC<HeatmapProps> = ({ zGrid }) => {
    const data = {
        z: zGrid,
        type: 'heatmap',
    };

    return <StyledPlot data={[data]} />;
};
