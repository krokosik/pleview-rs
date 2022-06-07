import { Card } from '@blueprintjs/core';
import { useEffect, FC } from 'react';
import vegaEmbedModule from 'vega-embed';
import { Visualizations } from '../enums';
import { schemas } from '../schemas';

export interface VizProps {
    viz: Visualizations;
}

export const Viz: FC<VizProps> = ({ viz }) => {
    useEffect(() => {
        void vegaEmbedModule('#viz', schemas[viz]);
    }, [viz]);

    return <Card id="viz" elevation={3} />;
};
