import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AptosWalletName } from '@manahippo/aptos-wallet-adapter'
import { Cross, X, Check } from "lucide-react";
import { useState } from "react";

const Wallet = () => {
    const { connect, disconnect, connected, account } = useWallet();
    const [showWallets, setShowWallets] = useState(false);
    const [showDisconnect, setShowDisconnect] = useState(false);
    return (
        <div>
            {
                connected
                    ?
                    (

                        <button className="px-3 py-1 border-2 border-black bg-black text-white font-semibold rounded text-ellipsis overflow-hidden whitespace-nowrap w-24" onClick={() => { setShowDisconnect(true) }}>{account?.address}</button>
                    )
                    :
                    (
                        <button className="px-3 py-1 border-2 border-black font-semibold rounded dark:text-fuchsia-300 dark:border-fuchsia-300 w-24" onClick={() => { setShowWallets(true) }}>Wallet</button>
                    )
            }
            {/* Disconnect Wallect dialog */}
            {showDisconnect && (
                <div className="fixed left-0 right-0 -top-[10%] bottom-0 my-auto mx-auto w-[30%] h-[10%] bg-white border-black border-2 z-50 rounded shadow shadow-gray-300 p-5 dark:border-none flex justify-between items-center">
                    <div className="text-center text-base font-semibold">Disconnect Wallet?</div>
                    <div className="flex items-center space-x-5">
                        <button onClick={() => { disconnect(); setShowDisconnect(false) }}><Check /></button>
                        <button onClick={() => { setShowDisconnect(false) }}><X /></button>
                    </div>
                </div>
            )}
            {/* Wallet Choice */}
            {showWallets && (
                <div className="fixed left-0 right-0 top-0 bottom-0 my-auto mx-auto w-[30%] h-[45%] bg-white border-black border-2 z-50 rounded shadow shadow-gray-300 p-5 dark:border-none">
                    <div className="flex justify-between items-center">
                        <h3 className="text-center text-xl font-semibold">Choose your wallet</h3>
                        <div className="cursor-pointer" onClick={() => {
                            setShowWallets(false)
                        }}>
                            <X size={20} strokeWidth={2} />
                        </div>
                    </div>
                    {/* Wallet List */}
                    <div className="mt-5">
                        {/* Wallet Item */}
                        <div className="flex justify-center">
                            <button className="px-3 py-2 w-[80%] border-2 border-black font-semibold rounded" onClick={() => { connect(AptosWalletName); setShowWallets(false) }}>Petra</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )

}

export default Wallet;

