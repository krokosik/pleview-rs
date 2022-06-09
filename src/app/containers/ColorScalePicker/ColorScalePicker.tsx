import { Card } from '@blueprintjs/core';
import { FC, useState } from 'react';
import { prop, sortBy } from 'remeda';
import { ColorScalePoint } from '../../models';

export const ColorScalePicker: FC = () => {
    const [palette, setPalette] = useState<ColorScalePoint[]>([
        { offset: 0, color: '#00f' },
        { offset: 0.5, color: '#0f0' },
        { offset: 1, color: '#f00' },
    ]);

    return (
        <Card elevation={3} className="tool-container">
            <div style={{ width: '100%', height: '28px', borderRadius: '4px', background: getCssGradient(palette) }} />
        </Card>
    );
};

const getCssGradient = (palette: ColorScalePoint[]) =>
    `linear-gradient(to right, ${sortBy(palette, prop('offset'))
        .map(({ offset, color }) => `${color} ${offset * 100}%`)
        .join(', ')})`;
