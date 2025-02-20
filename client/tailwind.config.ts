import type { Config } from "tailwindcss"
import colors          from "tailwindcss/colors"

export default {
    content: [ "./src/**/*.{js,ts,jsx,tsx,mdx}" ],
    theme: {
        container: { center: true, padding: "1rem" },
        colors: {
            transparent: "transparent",
            current: "currentColor",
            black: colors.black,
            white: colors.white,
            stone: colors.stone,
            red: colors.red,
            yellow: colors.yellow,
        },
        extend: {
            fontFamily: {
                heading: [ "var(--font-lora)", "serif" ],
                body: [ "var(--font-merriWeather)", "serif" ],
            },
            colors: {
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
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    plugins: [ require("@tailwindcss/forms"), require("@tailwindcss/typography") ],
} satisfies Config
