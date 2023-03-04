import { Twitter, Github, Linkedin, Mail, Youtube } from 'lucide-react'
import { useContext, } from 'react';
import { useNavigate } from "react-router-dom";
import { DataContext } from '../contexts/DataContex';
import { PostType } from '../types';
import { timeStampToLocalDateString } from '../utils';


const Home = () => {
    const navigate = useNavigate();
    const { posts } = useContext(DataContext);

    const author = {
        name: import.meta.env.VITE_AUTHOR_NAME || "Unknown",
        introduction: import.meta.env.VITE_AUTHOR_INTRODUCTION || "The author has no introduction yet",
        avatar: import.meta.env.VITE_AUTHOR_AVATAR,
        email: import.meta.env.VITE_AUTHOR_EMAIL,
        github: import.meta.env.VITE_AUTHOR_GITHUB,
        twitter: import.meta.env.VITE_AUTHOR_TWITTER,
        linkedin: import.meta.env.VITE_AUTHOR_LINKEDIN,
        youtube: import.meta.env.VITE_AUTHOR_YOUTUBE,
    }
    return (
        <div>
            {/* Author information */}
            <div className="flex mt-10">
                <div className="shrink-0">
                    <img src={author.avatar} alt="" className="rounded-full w-20 h-20" />
                </div>
                <div className="ml-6 space-y-3">
                    <h1 className="text-xl font-bold dark:text-slate-100">{author.name}</h1>
                    <p className="text-sm dark:text-slate-100">{author.introduction}</p>
                    <div className="text-base dark:text-slate-100 flex">
                        <p className="shrink-0">
                            Contact me by
                        </p>
                        <div className="flex flex-wrap space-x-3 ml-3 items-center">
                            {/* Email */}
                            {
                                author.email && (
                                    <div>
                                        <a href={author.email} target="_blank"><Mail /></a>
                                    </div>
                                )
                            }
                            {/* GITHUB */}
                            {
                                author.github && (
                                    <div>
                                        <a href={author.github} target="_blank"><Github /></a>
                                    </div>
                                )
                            }
                            {/* TWITTER */}
                            {
                                author.twitter && (
                                    <div>
                                        <a href={author.twitter} target="_blank"><Twitter /></a>
                                    </div>
                                )
                            }
                            {/* LINKEDIN */}
                            {
                                author.linkedin && (
                                    <div>
                                        <a href={author.linkedin} target="_blank"><Linkedin /></a>
                                    </div>
                                )
                            }
                            {/* YOUTUBE */}
                            {
                                author.youtube && (
                                    <div>
                                        <a href={author.youtube} target="_blank"><Youtube /></a>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-col justify-center px-20 mt-16 space-y-16">
                {/* Article Item */}
                {
                    posts
                        ?
                        posts.length === 0 ?
                            <p className='text-center font-bold dark:text-slate-300'>🚴‍♂️ The first article is on the way...</p>
                            :
                            posts.sort((a, b) => {
                                return parseInt(b.publish_date) - parseInt(a.publish_date);
                            }).map((post: PostType) => {
                                return (
                                    <div key={post.uuid}>
                                        <h1 onClick={() => {
                                            navigate(`/post/${post.uuid}`)
                                        }} className="cursor-pointer text-2xl font-semibold dark:text-fuchsia-300 text-fuchsia-500  whitespace-nowrap overflow-hidden" style={{ textOverflow: "ellipsis" }}>{
                                                !post.title ? "No title" : post.title
                                            }</h1>
                                        <p className="text-base dark:text-slate-100 my-3 opacity-70 font-semibold">By Ruta Tang</p>
                                        <p className="text-sm dark:text-slate-100 opacity-70">
                                            Pub At {timeStampToLocalDateString(parseInt(post.publish_date))} • Upd At {timeStampToLocalDateString(parseInt(post.update_date))} • {post.read_duration} min
                                        </p>
                                        <p className="text-base dark:text-slate-100 mt-3">{
                                            !post.description ? "No description" : post.description
                                        }</p>
                                    </div>
                                )
                            })
                        :
                        <p className='text-center text-2xl animate-pulse dark:text-slate-300 opacity-70'>
                            LOADING...
                        </p>
                }
            </div>
        </div>
    )
}

export default Home;
