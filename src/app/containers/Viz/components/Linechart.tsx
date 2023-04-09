import { FC } from 'react';
import { StyledPlot } from './StyledPlot';

interface LinechartProps {
    xData: number[];
    yData: number[];
}

export const Linechart: FC<LinechartProps> = ({ xData, yData }) => {
    const data = {
        x: xData,
        y: yData,
        type: 'scatter',
        marker: { color: 'red' },
    };

    return <StyledPlot data={[data]} />;
};
