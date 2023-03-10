import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { AptosClient } from 'aptos'
import { useContext, useState } from "react";
import { useNavigate, } from 'react-router-dom';
import { createCreatePostPayload } from "../apis/post";
import MarkdownView from '../components/MarkdownView';
import { DataContext } from '../contexts/DataContex';

const Write = () => {
    const { signAndSubmitTransaction, account } = useWallet()
    const [title, setTitle] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [content, setContent] = useState<string>('')
    const [readDuration, setReadDuration] = useState<number>(1)
    const [isPreview, setIsPreview] = useState<boolean>(false)
    const { refreshPosts } = useContext(DataContext)
    const navigate = useNavigate()


    const submitPost = async () => {
        if (!account) return
        const client = new AptosClient(import.meta.env.VITE_APTOS_NODE_URL)
        const payload = createCreatePostPayload({
            title, description, content, read_duration: readDuration
        })
        try {
            const response = await signAndSubmitTransaction(payload);
            await client.waitForTransaction(response.hash);
            refreshPosts()
            navigate('/')
        } catch (e) {
            console.error(e)
        }
    }

    const togglePreview = () => {
        setIsPreview(!isPreview)
    }
    return (
        <div className="mt-10 flex-col space-y-5">
            <h1 className="text-center text-3xl font-bold dark:text-slate-100">
                Write your post here!
            </h1>
            <div className="flex w-full space-x-5">
                <div className="grow">
                    <p className="dark:text-slate-100 font-bold">Title (plain text)</p>
                    <input onChange={(e) => {
                        setTitle(e.target.value)
                    }} className="w-full outline-none grow h-12 border-[2px] dark:border-[5px] rounded border-black px-5 py-3 resize-none bg-transparent dark:border-slate-300 dark:text-slate-100" placeholder="Your article title here..." />
                </div>
                <div className="grow">
                    <p className="dark:text-slate-100 font-bold">Read Duration (min)</p>
                    <input onChange={(e) => {
                        setReadDuration(parseInt(e.target.value))
                    }} className="w-full outline-none grow h-12 border-[2px] dark:border-[5px] rounded border-black px-5 py-3 resize-none bg-transparent dark:border-slate-300 dark:text-slate-100" type="number" value={readDuration} />
                </div>
            </div>
            <p className="dark:text-slate-100 font-bold">Description (plain text)</p>
            <input onChange={(e) => {
                setDescription(e.target.value)
            }} className="w-full outline-none grow h-12 border-[2px] dark:border-[5px] rounded border-black px-5 py-3 resize-none bg-transparent dark:border-slate-300 dark:text-slate-100" placeholder="Your article description here..." />
            <div className='flex justify-between items-center'>
                <p className="dark:text-slate-100 font-bold">Content (markdown)</p>
                <p className={`select-none cursor-pointer font-bold px-3 py-2 rounded transition border-2 ${isPreview ? "bg-black text-white border-transparent dark:bg-slate-200 dark:text-black" : "border-black dark:text-slate-200 dark:border-slate-200"}`} onClick={() => {
                    togglePreview()
                }}>Preview</p>
            </div>
            <textarea hidden={isPreview} onChange={(e) => {
                setContent(e.target.value)
            }} suppressHydrationWarning className="w-full outline-none grow h-96 border-[2px] dark:border-[5px] rounded border-black px-5 py-3 resize-none bg-transparent dark:border-slate-300 dark:text-slate-100 overflow-scroll">
            </textarea>
            <div hidden={!isPreview} className="w-full outline-none grow h-full border-[2px] dark:border-[5px] rounded border-black px-5 py-3 resize-none bg-transparent dark:border-slate-300 dark:text-slate-100 overflow-scroll">
                <div className="max-w-none mt-8 prose dark:prose-invert prose-pre:p-0">
                    <MarkdownView content={content} />
                </div>
            </div>
            <div onClick={() => {
                submitPost()
            }} className="px-5 py-2 border-[3px] border-black rounded text-center cursor-pointer mx-10 dark:text-slate-100 dark:border-slate-300 font-bold">
                Post it on the Chian Now!
            </div>
        </div >
    )
}


export default Write;
