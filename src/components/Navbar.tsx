import { Alignment, Button, Tabs, Navbar as BpNavbar } from '@blueprintjs/core';
import { FC } from 'react';
import { Visualizations } from '../enums';

export interface NavbarProps {
    viz: Visualizations;
    setViz: (viz: Visualizations) => void;
}

export const Navbar: FC<NavbarProps> = ({ viz, setViz }) => (
    <BpNavbar>
        <BpNavbar.Group align={Alignment.CENTER}>
            <BpNavbar.Heading>PLEview</BpNavbar.Heading>

            <BpNavbar.Divider />

            <Button minimal icon="document-open" />
            <Button minimal icon="floppy-disk" />

            <BpNavbar.Divider />

            <Button minimal icon="duplicate" />

            <BpNavbar.Divider />

            <Button minimal icon="search" />
            <Button minimal icon="horizontal-inbetween" />

            <BpNavbar.Divider />

            <Button minimal icon="wrench" />
            <Button minimal icon="style" />

            <BpNavbar.Divider />

            <Tabs id="viz-tabs" onChange={(tabId) => setViz(tabId as Visualizations)} selectedTabId={viz}>
                <Tabs.Tab id={Visualizations.Map} title={Visualizations.Map} />
                <Tabs.Tab id={Visualizations.CrossSections} title={Visualizations.CrossSections} />
            </Tabs>
        </BpNavbar.Group>
    </BpNavbar>
);
