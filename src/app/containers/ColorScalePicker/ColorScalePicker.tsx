import { Card } from '@blueprintjs/core';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { colorInputSelector } from '../../store';
import { ColorInputSection, GradientBar } from './components';

export const ColorScalePicker: FC = () => {
    const dispatch = useDispatch();
    const color = useSelector(colorInputSelector);

    return (
        <Card elevation={3} className="tool-container">
            <GradientBar />
            <ColorInputSection />
        </Card>
    );
};
