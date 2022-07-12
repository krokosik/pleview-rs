import { Classes, ControlGroup, FormGroup, NumericInput } from '@blueprintjs/core';
import styled from '@emotion/styled';
import { FC } from 'react';
import { HexColorInput } from 'react-colorful';
import { useDispatch, useSelector } from 'react-redux';
import { colorInputSelector, updateColor } from '../color-scale.slice';
import { ColorUtils } from '../../../utils';

const StyledColorForm = styled(FormGroup)`
    box-sizing: border-box;
    margin: 45px 8px 0 8px;
    z-index: 1;
`;

const StyledHexInput = styled(HexColorInput)`
    margin-top: 14px;
    text-align: center;
`;

export const ColorForm: FC = () => {
    const dispatch = useDispatch();
    const color = useSelector(colorInputSelector);
    const colorObject = ColorUtils.hexToRgb(color ?? '#000000');

    return (
        <StyledColorForm>
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
            <StyledHexInput
                color={color.toUpperCase()}
                onChange={(value) => dispatch(updateColor(value))}
                className={[Classes.INPUT, Classes.FILL].join(' ')}
            />
        </StyledColorForm>
    );
};
