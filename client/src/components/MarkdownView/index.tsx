import { micromark } from "micromark"
import { useEffect } from "react"

import { math, mathHtml } from 'micromark-extension-math'
import 'katex/dist/katex.min.css'

import hljs from "highlight.js"
import "highlight.js/styles/base16/nord.css";

const MarkdownView = ({ content }: { content: string }) => {
    const html = micromark(content, {
        extensions: [math()],
        htmlExtensions: [mathHtml()]
    })
    useEffect(() => {
        hljs.highlightAll()
    }, [content])
    return (
        <div dangerouslySetInnerHTML={{ __html: html }}></div>
    )
}

export default MarkdownView
