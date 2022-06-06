import { Card } from '@blueprintjs/core';
import { Visualizations } from '../enums';
import { useEffect } from 'react';
import { FC } from 'react';
import vegaEmbedModule from 'vega-embed';
import { schemas } from '../schemas';

export interface VizProps {
    viz: Visualizations;
}

export const Viz: FC<VizProps> = ({ viz }) => {
    useEffect(() => {
        void vegaEmbedModule('#viz', schemas[viz]);
    }, [viz]);

    return <Card id="viz" elevation={3}></Card>;
};
