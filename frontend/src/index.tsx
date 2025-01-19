import React from 'react';

import './index.css';

import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { GeneralProvider } from './contexts/GeneralProvider';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <GeneralProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </GeneralProvider>
    </React.StrictMode>
);