import './global.css';
import 'normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/popover2/lib/css/blueprint-popover2.css';

import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { App } from './app/containers/App';
import { TauriUtils } from './app/utils';
import { store } from './store';

await TauriUtils.initMenuListeners();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <App />
    </Provider>,
);
