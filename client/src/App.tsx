import { Outlet } from "react-router-dom"
import Heading from "./components/Heading"

function App() {
    return (
        <div className="min-w-screen min-h-screen bg-white dark:bg-bg px-60 py-12">
            <Heading />
            <Outlet />
        </div>
    )
}

export default App
