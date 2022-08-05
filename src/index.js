import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '../node_modules/react-grid-layout/css/styles.css';
import '../node_modules/react-resizable/css/styles.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'))


serviceWorker.unregister();
// serviceWorker.register();