import type { Config } from "tailwindcss"

export default {
    content: [ "./src/**/*.{js,ts,jsx,tsx,mdx}" ],
    theme: {
        container: { center: true, padding: "1rem" },
        colors: {},
        extend: {
            fontFamily: {
                heading: [ "var(--font-lora)", "serif" ],
                body: [ "var(--font-merriWeather)", "serif" ],
            },
            colors: {
                white: "white",
                black: "black",
                "stone": {
                    "50": "#fafaf9",
                    "100": "#f5f5f4",
                    "200": "#e7e5e4",
                    "300": "#d6d3d1",
                    "400": "#a8a29e",
                    "500": "#78716c",
                    "600": "#57534e",
                    "700": "#44403c",
                    "800": "#292524",
                    "900": "#1c1917",
                    "950": "#0c0a09",
                }, // NEUTRAL
                "shadow": {
                    "50": "#f6f5f0",
                    "100": "#e8e8d9",
                    "200": "#d3d1b5",
                    "300": "#bab58a",
                    "400": "#a59d6a",
                    "500": "#968c5c",
                    "600": "#80734d",
                    "700": "#685b40",
                    "800": "#594c3a",
                    "900": "#4e4335",
                    "950": "#2c241c",
                }, // TEXT
                "marigold": {
                    "50": "#fdfbe9",
                    "100": "#fbf7c6",
                    "200": "#f7ed91",
                    "300": "#f3dd51",
                    "400": "#edc922",
                    "500": "#ddb115",
                    "600": "#bd890f",
                    "700": "#986310",
                    "800": "#7e5015",
                    "900": "#6c4117",
                    "950": "#3f2109",
                }, // ALL
            },
        },
    },
    safelist: [ { pattern: /(bg|text|border|fill)-./ } ],
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    plugins: [ require("@tailwindcss/forms"), require("@tailwindcss/typography") ],
} satisfies Config
