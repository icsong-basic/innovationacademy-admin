export type Language = "ko" | "en"

export type PostingInput = {
    attachment: string,
    author: string,
    contents: string,
    language: Language,
    link: string,
    thumbnail: string,
    title: string
}