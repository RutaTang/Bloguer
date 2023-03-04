import { micromark } from "micromark"
import { useEffect } from "react"

import hljs from "highlight.js"
import "highlight.js/styles/base16/nord.css";

const MarkdownView = ({ content }: { content: string }) => {
    const html = micromark(content)
    useEffect(() => {
        hljs.highlightAll()
    }, [content])
    return (
        <div dangerouslySetInnerHTML={{ __html: html }}></div>
    )
}

export default MarkdownView
