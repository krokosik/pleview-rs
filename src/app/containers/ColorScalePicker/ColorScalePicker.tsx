import { Card, Divider } from '@blueprintjs/core';
import { FC } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useDispatch, useSelector } from 'react-redux';
import { colorInputSelector, updateColor } from '../../store';
import { ColorForm, GradientBar, PointList } from './components';

export const ColorScalePicker: FC = () => {
    const dispatch = useDispatch();
    const color = useSelector(colorInputSelector);

    return (
        <Card elevation={3} className="tool-container">
            <GradientBar />
            <Divider />
            <div className="tool-container-content">
                <HexColorPicker color={color} onChange={(value) => dispatch(updateColor(value))} />
                <ColorForm />
                <PointList />
            </div>
        </Card>
    );
};
