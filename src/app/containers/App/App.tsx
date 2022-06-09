import { FC, useState } from 'react';
import { Classes } from '@blueprintjs/core';
import { Visualizations } from '../../enums';
import { Viz } from '../Viz';
import { Navbar } from '../Navbar';
import { ColorScalePicker } from '../ColorScalePicker';

export const App: FC = () => {
    const [viz, setViz] = useState(Visualizations.CrossSections);

    return (
        <div className={`root-container ${Classes.DARK}`}>
            <Navbar viz={viz} setViz={setViz} />
            <article className="main-container">
                <Viz viz={viz} />
                <ColorScalePicker />
            </article>
            <footer>No messages</footer>
        </div>
    );
};
