import ReactDOM from 'react-dom/client';
import { App } from './components/App';
import { TauriUtils } from './utils';

import './global.css';
import 'normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/popover2/lib/css/blueprint-popover2.css';

await TauriUtils.initMenuListeners();

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
