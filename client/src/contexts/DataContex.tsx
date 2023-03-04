import { createContext, useEffect, useState } from "react";
import { fetchPostsLength, fetchPostsListByStartAndEndIndex } from "../apis/post";
import { PostType } from "../types";

const defaultContext: {
    posts: PostType[] | null,
    refreshPosts: () => void
} = {
    posts: [],
    refreshPosts: () => { }
}
export const DataContext = createContext(defaultContext);

export const DataContextProvider = (props: any) => {
    const [posts, setPosts] = useState<PostType[] | null>(null);
    const [refreshCount, setRefreshCount] = useState<number>(0);

    const loadPosts = async () => {
        const data = await fetchPostsLength();
        let postsLength = Number(String(data[0]))
        const posts = (await fetchPostsListByStartAndEndIndex(0, postsLength))[0] as PostType[];
        return posts;
    }

    const refreshPosts = () => {
        setRefreshCount(refreshCount + 1);
    }

    useEffect(() => {
        loadPosts().then((posts) => {
            setPosts(posts);
        }).catch(() => {
            setPosts([]);
        })
    }, [refreshCount])

    return (
        <DataContext.Provider value={{ posts, refreshPosts }}>
            {props.children}
        </DataContext.Provider>
    )
};
