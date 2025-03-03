import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Recipeitem from '../components/recipeitem';
import { v4 as uuidv4 } from 'uuid';
import useSWR from 'swr';
import { RecipeTypeHome } from "../types/apitype";

export const fetcher = async (url:string) : Promise<{res:{rec: RecipeTypeHome[], num: number}}> => {
  const res = await fetch(`${url}`);

  if(!res.ok){
    const error = new Error();
    error.cause = await res.json().then((data: {error: string}) => data.error)
    console.error(error.cause)
    throw error
  }

  return res.json()
}



export default function Category() {
  const [recipeItems, setRecipeItems] = useState<RecipeTypeHome[]>([]);
  const { category } = useParams<string>();
  const navigate = useNavigate();
  const mainRef = useRef<HTMLUListElement | null>(null);
  const [err, setErr]  = useState<string>('')

  const {data, error, isLoading} = useSWR(`/api/category/${category?.replaceAll('_', ' ')}`,fetcher)

  if(!error && !isLoading && (data === undefined || data.res.num <= 0)) navigate('/');

  useEffect(() => {
    setRecipeItems([])
  },[category])

  //More recipe loading
  useEffect(() => {
    const trackScrolling = async () => {
      if (data !== undefined && data.res?.rec.length + recipeItems.length < data?.res.num) {
        if (mainRef.current!.getBoundingClientRect().bottom < window.innerHeight ) {
          try {
            const res = await fetch(`/api/${category}/${10+recipeItems.length}`)
            const resJson = await res.json() as {res: RecipeTypeHome[] | undefined, error: string | undefined };
            if(resJson.res)setRecipeItems([...recipeItems,...resJson.res])
            if(resJson.error) setErr(resJson.error)
          } catch (error) {
            console.error(error)
          }
          
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
          <h1>
            {category?.charAt(0).toUpperCase() + category!.slice(1)}
          </h1>
        </div>
      </section>
      <article>
        <h2 className="recipes-container-header">Recipes</h2>
        <div id="recipes-container">
        {error && <div>{error}</div> }
        {isLoading &&  <div className='loading-content'>...Loading</div> }
        {data !== undefined &&
            data.res?.rec.map(recipe => <Recipeitem
              strMeal={recipe.strMeal}
              strMealThumb={recipe.strMealThumb}
              strCategory={category!.replaceAll('-', ' ')}
              strInstructions={recipe.strInstructions}
              key={uuidv4()} />)
          }
          
          {recipeItems.length > 0 &&
            recipeItems?.map(recipe => <Recipeitem
              strMeal={recipe.strMeal}
              strMealThumb={recipe.strMealThumb}
              strCategory={category!.replaceAll('-', ' ')}
              strInstructions={recipe.strInstructions}
              key={uuidv4()} />)
          }
          
        </div>
        {err !== '' && 
        <div>{err}</div>
        }
        {(data!== undefined && (data.res?.rec.length + recipeItems.length < data.res?.num )) &&
          <div className='loading-content'>...Loading</div>
          }
      </article>
    </main>
  )
}
