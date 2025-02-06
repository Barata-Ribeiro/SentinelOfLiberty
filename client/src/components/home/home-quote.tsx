import { FaQuoteRight } from "react-icons/fa"

export default function HomeQuote() {
    return (
        <div className="mx-auto w-full p-4 text-center lg:w-3/4 xl:w-1/2">
            <FaQuoteRight aria-hidden="true" className="text-shadow-400 mb-8 inline-block size-8" />
            <p className="prose-xl leading-relaxed">
                If liberty means anything at all, it means the right to tell people what they do not want to hear.
            </p>
            <span className="mt-8 mb-6 inline-block h-1 w-10 rounded bg-stone-500"></span>
            <h2 className="text-shadow-900 text-sm font-medium tracking-wider">GEORGE ORWELL</h2>
            <p className="text-shadow-500">Writer</p>
        </div>
    )
}
