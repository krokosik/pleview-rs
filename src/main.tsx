import './global.css';
import 'normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/popover2/lib/css/blueprint-popover2.css';

import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { attachConsole, error, info } from 'tauri-plugin-log-api';
import { App } from './app/containers/App';
import { store } from './store';

if (import.meta.env.DEV) {
    void attachConsole().then(() => info('Debug console attached'));
}

window.onerror = (event, _source, _lineno, _colno, err) => {
    void error(typeof event === 'string' ? event : err?.message ?? 'Unknown error');
};
window.onunhandledrejection = (event) => {
    void error(String(event.reason));
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <App />
    </Provider>,
);
