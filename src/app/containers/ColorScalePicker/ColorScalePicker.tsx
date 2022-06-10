import { Card } from '@blueprintjs/core';
import { FC } from 'react';
import { GradientBar } from './components';

export const ColorScalePicker: FC = () => (
    <Card elevation={3} className="tool-container">
        <GradientBar />
        {/* <Divider /> */}
        {/* <div className="tool-container-content">
                <RgbColorPicker />
                <ColorForm />
                <PointList />
            </div> */}
    </Card>
);
