
const Write = () => {
    return (
        <div className="mt-10 flex-col space-y-5">
            <h1 className="text-center text-3xl font-bold dark:text-slate-100">
                Write your post here!
            </h1>
            <textarea className="w-full outline-none grow h-96 border-[5px] rounded border-black px-5 py-3 resize-none bg-transparent dark:border-slate-300 dark:text-slate-100"  >
            </textarea>
            <div className="px-5 py-2 border-[3px] border-black rounded text-center cursor-pointer mx-10 dark:text-slate-100 dark:border-slate-300 font-bold">
                Post it on the Chian Now!
            </div>
        </div>
    )
}


export default Write;
