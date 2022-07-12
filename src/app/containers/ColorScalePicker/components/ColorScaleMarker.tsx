import styled from '@emotion/styled';
import { FC } from 'react';
import { DraggableCore } from 'react-draggable';
import { useDispatch, useSelector } from 'react-redux';
import { ColorScalePoint } from '../../../models';
import { movePoint, removePoint, selectedPointIdSelector, selectPoint } from '../color-scale.slice';

export interface ColorScaleMarkerProps {
    point: ColorScalePoint;
    parentWidth: number;
}

const StyledColorScaleMarker = styled('div')<{ color: string; selected: boolean; offsetInPx: number }>`
    position: absolute;
    left: 0;
    top: 0;
    height: 110%;
    width: 1%;
    transform: translate(${({ offsetInPx }) => offsetInPx}px, -${({ selected }) => (selected ? 1.2 : 1) * 10}%)
        scaleY(${({ selected }) => (selected ? 1.2 : 1)});
    transform-origin: center;
    border-width: 2px;
    border-style: solid;
    border-radius: 2px;
    background-color: ${({ color }) => color};
    box-shadow: 0 0 0 0 rgba(76, 144, 240, 0), 0 0 0 0 rgba(76, 144, 240, 0), 0 0 0 0 rgba(76, 144, 240, 0), inset 0 0 0 1px rgba(255, 255, 255, 0.2),
        inset 0 -1px 1px 0 #8f99a8;
`;

export const ColorScaleMarker: FC<ColorScaleMarkerProps> = ({ point, parentWidth }) => {
    const dispatch = useDispatch();
    const selectedPoint = useSelector(selectedPointIdSelector);

    return (
        <DraggableCore
            onDrag={(e, data) => {
                dispatch(movePoint(data.x / parentWidth));
            }}
            onMouseDown={() => {
                dispatch(selectPoint(point.id));
            }}
        >
            <StyledColorScaleMarker
                onClick={(e) => {
                    e.stopPropagation();
                }}
                onDoubleClick={() => {
                    dispatch(removePoint(point.id));
                }}
                offsetInPx={point.offset * parentWidth}
                selected={selectedPoint === point.id}
                color={point.color}
            />
        </DraggableCore>
    );
};
