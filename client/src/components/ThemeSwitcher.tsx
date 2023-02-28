import { useEffect, useState } from "react";
import { Sun, Moon } from 'lucide-react'

// Change between dark and light theme
const ThemeSwitcher = () => {
    const [isDark, setIsDark] = useState(false);

    // Check if the user has already selected the dark theme 
    useEffect(() => {
        const isDarkInStorage = localStorage.getItem("isDark") === "true";
        setIsDark(isDarkInStorage);
        if (isDarkInStorage) {
            document.documentElement.classList.add("dark");
        }
    }, []);

    const toggleDark = () => {
        if (isDark) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("isDark", "false");
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("isDark", "true");
        }
        setIsDark(!isDark);
    };

    return (
        <div className="cursor-pointer select-none" onClick={() => {
            toggleDark();
        }}>
            {
                isDark ? <Moon strokeWidth={3} size={25} className="dark:text-slate-400" /> :
                    <Sun strokeWidth={3} size={25} />
            }
        </div>
    );
}

export default ThemeSwitcher;
