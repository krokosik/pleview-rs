import { FC, useState } from 'react';
import { Visualizations } from '../../enums';
import { Navbar } from '../Navbar';

export const App: FC = () => {
    const [viz, setViz] = useState(Visualizations.CrossSections);

    return <Navbar viz={viz} setViz={setViz} />;
};
