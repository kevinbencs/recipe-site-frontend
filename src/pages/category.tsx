import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Recipeitem from '../components/recipeitem';
import { RecipeTypeHome } from '../types/apitype';
import { v4 as uuidv4 } from 'uuid';



export default function Category() {
  const [recipeItems, setRecipeItems] = useState<RecipeTypeHome[] | null>(null);
  const [canCallApi, setCanCallApi] = useState<boolean>(true);
  const [mealsNumber, setMealsNumber] = useState<number>(0);
  const [loadMealsNumber, setLoadMealsNumber] = useState<number>(0);
  const [mealsId, setMealsId] = useState<RecipeTypeHome[] | null>(null);
  const { category } = useParams<string>();
  const navigate = useNavigate();
  const mainRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    setRecipeItems(null);
    setLoadMealsNumber(0);
    setMealsNumber(0);
    const callApi = async () => {
      try {
        const response: Response = await fetch('/category',{
          method: "POST",
          headers:{
            "Accept": "application/json, text/plain",
            "Content-type": "application/json"
          },
          body: JSON.stringify({ category: category?.replaceAll('-', ' ')})});
        const data: JSON = await response.json();
        const meals: RecipeTypeHome[] | null = data as unknown as RecipeTypeHome[];
        if (meals.length === 0 || meals === null) {
          navigate('/');
        }
        else {
          setMealsNumber(meals.length);
          setMealsId(meals);
          let mealById: RecipeTypeHome[] = [];
          for (let i = 0; i < 6 && i < meals.length; i++) {
            const recipe: RecipeTypeHome | null = meals[i] as unknown as RecipeTypeHome;
            mealById.push(recipe);
          }
          setRecipeItems(mealById);
          setLoadMealsNumber(6);
        }
      }
      catch (e) {
        console.error('Error: ', e);
        navigate('/');
      }
    };

    callApi();
  }, [category]);


  //More recipe loading
  useEffect(() => {
    const trackScrolling = async () => {
      if (canCallApi) {
        if (mainRef.current!.getBoundingClientRect().bottom < window.innerHeight && loadMealsNumber < mealsNumber && mealsNumber > 6 && mealsId) {
          setCanCallApi(false);

          let mealById: RecipeTypeHome[] = [];
          for (let i = loadMealsNumber; i < loadMealsNumber + 6 && i < mealsNumber; i++) {
            const recipe: RecipeTypeHome | null = mealsId[i] as unknown as RecipeTypeHome;
            mealById.push(recipe);
          }

          if (recipeItems) {
            setRecipeItems([...recipeItems, ...mealById]);
          }
          else {
            setRecipeItems(mealById);
          }

          setLoadMealsNumber(loadMealsNumber + 6);
          setCanCallApi(true);
        }
      }

    };

    document.addEventListener('scroll', trackScrolling);

    return () => {
      document.removeEventListener('scroll', trackScrolling);
    }

  });



  return (
    <main id='main' ref={mainRef}>
      <section className="search-section">
        <div className="form-h2">
          <div></div>
          <div></div>
          <div></div>
          <h2>
            {category?.charAt(0).toUpperCase() + category!.slice(1)}
          </h2>
        </div>
      </section>
      <article>
        <h2 className="recipes-container-header">Recipes</h2>
        <div id="recipes-container">
          {recipeItems !== null &&
            recipeItems?.map(recipe => <Recipeitem
              strMeal={recipe.strMeal}
              strMealThumb={recipe.strMealThumb}
              strCategory={category!.replaceAll('-', ' ')}
              strInstructions={recipe.strInstructions}
              key={uuidv4()} />)
          }
        </div>
        {loadMealsNumber < mealsNumber && <div className='loading-content'>Loading ...</div>}
      </article>
    </main>
  )
}
