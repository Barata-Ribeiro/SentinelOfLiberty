"use client"

import { ProblemDetails }                                                                             from "@/@types/application"
import {
    Category,
}                                                                                                     from "@/@types/articles"
import getAllAvailableCategories
                                                                                                      from "@/actions/articles/get-all-available-categories"
import postNewArticle
                                                                                                      from "@/actions/articles/post-new-article"
import ApplicationRequestFormError
                                                                                                      from "@/components/feedback/application-request-form-error"
import InputValidationError
                                                                                                      from "@/components/feedback/input-validation-error"
import Spinner
                                                                                                      from "@/components/helpers/spinner"
import FormButton
                                                                                                      from "@/components/shared/form-button"
import FormInput
                                                                                                      from "@/components/shared/form-input"
import FormTextarea
                                                                                                      from "@/components/shared/form-textarea"
import {
    getInitialFormState,
}                                                                                                     from "@/utils/functions"
import {
    Button,
    Field,
    Fieldset,
    Legend,
}                                                                                                     from "@headlessui/react"
import { ChangeEvent, KeyboardEvent, MouseEvent, useActionState, useEffect, useState, useTransition } from "react"
import {
    FaCircleExclamation,
}                                                                                                     from "react-icons/fa6"

export default function NewArticleForm() {
    const [ categories, setCategories ] = useState<Category[] | null>(null)
    const [ selectedCategories, setSelectedCategories ] = useState<string[]>([])
    const [ formState, formAction, pending ] = useActionState(postNewArticle, getInitialFormState())
    const [ imgUrl, setImgUrl ] = useState("")
    const [ isPending, startTransition ] = useTransition()
    
    async function getServersideCategories() {
        const state = await getAllAvailableCategories()
        if (!state.ok) return
        
        startTransition(() => setCategories(state.response?.data as Category[]))
    }
    
    useEffect(() => {
        getServersideCategories().catch(console.error)
        return () => setCategories(null)
    }, [])
    
    function handleCategorySelection(event: MouseEvent<HTMLButtonElement>) {
        const category = event.currentTarget.textContent as string
        setSelectedCategories(prevState => {
            if (prevState.includes(category)) return prevState.filter(item => item !== category)
            return [ ...prevState.filter(item => item), category ]
        })
    }
    
    function handleCategoryInputChange(event: ChangeEvent<HTMLInputElement>) {
        const input = event.target.value
        const inputCategories = input.split(",").map(item => item.trim())
        
        setSelectedCategories(prevState => {
            const newCategories = inputCategories.filter(cat => !prevState.includes(cat))
            const removedCategories = prevState.filter(cat => !inputCategories.includes(cat))
            return [ ...prevState.filter(cat => !removedCategories.includes(cat)), ...newCategories ]
        })
    }
    
    function handleCategoryInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Backspace" && !event.currentTarget.value) {
            setSelectedCategories(prevState => prevState.slice(0, prevState.length - 1))
        }
    }
    
    return (
        <form action={ formAction } className="mb-8 grid grid-cols-1 content-stretch gap-6">
            <Fieldset className="mx-auto w-full max-w-2xl space-y-3">
                <Legend>
                    <h2 className="text-shadow-900 text-base/7 font-semibold">Article Information</h2>
                    <p className="text-shadow-600 mt-1 mb-6 text-sm/6">
                        Write the title of your article and start writing the content.
                    </p>
                </Legend>

                <FormInput label="Title" name="title" type="text" required aria-required />
                <FormInput label="Sub Title" name="subTitle" type="text" required aria-required />
            </Fieldset>

            <Fieldset className="mx-auto h-fit w-full max-w-2xl space-y-3">
                <Legend>
                    <h2 className="text-shadow-900 text-base/7 font-semibold">Content</h2>
                    <p className="text-shadow-600 mt-1 mb-6 text-sm/6">
                        Please, follow the guidelines when writing the content of your article.
                    </p>
                </Legend>
                <FormTextarea rows={ 16 } label="Content" name="content" required aria-required />
            </Fieldset>

            <Field className="mx-auto w-full max-w-2xl space-y-3">
                <FormInput
                    label="Image"
                    name="mediaUrl"
                    type="url"
                    pattern="https://.*"
                    required
                    aria-required
                    onChange={ event => setImgUrl(event.target.value) }
                />
                
                { imgUrl && (
                    <img
                        src={ imgUrl }
                        alt="Preview"
                        title="Preview"
                        className="mx-auto max-h-[50%] min-w-none w-full rounded-lg object-cover shadow"
                        onError={ e => {
                            e.currentTarget.src = "https://placehold.co/1920x1080?text=Error\\nTry+again&font=Lora.png"
                        } }
                    />
                ) }
            </Field>

            <Fieldset className="mx-auto w-full max-w-2xl">
                <FormTextarea label="References" name="references" required aria-required />
                <Legend className="text-shadow-400 mt-2 flex items-start gap-x-2 text-xs">
                    <FaCircleExclamation aria-hidden="true" className="size-4" />
                    Add the references of your article in case you used any external sources. Separate each reference
                    with a comma.
                </Legend>
            </Fieldset>

            <Fieldset className="mx-auto w-full max-w-2xl">
                <FormInput
                    label="Categories"
                    name="categories"
                    onChange={ handleCategoryInputChange }
                    onKeyDown={ handleCategoryInputKeyDown }
                    value={ selectedCategories.join(", ") }
                    required
                    aria-required
                />
                <Legend className="text-shadow-400 mt-2 flex items-start gap-x-2 text-xs">
                    <FaCircleExclamation aria-hidden="true" className="size-4" />
                    Add the categories of your article. Separate each category with a comma.
                </Legend>

                <div>
                    <h3 className="mt-6 flex flex-row flex-nowrap items-center">
                        <span className="block flex-grow border-t border-stone-900"></span>
                        <span className="text-md text-shadow-50 mx-4 block flex-none rounded bg-stone-900 px-4 py-2.5 leading-none font-medium select-none">
                            Available Categories
                        </span>
                        <span className="block flex-grow border-t border-stone-900"></span>
                    </h3>

                    <div className="mx-auto my-4 flex max-w-sm flex-wrap justify-center gap-2 p-4 text-sm">
                        { categories?.map(category => (
                            <Button
                                key={ `category-${ category.id }-${ category.name }` }
                                type="button"
                                data-selected={ selectedCategories.includes(category.name) }
                                onClick={ handleCategorySelection }
                                className="text-shadow-700 data-[selected=true]:text-shadow-300 cursor-pointer rounded bg-stone-100 px-2 py-1 select-none hover:bg-stone-300 focus:outline-none data-[selected=true]:bg-stone-900">
                                { category.name }
                            </Button>
                        )) }
                        { isPending &&
                            Array.from({ length: 5 }).map((_, index) => (
                                <Button
                                    key={ `category-${ index }-loading` }
                                    type="button"
                                    className="animate-pulse rounded bg-stone-500 px-2 py-1 select-none">
                                    Tag
                                </Button>
                            )) }
                    </div>
                </div>
            </Fieldset>

            <div className="mx-auto w-full max-w-2xl">
                { formState.error && !Array.isArray(formState.error) && (
                    <ApplicationRequestFormError error={ formState.error as ProblemDetails } />
                ) }
                
                { formState.error && Array.isArray(formState.error) &&
                    <InputValidationError errors={ formState.error } /> }
            </div>

            <FormButton className="mx-auto w-full max-w-2xl justify-center" disabled={ pending }>
                { pending ? (
                    <>
                        <Spinner /> Loading...
                    </>
                ) : (
                      "Publish Article"
                  ) }
            </FormButton>
        </form>
    )
}
