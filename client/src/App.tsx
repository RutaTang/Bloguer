import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { Edit } from "lucide-react"
import { Link, Outlet } from "react-router-dom"
import ThemeSwitcher from "./components/ThemeSwitcher"
import Wallet from "./components/Wallet"

function App() {
    const { account } = useWallet()
    return (
        <div className="min-w-screen min-h-screen bg-white dark:bg-bg px-60 py-12">
            {/* Heading */}
            <div className="flex justify-between items-center">
                <Link to={"/"}> <h1 className='text-2xl font-black dark:text-slate-100'>BLOGUER</h1></Link>
                <div className="flex items-center space-x-8">
                    <ThemeSwitcher />
                    {
                        account?.address === import.meta.env.VITE_APTOS_MODULE_ADDRESS && (
                            <Link to={"/write"}>
                                <Edit size={23} strokeWidth={3} className="dark:text-slate-400" />
                            </Link>
                        )
                    }
                    <Wallet />
                </div>
            </div>
            <Outlet />
        </div>
    )
}

export default App
