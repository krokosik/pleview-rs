import { FC, useState } from 'react';
import { Visualizations } from '../enums';
import { Viz } from './Viz';
import { Navbar } from './Navbar';

export const App: FC = () => {
    const [viz, setViz] = useState(Visualizations.CrossSections);

    return (
        <div className="root-container">
            <Navbar viz={viz} setViz={setViz} />
            <article className="main-container">
                <Viz viz={viz} />
            </article>
            <footer>No messages</footer>
        </div>
    );
};
