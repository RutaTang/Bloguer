export const createCommentOnAPostPayload = ({ postId, content }: {
    postId: string, content: string
}) => {
    const moduleAddress = import.meta.env.VITE_APTOS_MODULE_ADDRESS
    const commentUUID = crypto.randomUUID()
    const commentDate = Date.now()
    const payload = {
        type: "entry_function_payload",
        function: `${moduleAddress}::bloguer::comment_on_a_post`,
        type_arguments: [],
        arguments: [
            postId,
            commentUUID,
            content,
            commentDate,
        ],
    }
    return payload
}
