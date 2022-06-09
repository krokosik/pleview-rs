import { Alignment, Navbar as BpNavbar, Button, ButtonProps, Tabs } from '@blueprintjs/core';
import { FC } from 'react';
import { Tooltip2 } from '@blueprintjs/popover2';
import { TauriUtils } from '../../utils';
import { Visualizations } from '../../enums';

export interface NavbarProps {
    viz: Visualizations;
    setViz: (viz: Visualizations) => void;
}

const NavbarButton: FC<ButtonProps & { tooltip: string }> = ({ tooltip, ...props }) => (
    <Tooltip2 content={tooltip} placement="bottom">
        <Button minimal {...props} />
    </Tooltip2>
);

export const Navbar: FC<NavbarProps> = ({ viz, setViz }) => (
    <BpNavbar>
        <BpNavbar.Group align={Alignment.CENTER}>
            <BpNavbar.Heading>PLEview</BpNavbar.Heading>

            <BpNavbar.Divider />

            <NavbarButton icon="document-open" onClick={() => TauriUtils.openFile()} tooltip="Open" />
            <NavbarButton icon="floppy-disk" onClick={() => TauriUtils.saveFile('Hello world!')} tooltip="Save" />

            <BpNavbar.Divider />

            <NavbarButton icon="duplicate" tooltip="Copy" />

            <BpNavbar.Divider />

            <NavbarButton icon="search" tooltip="Zoom mode" />
            <NavbarButton icon="horizontal-inbetween" tooltip="Marker mode" />

            <BpNavbar.Divider />

            <NavbarButton icon="wrench" tooltip="Cross-section" />
            <NavbarButton icon="style" tooltip="Color scale" />

            <BpNavbar.Divider />

            <Tabs id="viz-tabs" onChange={(tabId) => setViz(tabId as Visualizations)} selectedTabId={viz}>
                <Tabs.Tab id={Visualizations.Map} title={Visualizations.Map} />
                <Tabs.Tab id={Visualizations.CrossSections} title={Visualizations.CrossSections} />
            </Tabs>
        </BpNavbar.Group>
    </BpNavbar>
);
