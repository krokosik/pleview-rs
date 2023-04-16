import './global.css';
import 'normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/popover2/lib/css/blueprint-popover2.css';

import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { attachConsole, info } from 'tauri-plugin-log-api';
import { App } from './app/containers/App';
import { initMenuListeners } from './app/utils';
import { store } from './store';

void initMenuListeners();

if (import.meta.env.DEV) {
    void attachConsole().then(() => info('Debug console attached'));
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <App />
    </Provider>,
);
