import SearchImg from '../img/search2.png';
import { SyntheticEvent } from 'react';
import Recipeitem from '../components/recipeitem';
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import useSWR from 'swr';
import { RecipeTypeHome } from "../types/apitype";
import { Helmet } from 'react-helmet-async';



const fetcher = async (url: string): Promise<{ res: RecipeTypeHome[] }> => {
  const res = await fetch('/homePage');

  if (!res.ok) {
    const error = new Error();
    error.cause = await res.json().then((data: { error: string }) => data.error)
    console.error(error.cause)
    throw error
  }

  return res.json()
}

export default function Home() {
  const navigate = useNavigate()
  const { data, error, isLoading } = useSWR('/homePage', fetcher, {revalidateOnFocus: false})


  //search
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    const target = e.target as typeof e.target & {
      name: { value: string };
    };

    let name: string = target.name.value;

    if (name.replaceAll(' ', '') !== '') {
      navigate(`/search/${name.toLowerCase().replaceAll(' ', '-')}`);
    }
  };


  return (
    <>
      <Helmet>
        <title>Recipes</title>
        <link rel='preload' href={'/homePage'} as='fetch' />
        <meta property="og:title" content="Recipes" />
        <meta name="description" content='Recipe page' />
        <meta name='keywords' content='recipe' />
        <meta property="og:description" content='Recipe page' />
        <meta property='og:image' content='/static/media/search_background2.4ae55a27295ea43cc745.jpg' />
        <meta property='og:image:alt' content='Recipe page image' />
        <meta name="twitter:creator" content='Admin' />
        <meta name="twitter:title" content='Recipes' />
        <meta name="twitter:description" content='Recipe page' />
        <meta name='twitter:image' content='/static/media/search_background2.4ae55a27295ea43cc745.jpg' />
        <meta name='twitter:image:alt' content='Recipe page image' />
        <meta name="robots" content="index, follow, noimageindex"></meta>
        <meta name="googlebot" content="index, follow, noimageindex, max-video-preview:0, max-image-preview:large"></meta>
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
          <h1 className="recipes-container-header">Recipes</h1>
          <div id="recipes-container">
            {error && <div>{error}</div>}
            {isLoading && <div>...Loading</div>}
            {data !== undefined && data.res?.map(recipe => <Recipeitem
              strMeal={recipe.strMeal}
              strMealThumb={recipe.strMealThumb}
              strCategory={recipe.strCategory}
              strInstructions={recipe.strInstructions}
              key={uuidv4()} />)}

          </div>
        </article>
      </main>
    </>
  )
}
