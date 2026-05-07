import React from "react"
import IngredientsList from "./components/IngredientsList"
import ClaudeRecipe from "./components/ClaudeRecipe"
import { getRecipeFromMistral } from "./ai"

export default function Main() {
    const [ingredients, setIngredients] = React.useState([])
    const [recipe, setRecipe] = React.useState("")
    const [isGenerating, setIsGenerating] = React.useState(false)

    const recipeSection = React.useRef(null)

    React.useEffect(() => {
        if (recipe !== "" && recipeSection.current !== null) {
            recipeSection.current.scrollIntoView({ 
                behavior: "smooth", 
                block: "start" 
            })
        }
    }, [recipe])

    async function getRecipe() {
        setIsGenerating(true)
        try {
            const recipeMarkdown = await getRecipeFromMistral(ingredients)
            setRecipe(recipeMarkdown)
        } finally {
            setIsGenerating(false)
        }
    }

    function addIngredient(formData) {
        const newIngredient = formData.get("ingredient")
        setIngredients(prevIngredients => [...prevIngredients, newIngredient])
    }

    function removeIngredient(ingredient) {
        setIngredients(prevIngredients => prevIngredients.filter(item => item !== ingredient))
    }

    return (
        <main>
            <form action={addIngredient} className="add-ingredient-form">
                <input
                    type="text"
                    placeholder="e.g. oregano"
                    aria-label="Add ingredient"
                    name="ingredient"
                />
                <button>Add ingredient</button>
                <p>Add more than three ingredients</p>
            </form>

            {ingredients.length > 0 &&
                <IngredientsList
                    ingredients={ingredients}
                    getRecipe={getRecipe}
                    removeIngredient={removeIngredient}
                    isGenerating={isGenerating}
                />
            }

            {recipe && (
                <div ref={recipeSection}>
                    <ClaudeRecipe recipe={recipe} />
                </div>
            )}
        </main>
    )
}