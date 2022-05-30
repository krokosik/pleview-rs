import { FC, useState } from 'react';
import { Visualizations } from '../../enums';
import { CrossSections } from '../CrossSections';
import { Map } from '../Map';
import { Navbar } from '../Navbar';

export const App: FC = () => {
    const [viz, setViz] = useState(Visualizations.CrossSections);

    return (
        <div className="root-container">
            <Navbar viz={viz} setViz={setViz} />
            <article className="main-container">
                {viz === Visualizations.Map && <Map />}
                {viz === Visualizations.CrossSections && <CrossSections />}
            </article>
            <footer>No messages</footer>
        </div>
    );
};
