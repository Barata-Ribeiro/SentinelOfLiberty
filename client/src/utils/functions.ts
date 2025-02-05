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

function textScrambler(text: string): string {
    const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const scrambled = text.split("").map(char => {
        if (alphabet.includes(char)) {
            const randomIndex = Math.floor(Math.random() * alphabet.length)
            return alphabet[randomIndex]
        }
        return char
    })
    
    return scrambled.join("")
}

export { getBackgroundImage, problemDetailsFactory, getInitialFormState, textScrambler }
