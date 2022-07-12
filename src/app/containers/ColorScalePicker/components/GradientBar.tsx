import { ResizeSensor2 } from '@blueprintjs/popover2';
import { FC, useState } from 'react';

import { useSelector } from 'react-redux';
import { colorScaleSelector } from '../color-scale.slice';
import { ColorScaleMarker } from './ColorScaleMarker';
import { GradientPreview } from './GradientPreview';

export const GradientBar: FC = () => {
    const colorScale = useSelector(colorScaleSelector);

    const [width, setWidth] = useState(1);

    return (
        <ResizeSensor2 onResize={(entries) => setWidth(entries[0]!.contentRect.width)}>
            <GradientPreview>
                {colorScale.map((point) => (
                    <ColorScaleMarker key={point.id} point={point} parentWidth={width ?? 1} />
                ))}
            </GradientPreview>
        </ResizeSensor2>
    );
};
