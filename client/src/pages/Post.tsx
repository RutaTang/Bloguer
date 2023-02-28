import { useParams } from "react-router-dom"
import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { micromark } from "micromark";

import PrismJS from 'prismjs'
import 'prism-themes/themes/prism-nord.css'


const MarkdownView = () => {
    const [content, setContent] = useState("")
    useEffect(() => {
        setContent(micromark(`## Hello, *world*!
\`\`\`javascript
console.log('Hello, Neptune!')
\`\`\`
`))
    }, [])
    useEffect(() => {
        PrismJS.highlightAll()
    }, [content])
    return (
        <div dangerouslySetInnerHTML={{ __html: content }}></div>
    )
}

const Post = () => {
    const { id } = useParams()
    return (
        <div>
            {/* Post Info */}
            <div className="mt-10">
                <h1 className="text-3xl font-black dark:text-slate-100">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </h1>
                <p className="text-xl font-bold opacity-70 mt-2 dark:text-slate-300">By Ruta Tang</p>
                <p className="text-base mt-2 dark:text-slate-300">Pub At June 20, 2020 • Upd At July 21, 2020 • 12 min</p>
            </div>
            <hr className="mt-5" />
            {/* Post Detail */}
            <div className="w-full mt-8 prose dark:prose-invert">
                <MarkdownView />
            </div>
            {/* Comment */}
            <div className="w-full mt-20">
                <hr className="mb-5" />
                <h1 className="text-3xl font-bold italic dark:text-slate-300">Comments</h1>
                {/* Comment List */}
                <div className="mt-5 space-y-5">
                    {/* Comment Item */}
                    <div>
                        <div className="flex justify-between items-center font-semibold dark:text-slate-300">
                            <p>From 0x123...567</p>
                            <p>July 17, 2020</p>
                        </div>
                        <p className="mt-2 dark:text-slate-300">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    </div>
                </div>
                {/* Leave Comment */}
                <div className="mt-10 space-y-3">
                    <p className="text-base font-semibold dark:text-slate-300">Leave Your Comment Here</p>
                    <textarea className="w-full grow outline-none border-2 rounded border-black px-5 py-2 dark:bg-transparent dark:border-slate-300 dark:text-slate-100 h-52" />
                    <div className="w-full text-center flex justify-center items-center space-x-5 border-2 dark:border-slate-300 py-3 px-2 rounded select-none cursor-pointer border-black">
                        <p className="dark:text-slate-300">Leave your comment on the Chain!</p>
                        <Send strokeWidth={2} size={20} className="dark:text-slate-300" />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Post


