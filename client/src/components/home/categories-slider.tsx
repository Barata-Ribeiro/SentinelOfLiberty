"use client"

import { State }    from "@/@types/application"
import { Category } from "@/@types/articles"
import Link         from "next/link"
import { use }      from "react"
import Marquee      from "react-fast-marquee"

interface CategoriesSliderProps {
    categoriesPromise: Promise<State>
}

export default function CategoriesSlider({ categoriesPromise }: CategoriesSliderProps) {
    const categories = use(categoriesPromise)
    if (!categories) return null
    
    const categoriesList = categories.response?.data as Category[]
    
    return (
        <div className="w-full border-y border-stone-200 py-2">
            <Marquee autoFill pauseOnHover direction="left" gradient gradientWidth={ 150 }>
                { categoriesList.map(category => (
                    <Link
                        key={ `category-${ category.id }-${ category.name }` }
                        href={ `/articles/category/${ category.name }` }
                        aria-label={ `Category ${ category.name }` }
                        title={ `Category ${ category.name }` }
                        className="text-shadow-700 hover:text-shadow-900 mx-2 active:text-shadow-800 inline-flex rounded bg-stone-100 px-2 py-1 capitalize select-none hover:bg-stone-300 active:bg-stone-200">
                        { category.name }
                    </Link>
                )) }
            </Marquee>
        </div>
    )
}
