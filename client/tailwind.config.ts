import type { Config } from "tailwindcss"

export default {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        container: { center: true, padding: "1rem" },
        extend: {
            fontFamily: {
                heading: [ "var(--font-lora)", "serif" ],
                body: [ "var(--font-merriWeather)", "serif" ],
            },
        },
    },
    safelist: [ { pattern: /(bg|text|border|fill)-./ } ],
    plugins: [ require("@tailwindcss/forms"), require("@tailwindcss/typography") ],
} satisfies Config
