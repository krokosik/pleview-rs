import { Card } from '@blueprintjs/core';
import { FC } from 'react';
import { ColorInputSection, GradientBar } from './components';

export const ColorScalePicker: FC = () => (
    <Card elevation={3} className="tool-container">
        <GradientBar />
        <ColorInputSection />
    </Card>
);
