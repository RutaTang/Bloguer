import ReactDOM from 'react-dom/client'
import App from './App'
import {
    createHashRouter,
    RouterProvider,
} from "react-router-dom";

import './index.css'
import Post from './pages/Post';
import Home from './pages/Home';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { PetraWallet } from 'petra-plugin-wallet-adapter';
import React from 'react';
import Editor from './components/Editor';
import Write from './pages/Write';

const wallets = [new PetraWallet()];

const router = createHashRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <div>404</div>,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "post/:id",
                element: <Post />,
            },
            {
                path: "write",
                element: <Write />,
            }
        ]
    },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
            <RouterProvider router={router} />
        </AptosWalletAdapterProvider>
    </React.StrictMode>
)

