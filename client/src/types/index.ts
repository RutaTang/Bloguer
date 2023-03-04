// since all returned data from chain is string 
// thus, all the items below are string
interface PostType {
    uuid: string,
    title: string,
    description: string,
    content: string,
    publish_date: string,
    update_date: string,
    read_duration: string,
    comments: Array<PostCommentType>
    sponsors: Array<PostSponsorType>
}

interface PostCommentType {
    uuid: string,
    commentor: string,
    comment_date: string,
    content: string,
}

interface PostSponsorType {
    address: string,
    date: string,
    count: string,
}

export type { PostType }
