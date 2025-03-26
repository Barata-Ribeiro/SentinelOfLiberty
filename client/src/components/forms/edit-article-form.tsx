"use client"

import { ProblemDetails }                                    from "@/@types/application"
import { Article, Category }                                 from "@/@types/articles"
import patchOwnArticle                                       from "@/actions/articles/patch-own-article"
import ApplicationRequestFormError                           from "@/components/feedback/application-request-form-error"
import InputValidationError                                  from "@/components/feedback/input-validation-error"
import TextEditor                                            from "@/components/helpers/text-editor"
import FormButton                                            from "@/components/shared/form-button"
import FormInput                                             from "@/components/shared/form-input"
import FormTextarea                                          from "@/components/shared/form-textarea"
import { getInitialFormState }                               from "@/utils/functions"
import { Button, Field, Fieldset, Legend }                   from "@headlessui/react"
import { ChangeEvent, MouseEvent, useActionState, useState } from "react"
import placeholderImage                                      from "../../../public/image-error-placeholder.svg"

interface EditArticleFormProps {
    article: Article
    categories: Category[]
}

export default function EditArticleForm({ categories, article }: Readonly<EditArticleFormProps>) {
    const [ formState, formAction, pending ] = useActionState(patchOwnArticle, getInitialFormState())
    const [ editorContent, setEditorContent ] = useState<string>(article.content)
    const [ imgUrl, setImgUrl ] = useState(article.mediaUrl)
    const [ selectedCategories, setSelectedCategories ] =
        useState<string[]>(Array.from(article.categories).map(category => category.name))
    const [ categoriesInput, setCategoriesInput ] =
        useState(Array.from(article.categories).map(category => category.name).join(", "))
    
    function handleCategorySelection(event: MouseEvent<HTMLButtonElement>) {
        const category = event.currentTarget.textContent as string
        let updatedSelection: string[]
        
        if (selectedCategories.includes(category))
            updatedSelection = selectedCategories.filter(item => item !== category)
        else updatedSelection = [ ...selectedCategories, category ]
        
        setSelectedCategories(updatedSelection)
        setCategoriesInput(updatedSelection.join(", "))
    }
    
    function handleCategoryInputChange(event: ChangeEvent<HTMLInputElement>) {
        const newValue = event.target.value
        setCategoriesInput(newValue)
        const inputCategories = newValue
            .split(",")
            .map(item => item.trim().toLowerCase())
            .filter(Boolean)
        setSelectedCategories(inputCategories)
    }
    
    return (
        <form action={ formAction } className="mb-8 grid grid-cols-1 content-stretch gap-6">
            <input type="hidden" name="articleId" value={ article.id } />

            <Fieldset className="mx-auto w-full max-w-2xl space-y-3">
                <Legend>
                    <h2 className="text-shadow-900 text-base/7 font-semibold">Article Information</h2>
                    <p className="text-shadow-600 mt-1 mb-6 text-sm/6">
                        Write the title of your article and start writing the content.
                    </p>
                </Legend>

                <FormInput
                    type="text"
                    label="Title"
                    name="title"
                    defaultValue={ article.title }
                    placeholder="e.g., An opinion on the current state of the world"
                    required
                    aria-required
                />

                <FormInput
                    label="Sub Title"
                    name="subTitle"
                    type="text"
                    defaultValue={ article.subTitle }
                    placeholder="e.g., An In-Depth Look at Recent Developments"
                    required
                    aria-required
                />

                <FormTextarea
                    label="Summary"
                    name="summary"
                    rows={ 4 }
                    minLength={ 50 }
                    maxLength={ 250 }
                    defaultValue={ article.summary }
                    placeholder="Write your summary here..."
                    description="Use at least 50 characters and a maximum of 250 characters."
                    required
                    aria-required
                />
            </Fieldset>

            <Fieldset className="mx-auto w-full max-w-2xl space-y-3">
                <Legend>
                    <h2 className="text-shadow-900 text-base/7 font-semibold">Content</h2>
                    <p className="text-shadow-600 mt-1 mb-6 text-sm/6">
                        Please, follow the guidelines when writing the content of your article.
                    </p>
                </Legend>

                <TextEditor content={ editorContent } onUpdate={ setEditorContent } />

                <input type="hidden" name="content" value={ editorContent } required aria-required />
            </Fieldset>

            <Field className="mx-auto w-full max-w-2xl space-y-3">
                <FormInput
                    type="url"
                    label="Image"
                    name="mediaUrl"
                    pattern="https://.*"
                    placeholder="https://example.com/image.jpg"
                    defaultValue={ article.mediaUrl }
                    description="Add the URL of the image you want to use as a cover for your article."
                    onChange={ event => setImgUrl(event.target.value) }
                    required
                    aria-required
                />
                
                { imgUrl && (
                    <div className="min-w-none mx-auto rounded-md shadow">
                        {/* eslint-disable-next-line @next/next/no-img-element */ }
                        <img
                            src={ imgUrl }
                            alt="Preview"
                            title="Preview"
                            className="min-h-96 w-full rounded-md object-cover object-center"
                            sizes="100vw"
                            onError={ event => {
                                event.currentTarget.id = placeholderImage.id
                                event.currentTarget.src = placeholderImage.src
                            } }
                        />
                    </div>
                ) }
            </Field>

            <Fieldset className="mx-auto w-full max-w-2xl">
                <FormTextarea
                    label="References"
                    name="references"
                    rows={ 8 }
                    defaultValue={ article.references.join(", ") }
                    placeholder="Write your references here..."
                    description="Add the references of your article in case you used any external sources. Separate each reference
                    with a comma."
                    required
                    aria-required
                />
            </Fieldset>

            <Fieldset className="mx-auto w-full max-w-2xl">
                <FormInput
                    type="text"
                    label="Categories"
                    name="categories"
                    placeholder="e.g., News, Politics, Technology"
                    description="Add the categories of your article. Separate each category with a comma."
                    onChange={ handleCategoryInputChange }
                    value={ categoriesInput }
                    required
                    aria-required
                />

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
                                className="text-shadow-700 data-[selected=true]:text-shadow-300 cursor-pointer rounded bg-stone-100 px-2 py-1 capitalize select-none hover:bg-stone-300 focus:outline-none data-[selected=true]:bg-stone-900">
                                { category.name }
                            </Button>
                        )) }
                        
                        { !categories ||
                            (categories.length === 0 && (
                                <p className="text-shadow-400 w-full text-center">
                                    No categories available at the moment.
                                </p>
                            )) }
                    </div>
                </div>
            </Fieldset>
            
            { formState.error && (
                <div className="mx-auto w-full max-w-2xl">
                    { !Array.isArray(formState.error) && (
                        <ApplicationRequestFormError error={ formState.error as ProblemDetails } />
                    ) }
                    
                    { Array.isArray(formState.error) && <InputValidationError errors={ formState.error } /> }
                </div>
            ) }
            
            <FormButton width="full" className="mx-auto max-w-2xl" pending={ pending }>
                Save Changes
            </FormButton>
        </form>
    )
}
