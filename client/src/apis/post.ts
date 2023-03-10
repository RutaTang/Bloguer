import { AptosClient } from 'aptos'

const fetchPosts = async () => {
    const client = new AptosClient(import.meta.env.VITE_APTOS_NODE_URL)
    const moduleAddress = import.meta.env.VITE_APTOS_MODULE_ADDRESS
    try {
        const PostStore = await client.getAccountResource(moduleAddress, `${moduleAddress}::bloguer::PostStore`)
        return PostStore
    }
    catch (e) {
        console.error(e)
    }
    return []
}

const fetchPostsListByStartAndEndIndex = async (startIndex: number, endIndex: number) => {
    const client = new AptosClient(import.meta.env.VITE_APTOS_NODE_URL)
    const moduleAddress = import.meta.env.VITE_APTOS_MODULE_ADDRESS
    try {
        const payload = {
            function: `${moduleAddress}::bloguer::get_posts_list_by_start_and_end_index`,
            type_arguments: [],
            arguments: [moduleAddress, String(startIndex), String(endIndex)],
        }
        const d = await client.view(payload)
        return d
    }
    catch (e) {
        throw e
    }
}

const fetchPostsLength = async () => {
    const client = new AptosClient(import.meta.env.VITE_APTOS_NODE_URL)
    const moduleAddress = import.meta.env.VITE_APTOS_MODULE_ADDRESS
    try {
        const payload = {
            function: `${moduleAddress}::bloguer::get_posts_length`,
            type_arguments: [],
            arguments: [moduleAddress],
        }
        const d = await client.view(payload)
        return d
    }
    catch (e) {
        throw e
    }
}

const fetchPostByUUID = async (uuid: string) => {
    const client = new AptosClient(import.meta.env.VITE_APTOS_NODE_URL)
    const moduleAddress = import.meta.env.VITE_APTOS_MODULE_ADDRESS
    try {
        const payload = {
            function: `${moduleAddress}::bloguer::get_post_by_uuid`,
            type_arguments: [],
            arguments: [moduleAddress, uuid],
        }
        const d = await client.view(payload)
        return d
    }
    catch (e) {
        throw e
    }
}

const createCreatePostPayload = ({
    title, description, content, read_duration
}: {

    title: string, description: string, content: string, read_duration: number
}) => {
    const moduleAddress = import.meta.env.VITE_APTOS_MODULE_ADDRESS
    const uuid = crypto.randomUUID()
    const publish_date = Date.now()
    const payload = {
        type: "entry_function_payload",
        function: `${moduleAddress}::bloguer::create_post`,
        type_arguments: [],
        arguments: [
            uuid,
            title,
            description,
            content,
            publish_date,
            read_duration,
        ],
    }
    return payload
}

const createUpdatePostPayload = ({
    uuid, title, description, content, read_duration
}: {
    uuid: string, title: string, description: string, content: string, read_duration: number
}) => {
    const moduleAddress = import.meta.env.VITE_APTOS_MODULE_ADDRESS
    const update_date = Date.now()
    const payload = {
        type: "entry_function_payload",
        function: `${moduleAddress}::bloguer::update_post`,
        type_arguments: [],
        arguments: [
            uuid,
            title,
            description,
            content,
            update_date,
            read_duration,
        ],
    }
    return payload
}

const createDeletePostPayload = ({ uuid }: {
    uuid: string
}) => {
    const moduleAddress = import.meta.env.VITE_APTOS_MODULE_ADDRESS
    const payload = {
        type: "entry_function_payload",
        function: `${moduleAddress}::bloguer::delete_post`,
        type_arguments: [],
        arguments: [
            uuid,
        ],
    }
    return payload
}




export { fetchPosts, createCreatePostPayload, createUpdatePostPayload, createDeletePostPayload, fetchPostsListByStartAndEndIndex, fetchPostsLength, fetchPostByUUID }
