import { Classes, ControlGroup, FormGroup, NumericInput } from '@blueprintjs/core';
import { FC } from 'react';
import { HexColorInput } from 'react-colorful';
import { useDispatch, useSelector } from 'react-redux';
import { colorInputSelector, updateColor } from '../../../store';
import { ColorUtils } from '../../../utils';

export const ColorForm: FC = () => {
    const dispatch = useDispatch();
    const color = useSelector(colorInputSelector);
    const colorObject = ColorUtils.hexToRgb(color ?? '#000000');

    return (
        <FormGroup>
            <ControlGroup>
                {Object.entries(colorObject).map(([key, value]) => (
                    <NumericInput
                        key={key}
                        min={0}
                        max={255}
                        fill
                        clampValueOnBlur
                        value={value as number}
                        onValueChange={(newValue) => dispatch(updateColor({ ...colorObject, [key]: newValue }))}
                    />
                ))}
            </ControlGroup>
            <HexColorInput
                color={color.toUpperCase()}
                onChange={(value) => dispatch(updateColor(value))}
                className={[Classes.INPUT, Classes.FILL].join(' ')}
            />
        </FormGroup>
    );
};
