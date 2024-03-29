import styled from '@emotion/styled';
import { forwardRef, ReactNode } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { ColorScalePoint } from '../../../models';
import { addPoint, colorInputSelector, colorScaleSelector } from '../color-scale.slice';

export interface GradientPreviewProps {
    children?: ReactNode;
}

const StyledGradientPreview = styled('div')<{ colors: ColorScalePoint[]; colorInput: string }>`
    background: ${({ colors, colorInput }) => getCssGradient(colors) ?? colorInput};
    position: relative;
    width: 100%;
    height: 28px;
    border-radius: 2px;
    flex-grow: 0 !important;
    display: flex;
    align-items: center;
    margin-top: 4.5px;
    margin-bottom: 7.5px;
    box-shadow: 0 0 0 0 rgba(76, 144, 240, 0), 0 0 0 0 rgba(76, 144, 240, 0), 0 0 0 0 rgba(76, 144, 240, 0), inset 0 0 0 1px rgba(255, 255, 255, 0.2),
        inset 0 -1px 1px 0 #8f99a8;
`;

export const GradientPreview = forwardRef<HTMLDivElement, GradientPreviewProps>(({ children, ...props }, ref) => {
    const dispatch = useDispatch();
    const colorScale = useSelector(colorScaleSelector);
    const colorInput = useSelector(colorInputSelector);

    return (
        <StyledGradientPreview
            {...props}
            ref={ref}
            colors={colorScale}
            colorInput={colorInput}
            onClick={(e) => {
                const { x, width } = e.currentTarget.getBoundingClientRect();
                dispatch(addPoint((e.clientX - x) / width - 0.005));
            }}
        >
            {children}
        </StyledGradientPreview>
    );
});

const getCssGradient = (colors: ColorScalePoint[]): string | undefined =>
    colors.length > 1
        ? `linear-gradient(
    to right,
    ${colors.map(({ offset, color }) => `${color} ${offset * 100}%`).join(', ')}
)`
        : colors[0]?.color;
