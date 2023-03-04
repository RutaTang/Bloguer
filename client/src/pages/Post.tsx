import { useParams } from "react-router-dom"
import { Coffee, HardHat, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as jdenticon from "jdenticon";

import { PostType } from "../types";
import { timeStampToLocalDateString } from "../utils";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AptosAccount, AptosClient, CoinClient } from "aptos";
import { commentOnAPostPayload } from "../apis/comment";
import { fetchPostByUUID } from "../apis/post";


import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import MarkdownView from "../components/MarkdownView";


const COFFEE_PRICE = [
    1,
    0.5,
    0.1
]

const Post = () => {
    const { uuid } = useParams()
    const { account, signAndSubmitTransaction } = useWallet()
    const [post, setPost] = useState<PostType>()
    const [comment, setComment] = useState("")
    const [refreshCount, setRefreshCount] = useState(0)
    const [coffeePriceIndex, setCoffeePriceIndex] = useState(2)

    useEffect(() => {
        if (!uuid) return
        fetchPostByUUID(uuid).then((post) => {
            setPost(post[0] as PostType)
        })
    }, [uuid, refreshCount])

    //@param apt: amount of apt to transfer, e.g. 1 is 1 APT
    const transferToAuthor = async (apt: number) => {
        if (!account) return
        const moduleAddress = import.meta.env.VITE_APTOS_MODULE_ADDRESS
        if (!moduleAddress) {
            console.error("Author account does not exist")
            return
        }
        const client = new AptosClient(import.meta.env.VITE_APTOS_NODE_URL)
        const payload = {
            type: "entry_function_payload",
            function: `${moduleAddress}::bloguer::buy_me_a_coffee`,
            type_arguments: [],
            arguments: [
                uuid,
                (apt * 10e7).toString(),
                Date.now().toString()
            ]
        }
        try {
            const response = await signAndSubmitTransaction(payload)
            await client.waitForTransaction(response.hash)
            setRefreshCount(refreshCount + 1)
        } catch (e) {
            console.error(e)
        }
    }

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
                <hr className="mt-10" />
                {/* Buy me a coffee */}
                <div className="mt-10">
                    <h1 className="text-3xl font-bold italic dark:text-slate-300">Buy Me a Coffee</h1>
                    {/* Sponsors Wall */}
                    <div className="flex flex-wrap items-center justify-start space-x-5 mt-5">
                        {
                            post.sponsors && post.sponsors.length > 0 ?
                                post.sponsors.sort((a,b)=>{
                                    return parseInt(b.count) - parseInt(a.count)
                                }).map((sponsor) => {
                                    return (
                                        <div data-tooltip-id={`tooltip-show-address-${sponsor.address}`} data-tooltip-content={sponsor.address}  >
                                            <Tooltip id={`tooltip-show-address-${sponsor.address}`} />
                                            <div dangerouslySetInnerHTML={{ __html: jdenticon.toSvg(sponsor.address, 30) }}></div>
                                        </div>
                                    )
                                })
                                :
                                <p className="font-bold opacity-80 italic dark:text-slate-300">Be the first sponsor!</p>
                        }
                    </div>
                    {/* Choose Price and Buy me a coffee button */}
                    <div className="flex items-center justify-between mt-2">
                        {/* Choose Price */}
                        <div className="flex items-center space-x-5">
                            {
                                COFFEE_PRICE.map((price, index) => {
                                    return (
                                        <div key={price} className={`cursor-pointer select-none rounded-lg px-3 py-2 text-base font-bold text-white transition ${coffeePriceIndex === index ? "bg-black scale-110 dark:bg-white dark:text-black" : "bg-gray-500"}`} onClick={() => {
                                            setCoffeePriceIndex(index)
                                        }}>
                                            {price} APT
                                        </div>
                                    )

                                })
                            }
                        </div>
                        {/* Buy me a coffee button */}
                        <div className="rounded px-10 py-3 cursor-pointer" onClick={() => { transferToAuthor(COFFEE_PRICE[coffeePriceIndex]) }}>
                            <img src={"bmc-button.svg"} className="w-40" />
                        </div>
                    </div>
                </div>
                <hr className="mt-5" />
                {/* Comment */}
                <div className="w-full mt-10">
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
            </div >
        )
        :
        (
            <div className="flex justify-center mt-[20%]">
                <p className="animate-pulse text-2xl font-bold dark:text-slate-300 opacity-70">LOADING...</p>
            </div>
        )

}

export default Post


