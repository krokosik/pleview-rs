import { Card, Slider } from '@blueprintjs/core';
import { FC, useMemo, useState } from 'react';
import { Visualizations } from '../../enums';
import { Heatmap, Linechart } from './components';

export interface DataPoint {
    x: number;
    y: number;
    z: number;
}

interface VizProps {
    viz: Visualizations;
}

const data: DataPoint[] = [];
const zGrid: number[][] = [];

const N_X = 10;
const N_Y = 1000;

const xData: number[] = [];
const yData: number[] = [];

for (let x = 0; x <= N_X; x++) {
    xData.push(x);
}

for (let y = 0; y <= N_Y; y++) {
    yData.push(y);
}

xData.forEach((x) => {
    const zRow: number[] = [];
    yData.forEach((y) => {
        data.push({
            x,
            y,
            z: Math.random() * 10,
        });
        zRow.push(Math.random() * 10);
    });
    zGrid.push(zRow);
});

export const Viz: FC<VizProps> = ({ viz }) => {
    const [x, setX] = useState(Math.floor(N_X / 2));
    const [y, setY] = useState(Math.floor(N_Y / 2));

    const yzData = useMemo(() => data.filter((d) => d.x === x).map((d) => d.z), [x]);
    const xzData = useMemo(() => data.filter((d) => d.y === y).map((d) => d.z), [y]);

    return viz === Visualizations.CrossSections ? (
        <>
            <Card style={{ height: '50%' }}>
                <Slider value={y} onChange={(v) => setY(v)} min={0} max={N_Y} stepSize={1} labelStepSize={N_Y / 10} />
                <Linechart xData={xData} yData={xzData} />
            </Card>
            <Card style={{ height: '50%' }}>
                <Slider value={x} onChange={(v) => setX(v)} min={0} max={N_X} stepSize={1} labelStepSize={N_X / 10} />
                <Linechart xData={yData} yData={yzData} />
            </Card>
        </>
    ) : (
        <Card>
            <Heatmap zGrid={zGrid} />
        </Card>
    );
};
