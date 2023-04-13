import { Card } from '@blueprintjs/core';
import { FC, useCallback, useEffect, useState } from 'react';
import { Visualizations } from '../../enums';
import { Heatmap, Linechart } from './components';
import { getInitialData, updateCrossSection } from '../../utils';

interface VizProps {
    viz: Visualizations;
}

export const Viz: FC<VizProps> = ({ viz }) => {
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [xData, setXData] = useState<number[]>([]);
    const [yzData, setYZData] = useState<number[]>([]);
    const [yData, setYData] = useState<number[]>([]);
    const [xzData, setXZData] = useState<number[]>([]);
    const [zGrid, setZGrid] = useState<number[][]>([]);

    useEffect(() => {
        void getInitialData().then(([csData, newZGrid]) => {
            setZGrid(newZGrid);
            setX(csData.central_pixels[0]);
            setY(csData.central_pixels[1]);
            setXData(csData.curve[0][0]);
            setYZData(csData.curve[0][1]);
            setYData(csData.curve[1][0]);
            setXZData(csData.curve[1][1]);
        });
    }, []);

    const updateXZCrossSection = useCallback((pixel: number) => {
        setX(pixel);
        void updateCrossSection('y', pixel).then(setXZData);
    }, []);

    const updateYZCrossSection = useCallback((pixel: number) => {
        setY(pixel);
        void updateCrossSection('x', pixel).then(setYZData);
    }, []);

    return viz === Visualizations.CrossSections ? (
        <>
            <Card style={{ height: '50%' }}>
                <Linechart xData={xData} yData={yzData} centralPixel={x} onMarkerDrag={updateXZCrossSection} />
            </Card>
            <Card style={{ height: '50%' }}>
                <Linechart xData={yData} yData={xzData} centralPixel={y} onMarkerDrag={updateYZCrossSection} />
            </Card>
        </>
    ) : (
        <Card>
            {/* The Plotly heatmap has inverted XY axes in comparison to legacy Pleview and the engine implementation */}
            <Heatmap
                zGrid={zGrid}
                xData={yData}
                yData={xData}
                centralPixelX={y}
                centralPixelY={x}
                onMarkerDragX={updateYZCrossSection}
                onMarkerDragY={updateXZCrossSection}
            />
        </Card>
    );
};
