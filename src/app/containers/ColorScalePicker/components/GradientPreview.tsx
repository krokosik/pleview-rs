import styled from '@emotion/styled';
import { forwardRef, FC } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { sortBy, prop } from 'remeda';
import { ColorScalePoint } from '../../../models';
import { addPoint, colorInputSelector, colorScaleSelector } from '../../../store';

export interface GradientPreviewProps {}

const StyledGradientPreview = styled('div')<{ colors: ColorScalePoint[]; colorInput: string }>`
    background: ${({ colors, colorInput }) => (colors.length > 1 ? getCssGradient(colors) : colorInput)};
    position: relative;
    width: 100%;
    height: 28px;
    border-radius: 4px;
    flex-grow: 0 !important;
    display: flex;
    align-items: center;
    margin: 2px 0;
`;

export const GradientPreview: FC<GradientPreviewProps> = forwardRef<HTMLDivElement>(({ children, ...props }, ref) => {
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

const getCssGradient = (colors: ColorScalePoint[]) => `linear-gradient(
    to right,
    ${sortBy(colors, prop('offset'))
        .map(({ offset, color }) => `${color} ${offset * 100}%`)
        .join(', ')}
)`;
