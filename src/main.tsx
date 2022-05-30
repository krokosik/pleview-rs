import { Classes } from '@blueprintjs/core';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './components/App';

import './global.css';
import 'normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';

document.body.classList.add(Classes.DARK);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
