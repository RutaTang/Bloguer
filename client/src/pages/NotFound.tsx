import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="z-0 absolute left-0 top-0 bottom-0 right-0 m-auto flex justify-center items-center">
            <div className="text-center space-y-5">
                <p className="dark:text-slate-100 font-bold text-5xl">404</p>
                <p className="dark:text-slate-300">You may lost, back <Link className="text-fuchsia-500 dark:text-fuchsia-300 font-semibold" to={"/"}>home</Link>.
                </p>
            </div>
        </div>
    )
}

export default NotFound;
