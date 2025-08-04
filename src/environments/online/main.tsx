import './init'
import './index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import NiceModal from '@ebay/nice-modal-react'

import App from './App'

export function Main() {
    const rootElement = document.getElementById('root');
    if (rootElement) {
        ReactDOM.createRoot(rootElement).render(
            <React.StrictMode>
                <NiceModal.Provider>
                    <App />
                </NiceModal.Provider>
            </React.StrictMode>
        )
    }
}