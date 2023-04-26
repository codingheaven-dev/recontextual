import 'react-app-polyfill/ie11';
import * as React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';

const e = document.getElementById('root');
if (!e) throw new Error("No root");
createRoot(e).render(<App />);
