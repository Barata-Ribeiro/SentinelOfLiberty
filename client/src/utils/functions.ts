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

function getInitialFormState(): State {
    return {
        ok: false,
        error: null,
        response: null,
    }
}

function formatCommentDate(date: string): string {
    const now = new Date()
    const past = new Date(date)
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)
    
    if (diffInSeconds < 60) return "Posted just now"
    
    let value: number
    let unit: Intl.RelativeTimeFormatUnit
    
    if (diffInSeconds < 3600) {
        value = -Math.floor(diffInSeconds / 60)
        unit = "minute"
    } else if (diffInSeconds < 86400) {
        value = -Math.floor(diffInSeconds / 3600)
        unit = "hour"
    } else if (diffInSeconds < 2592000) {
        value = -Math.floor(diffInSeconds / 86400)
        unit = "day"
    } else if (diffInSeconds < 31536000) {
        value = -Math.floor(diffInSeconds / 2592000)
        unit = "month"
    } else {
        value = -Math.floor(diffInSeconds / 31536000)
        unit = "year"
    }
    
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })
    return `Posted ${ rtf.format(value, unit) }`
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

export {
    getBackgroundImage,
    getInitialFormState,
    formatCommentDate,
    problemDetailsFactory,
    textScrambler,
}
