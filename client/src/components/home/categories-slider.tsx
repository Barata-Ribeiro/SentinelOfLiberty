import { Category } from "@/@types/articles"
import getAllAvailableCategories from "@/actions/articles/get-all-available-categories"
import Link from "next/link"
import Marquee from "react-fast-marquee"

export default async function CategoriesSlider() {
    const availableCategoriesState = await getAllAvailableCategories()

    const categoriesList = availableCategoriesState.response?.data as Category[]

    return (
        <div className="w-full border-y border-stone-200 py-2">
            <Marquee autoFill pauseOnHover direction="left" gradient gradientWidth={150}>
                {categoriesList.map(category => {
                    const label = `Category ${category.name}`
                    const url = `/articles/category/${category.name}`

                    return (
                        <Link
                            key={`category-${category.id}-${category.name}`}
                            href={url}
                            aria-label={label}
                            title={label}
                            className="text-shadow-700 hover:text-shadow-900 active:text-shadow-800 mx-2 inline-flex rounded bg-stone-100 px-2 py-1 capitalize select-none hover:bg-stone-300 active:bg-stone-200">
                            {category.name}
                        </Link>
                    )
                })}

                {categoriesList.length === 0 && (
                    <span className="mx-2 inline-flex rounded border border-stone-200 bg-stone-50 px-2 py-0.5 text-stone-400 select-none">
                        No categories available
                    </span>
                )}
            </Marquee>
        </div>
    )
}
