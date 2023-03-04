import { useParams } from "react-router-dom"
import {  Send } from "lucide-react";
import {  useEffect, useState } from "react";
import { micromark } from "micromark";

import { PostType } from "../types";
import { timeStampToLocalDateString } from "../utils";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AptosClient } from "aptos";
import { commentOnAPostPayload } from "../apis/comment";
import { fetchPostByUUID } from "../apis/post";

import hljs from 'highlight.js'
import "highlight.js/styles/base16/nord.css";

const MarkdownView = ({ content }: { content: string }) => {
    useEffect(() => {
        hljs.highlightAll()
    }, [content])
    return (
        <div dangerouslySetInnerHTML={{ __html: micromark(content) }}></div>
    )
}

const Post = () => {
    const { uuid } = useParams()
    const { account, signAndSubmitTransaction } = useWallet()
    const [post, setPost] = useState<PostType>()
    const [comment, setComment] = useState("")
    const [refreshCount, setRefreshCount] = useState(0)

    useEffect(() => {
        if (!uuid) return
        fetchPostByUUID(uuid).then((post) => {
            setPost(post[0] as PostType)
        })
    }, [uuid, refreshCount])

    const submitComment = async () => {
        if (!account) return
        if (!post) return
        const client = new AptosClient(import.meta.env.VITE_APTOS_NODE_URL)
        const payload = commentOnAPostPayload({
            postId: post.uuid,
            content: comment,
        })
        try {
            const response = await signAndSubmitTransaction(payload)
            await client.waitForTransaction(response.hash)
            setComment("")
            setRefreshCount(refreshCount + 1)
        } catch (e) {
            console.error(e)
        }
    }
    return post
        ?
        (
            <div>
                {/* Post Info */}
                <div className="mt-10">
                    <h1 className="text-3xl font-black dark:text-slate-100">
                        {
                            !post.title ? "No title" : post.title
                        }
                    </h1>
                    <p className="text-xl font-bold opacity-70 mt-2 dark:text-slate-300">By Ruta Tang</p>
                    <p className="text-base mt-2 dark:text-slate-300">
                        Pub At {timeStampToLocalDateString(parseInt(post.publish_date))} • Upd At {timeStampToLocalDateString(parseInt(post.update_date))} • {post.read_duration} min
                    </p>
                </div>
                <hr className="mt-5" />
                {/* Post Detail */}
                <div className="max-w-none mt-8 prose dark:prose-invert prose-pre:p-0">
                    <MarkdownView content={post.content} />
                </div>
                {/* Comment */}
                <div className="w-full mt-20">
                    <hr className="mb-5" />
                    <h1 className="text-3xl font-bold italic dark:text-slate-300">Comments</h1>
                    {/* Comment List */}
                    <div className="mt-5 space-y-5">
                        {/* Comment Item */}
                        {
                            post.comments.sort((a, b) => {
                                return parseInt(b.comment_date) - parseInt(a.comment_date)
                            }).map(comment => {
                                return (
                                    <div key={comment.uuid}>
                                        <div className="flex justify-between items-center font-semibold dark:text-slate-300">
                                            <p>From {comment.commentor.substring(0, 5) + "..." + comment.commentor.substring(comment.commentor.length - 3, comment.commentor.length)}</p>
                                            <p>{timeStampToLocalDateString(parseInt(comment.comment_date))}</p>
                                        </div>
                                        <p className="mt-2 dark:text-slate-300">{comment.content}</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                    {/* Leave Comment */}
                    <div className="mt-10 space-y-3">
                        <p className="text-base font-semibold dark:text-slate-300">Leave Your Comment Here</p>
                        <textarea className="w-full grow outline-none border-2 rounded border-black px-5 py-2 dark:bg-transparent dark:border-slate-300 dark:text-slate-100 h-52" value={comment} onChange={(e) => {
                            setComment(e.target.value)
                        }} />
                        <div onClick={() => { submitComment() }} className="w-full text-center flex justify-center items-center space-x-5 border-2 dark:border-slate-300 py-3 px-2 rounded select-none cursor-pointer border-black">
                            <p className="dark:text-slate-300">Leave your comment on the Chain!</p>
                            <Send strokeWidth={2} size={20} className="dark:text-slate-300" />
                        </div>
                    </div>
                </div>
            </div>
        )
        :
        (
            <div className="flex justify-center mt-[20%]">
                <p className="animate-pulse text-2xl font-bold dark:text-slate-300 opacity-70">LOADING...</p>
            </div>
        )

}

export default Post


