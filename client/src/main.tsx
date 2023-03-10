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
import Write from './pages/Write';
import { DataContextProvider } from './contexts/DataContex';
import NotFound from './pages/NotFound';

const wallets = [new PetraWallet()];

const router = createHashRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <NotFound />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "post/:uuid",
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
            <DataContextProvider>
                <RouterProvider router={router} />
            </DataContextProvider>
        </AptosWalletAdapterProvider>
    </React.StrictMode>
)

