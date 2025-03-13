import SearchImg from '../img/search2.png';
import { SyntheticEvent, useState, useEffect } from 'react';
import Recipeitem from '../components/recipeitem';
import { useNavigate, useParams } from "react-router-dom";
import { RecipeTypeHome } from '../types/apitype';
import useSWR from 'swr'
import { Helmet } from 'react-helmet-async';

export const fetcher = async (url: string): Promise<{ res: { rec: RecipeTypeHome[], num: number } }> => {
  const res = await fetch(`${url}`);

  if (!res.ok) {
    const error = new Error();
    error.cause = await res.json().then((data: { error: string }) => data.error)
    console.error(error.cause)
    throw error
  }

  return res.json()
}


export default function Search() {
  const navigate = useNavigate();
  const [recipeItems, setRecipeItems] = useState<Array<RecipeTypeHome>>([]);
  const { name } = useParams<string>();

  const { data, error, isLoading } = useSWR(`/api/search/${name}`, fetcher)

  useEffect(() => {
    const callApi = async () => {
      if (data && (recipeItems.length + data.res.rec.length < data.res.num)) {
        try {
          const response: Response = await fetch(`/api/search/${name}/${recipeItems.length}`);
          const data2 = await response.json() as { res: RecipeTypeHome[] | undefined, error: string | undefined };
          if (data2.res) setRecipeItems([...recipeItems, ...data2.res]);
        }
        catch (e) {
          console.error('Error: ', e);
        }
      };

    }
    document.addEventListener('scroll', callApi);

    return () => {
      document.removeEventListener('scroll', callApi);
    }
  });

  useEffect(() => {

    setRecipeItems([])
  }, [name]);

  //search
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    const target = e.target as typeof e.target & {
      name: { value: string };
    };

    let recipeName: string = target.name.value;

    if (recipeName.replaceAll(' ', '') !== '') {
      navigate(`/search/${recipeName.toLowerCase().replaceAll(' ', '-')}`);
    }
  };

  return (
    <>
      <Helmet>
        <title>{name?.replaceAll('-', ' ')}</title>
        <meta property="og:title" content={`Search ${name?.replaceAll('-', ' ')}`} />
        <meta name="description" content={`Search ${name?.replaceAll('-', ' ')} page`} />
        <meta name='keywords' content={name?.replaceAll('-', ' ')} />
        <meta property="og:description" content={`Search ${name?.replaceAll('-', ' ')} page`} />
        <meta property='og:image' content='/static/media/search_background2.4ae55a27295ea43cc745.jpg' />
        <meta property='og:image:alt' content='Recipe page image' />
        <meta name="twitter:creator" content='Admin' />
        <meta name="twitter:title" content={`Search ${name?.replaceAll('-', ' ')} page`} />
        <meta name="twitter:description" content={`Search ${name?.replaceAll('-', ' ')} page`} />
        <meta name='twitter:image' content='/static/media/search_background2.4ae55a27295ea43cc745.jpg' />
        <meta name='twitter:image:alt' content='Recipe page image' />
        <meta name="robots" content="noindex, nofollow, noimageindex"></meta>
        <meta name="googlebot" content="noindex, nofollow, noimageindex, max-video-preview:0, max-image-preview:large"></meta>
      </Helmet>
      <main>
        <section className="search-section">
          <div className="form-h2">
            <div></div>
            <div></div>
            <div></div>
            <h2>
              Find recipes
            </h2>
          </div>

          <form action="/" method="Get" onSubmit={handleSubmit}>
            <input type="text" name="name" id="name" className="name-search" />
            <input type="image" src={SearchImg} name="Submit" className="submit" alt='Search' />
          </form>
        </section>
        <article>
          <h1 className="recipes-container-header">{name?.replaceAll('-', ' ')}</h1>
          <div id="recipes-container">
            {error && <div>{error}</div>}
            {isLoading && <div className='loading-content'>...Loading</div>}
            {data !== undefined &&
              data.res.rec.map((meal: RecipeTypeHome) => <Recipeitem
                strMeal={meal.strMeal}
                strMealThumb={meal.strMealThumb}
                strCategory={meal.strCategory}
                strInstructions={meal.strInstructions}
                key={meal.id} />)
            }
            {recipeItems.length > 0 &&
              recipeItems.map((meal: RecipeTypeHome) => <Recipeitem
                strMeal={meal.strMeal}
                strMealThumb={meal.strMealThumb}
                strCategory={meal.strCategory}
                strInstructions={meal.strInstructions}
                key={meal.id} />)
            }
            {(data !== undefined && (data.res?.rec.length + recipeItems.length < data.res?.num)) &&
              <div className='loading-content'>...Loading</div>
            }
            {((data === undefined || data.res.num === 0) && !isLoading) &&
              <div>Sorry, there is no {name?.replaceAll('-', ' ')} recipe.</div>
            }
          </div>
        </article>
      </main>
    </>

  )
}
