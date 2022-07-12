import styled from '@emotion/styled';
import { FC } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useDispatch, useSelector } from 'react-redux';
import { colorInputSelector, updateColor } from '../color-scale.slice';
import { ColorForm } from './ColorForm';
import { PointList } from './PointList';

const StyledColorInputSection = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 1fr;
    height: 120px;
`;

export const ColorInputSection: FC = () => {
    const dispatch = useDispatch();
    const color = useSelector(colorInputSelector);

    return (
        <StyledColorInputSection>
            <HexColorPicker color={color} onChange={(value) => dispatch(updateColor(value))} />
            <ColorForm />
            <PointList />
        </StyledColorInputSection>
    );
};
