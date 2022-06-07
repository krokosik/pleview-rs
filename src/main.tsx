import { Classes } from '@blueprintjs/core';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './components/App';
import { TauriUtils } from './utils';

import './global.css';
import 'normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';

await TauriUtils.initMenuListeners();

listen('tauri://menu', async (e) => {
    let filePath: string;
    switch (e.payload) {
        case 'open':
            filePath = await open({ multiple: false, filters: [asciiFilter] }).then((result) => result?.toString() ?? '');
            void readTextFile(filePath).then(console.log);
            break;
        case 'save':
            filePath = await save({ defaultPath: await documentDir(), filters: [asciiFilter] });
            void writeFile({ path: filePath, contents: 'Hello World!' });
            break;
        case 'save_as':
            filePath = await save({ defaultPath: await documentDir(), filters: [asciiFilter] });
            void writeFile({ path: filePath, contents: 'Hello World!' });
            break;
        case 'about':
            void message('This is a Work In Progress rewrite of PLEview, using Tauri (Rust + WebView)', { title: 'About' });
        default:
    }
});

document.body.classList.add(Classes.DARK);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
