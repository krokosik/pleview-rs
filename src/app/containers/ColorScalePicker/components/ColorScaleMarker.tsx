import styled from '@emotion/styled';
import { FC } from 'react';
import { DraggableCore } from 'react-draggable';
import { useDispatch, useSelector } from 'react-redux';
import { ColorScalePoint } from '../../../models';
import { movePoint, removePoint, selectedPointIdSelector, selectPoint } from '../../../store';

export interface ColorScaleMarkerProps {
    point: ColorScalePoint;
    parentWidth: number;
}

const StyledColorScaleMarker = styled('div')<{ color: string; selected: boolean; offsetInPx: number }>`
    position: absolute;
    left: 0;
    top: 0;
    height: 32px;
    width: 1%;
    transform: translate(${({ offsetInPx }) => offsetInPx}px, -${({ selected }) => (selected ? 1.2 : 1) * 2}px)
        scaleY(${({ selected }) => (selected ? 1.2 : 1)});
    transform-origin: center;
    border-width: 2px;
    border-style: solid;
    border-radius: 4px;
    background-color: ${({ color }) => color};
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
