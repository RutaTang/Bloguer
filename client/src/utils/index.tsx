export const timeStampToLocalDateString = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })
}
