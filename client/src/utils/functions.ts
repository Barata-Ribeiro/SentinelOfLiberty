import { ProblemDetails, State } from "@/@types/application"

function getBackgroundImage(srcSet = "") {
    const imageSet = srcSet
        .split(", ")
        .map(str => {
            const [ url, dpi ] = str.split(" ")
            return `url("${ url }") ${ dpi }`
        })
        .join(", ")
    return `image-set(${ imageSet })`
}

function problemDetailsFactory({ type, title, status, detail, instance }: ProblemDetails): ProblemDetails {
    return {
        type,
        title,
        status,
        detail,
        instance,
    }
}

function getInitialFormState(): State {
    return {
        ok: false,
        error: null,
        response: null,
    }
}

function extractTextFromHTML(html: string) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")
    return doc.body.textContent?.trim() ?? ""
}

export { getBackgroundImage, problemDetailsFactory, getInitialFormState, extractTextFromHTML }