import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Recipeitem from '../components/recipeitem';
import { v4 as uuidv4 } from 'uuid';
import useSWR from 'swr';
import { RecipeTypeHome } from "../types/apitype";
import { Helmet } from 'react-helmet-async';

export const fetcher = async (url: string): Promise<{ res: { rec: RecipeTypeHome[], num: number } }> => {
  try {
    const res = await fetch(`${url}`);

    if (!res.ok) {
      const errorMessage = await res.json().then(data => data.error || "unknown error");
      console.error(errorMessage)

      throw new Error(errorMessage);
    }

    return res.json()
  } catch (error) {
    console.error(error)
    throw new Error('Server error');
  }

}



export default function Category() {
  const [recipeItems, setRecipeItems] = useState<RecipeTypeHome[]>([]);
  const { category } = useParams<string>();
  const navigate = useNavigate();
  const mainRef = useRef<HTMLUListElement | null>(null);
  const [err, setErr] = useState<string>('')

  const { data, error, isLoading } = useSWR(`/api/category/${category?.replaceAll('_', ' ')}`, fetcher, { revalidateOnFocus: false })

  if (!error && !isLoading && (data === undefined || data.res.num <= 0)) navigate('/');

  useEffect(() => {
    setRecipeItems([])
  }, [category])

  //More recipe loading
  useEffect(() => {
    const trackScrolling = async () => {
      if (data !== undefined && data.res?.rec.length + recipeItems.length < data?.res.num) {
        if (mainRef.current!.getBoundingClientRect().bottom < window.innerHeight) {
          try {
            const res = await fetch(`/api/${category}/${10 + recipeItems.length}`)
            const resJson = await res.json() as { res: RecipeTypeHome[] | undefined, error: string | undefined };
            if (resJson.res) setRecipeItems([...recipeItems, ...resJson.res])
            if (resJson.error) setErr(resJson.error)
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
    <>
      <Helmet>
        <title>{category?.charAt(0).toUpperCase() + category!.slice(1)}</title>
        <meta property="og:title" content={category?.charAt(0).toUpperCase() + category!.slice(1)} />
        <meta name="description" content='Recipe page' />
        <meta name='keywords' content={category?.charAt(0).toUpperCase() + category!.slice(1)} />
        <meta property="og:description" content={`${category?.charAt(0).toUpperCase() + category!.slice(1)} page`} />
        <meta property='og:image' content='/static/media/search_background2.4ae55a27295ea43cc745.jpg' />
        <meta property='og:image:alt' content={category?.charAt(0).toUpperCase() + category!.slice(1)} />
        <meta name="twitter:creator" content='Admin' />
        <meta name="twitter:title" content={category?.charAt(0).toUpperCase() + category!.slice(1)} />
        <meta name="twitter:description" content={`${category?.charAt(0).toUpperCase() + category!.slice(1)} page`} />
        <meta name='twitter:image' content='/static/media/search_background2.4ae55a27295ea43cc745.jpg' />
        <meta name='twitter:image:alt' content='Recipe page image' />
        <meta name="robots" content="index, follow, noimageindex"></meta>
        <meta name="googlebot" content="index, follow, noimageindex, max-video-preview:0, max-image-preview:large"></meta>
      </Helmet>
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
            {error && <div>{error.message}</div>}
            {isLoading && <div className='loading-content'>...Loading</div>}
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
          {(data !== undefined && (data.res?.rec.length + recipeItems.length < data.res?.num)) &&
            <div className='loading-content'>...Loading</div>
          }
        </article>
      </main>
    </>
  )
}
