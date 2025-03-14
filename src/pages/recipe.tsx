import { useState, useEffect, KeyboardEvent, SetStateAction, Dispatch, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RecipeDiscription from '../components/recipediscription';
import Recipeitem from '../components/recipeitem';
import CommemtContainer from '../components/commemtcontainer';
import { RecipeTypeHome, RecipeType, IngredientMeasure, } from '../types/apitype';
import { v4 as uuidv4 } from 'uuid';
import useSWR from 'swr';
import { Helmet } from 'react-helmet-async';

type Dispatcher<S> = Dispatch<SetStateAction<S>>;

//get Ingredients and Measures form API into ingredientsMeasures useState 
const getIngredientsMeasures = (result: RecipeType, setIngredientsMeasures: Dispatcher<Array<IngredientMeasure>>) => {
  let recipeElement: keyof RecipeType;
  let Measure: Array<string> = [];
  let Ingredient: Array<string> = [];
  let IngredientsMeasures: Array<IngredientMeasure> = [];

  //get Ingredients,Measures
  for (recipeElement in result) {
    if (recipeElement!.search('strIngredient') !== -1) {
      Ingredient.push(result[recipeElement]);
    }
    if (recipeElement.search('strMeasure') !== -1) {
      Measure.push(result[recipeElement]);
    }
  }

  //put Ingredients,Measures into ingredientsMeasures useState 
  for (let i = 0; i < 20 && Ingredient[i] !== ''; i++) {
    IngredientsMeasures.push(
      {
        strIngredient: JSON.stringify(Ingredient[i]),
        strMeasure: JSON.stringify(Measure[i])
      }
    );
  }
  setIngredientsMeasures(IngredientsMeasures);
};



const fetcher = async (url: string): Promise<{ res: { rec: RecipeType, num: number } | undefined, failed: string | undefined }> => {
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





export default function Recipe() {
  const [recipeItems, setRecipeItems] = useState<RecipeTypeHome[]>([]);
  const [ingredientsMeasures, setIngredientsMeasures] = useState<IngredientMeasure[]>([]);
  const [hideRecipeText, setHideRecipeText] = useState<string>('hide-text');
  const [hideRecipeIngredients, setHideRecipeIngredients] = useState<string>('hide-ingredients');
  const [hideComments, setHideComments] = useState<string>('hide-comments');
  const [err, setErr] = useState<string>('')
  const [readMore, setReadMore] = useState<boolean>(true);
  const mainRef = useRef<HTMLUListElement | null>(null);

  const { name } = useParams();
  const { category } = useParams();
  const navigate = useNavigate();

  const { data, error, isLoading } = useSWR(`/api/title/${name}`, fetcher, { revalidateOnFocus: false })

  if (!error && !isLoading && (data === undefined || data.failed !== undefined)) navigate('/');

  //recipe loading
  useEffect(() => {
    setRecipeItems([]);

    setReadMore(true);
    setHideRecipeIngredients('hide-ingredients');
    setHideRecipeText('hide-text');
    setHideComments('hide-comments');
  }, [name, category]);

  useEffect(() => {
    if (data && data.res) {
      getIngredientsMeasures(data.res.rec, setIngredientsMeasures)
    }
  }, [data])


  //More recipe loading when page scroll
  useEffect(() => {
    const trackScrolling = async () => {
      if (mainRef.current !== null) {
        if (mainRef.current.getBoundingClientRect().bottom < window.innerHeight && data !== undefined && data.res !== undefined && recipeItems.length < data.res.num) {
          try {
            const res = await fetch(`/api/morerecipe/${name}/${recipeItems.length}`)
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

  //show recipe
  const handleClick = () => {
    setHideRecipeText('');
    setReadMore(false);
    setHideRecipeIngredients('');
    setHideComments('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.code === 'Enter') {
      handleClick();
    }
  };




  return (
    <>
      <Helmet>
        <title>{(data !== undefined && data.res !== undefined) ? data.res?.rec.strMeal.slice(0, 1).toLocaleUpperCase() + data.res.rec.strMeal.slice(1, data.res?.rec.strMeal.length) : ''}</title>
        <meta property="og:title" content={(data !== undefined && data.res !== undefined) ? data.res?.rec.strMeal.slice(0, 1).toLocaleUpperCase() + data.res.rec.strMeal.slice(1, data.res?.rec.strMeal.length) : ''} />
        <meta name="description" content={data?.res?.rec.strInstructions.slice(0, 80)} />
        <meta name='keywords' content={category?.charAt(0).toUpperCase() + category!.slice(1)} />
        <meta property="og:description" content={data?.res?.rec.strInstructions.slice(0, 80)} />
        <meta property='og:image' content={data?.res?.rec.strMealThumb} />
        <meta property='og:image:alt' content={(data !== undefined && data.res !== undefined) ? data.res?.rec.strMeal.slice(0, 1).toLocaleUpperCase() + data.res.rec.strMeal.slice(1, data.res?.rec.strMeal.length) : ''} />
        <meta name="twitter:creator" content='Admin' />
        <meta name="twitter:title" content={(data !== undefined && data.res !== undefined) ? data.res?.rec.strMeal.slice(0, 1).toLocaleUpperCase() + data.res.rec.strMeal.slice(1, data.res?.rec.strMeal.length) : ''} />
        <meta name="twitter:description" content={data?.res?.rec.strInstructions.slice(0, 80)} />
        <meta name='twitter:image' content={data?.res?.rec.strMealThumb} />
        <meta name='twitter:image:alt' content={(data !== undefined && data.res !== undefined) ? data.res?.rec.strMeal.slice(0, 1).toLocaleUpperCase() + data.res.rec.strMeal.slice(1, data.res?.rec.strMeal.length) : ''} />
        <meta name="robots" content="index, follow, imageindex"></meta>
        <meta name="googlebot" content="index, follow, imageindex, max-video-preview:0, max-image-preview:large"></meta>
      </Helmet>
      <main ref={mainRef}>
        {error && <div>{error.message}</div>}
        {isLoading && <div className='loading-content'>...Loading</div>}
        {(data !== undefined && data.res !== undefined) &&
          <div className='recipe-discription'>
            <div className='recipe-header' style={{ backgroundImage: `url(${data.res.rec.strMealThumb})` }}>
              {
                data.res !== undefined &&
                <h1>
                  {data.res.rec.strMeal.slice(0, 1).toLocaleUpperCase() + data.res.rec.strMeal.slice(1, data.res.rec.strMeal.length)}
                </h1>
              }
            </div>

            <div className='recipe-main '>
              <div className={`recipe-video-text ${hideRecipeText}`}>
                {data.res.rec.strYoutube !== '' &&
                  <iframe src={data.res.rec.strYoutube.replace('watch?v=', 'embed/')} width="560" height="315" frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin" allowFullScreen title={data.res.rec.strMeal}>
                  </iframe>}
                <p>
                  {data.res.rec.strInstructions.replaceAll('\r\n\r\n', ' \n ')}
                </p>
              </div>

              <div className={`recipe-ingredients-container ${hideRecipeIngredients}`}>
                <div className="recipe-ingredients">
                  <div className='decoration'></div>
                  <div className='decoration'></div>
                  <ul>
                    {ingredientsMeasures.length > 0 && ingredientsMeasures.map(r => <RecipeDiscription strIngredient={r.strIngredient} strMeasure={r.strMeasure} key={uuidv4()} />)}
                  </ul>

                  <div className='decoration'></div>
                  <div className='decoration'></div>
                </div>
              </div>

              <CommemtContainer recipeId={Number(data.res.rec.id)} hideComments={hideComments} />

              {readMore && <div className='read-more' onClick={handleClick} tabIndex={0} onKeyDown={handleKeyDown}>
                Read more
              </div>}
            </div>
          </div>}

        {recipeItems !== null &&
          <section className='another-recipes'>
            <h2>You’ll Also Love</h2>
            <div id="recipes-container">{recipeItems?.map(meal => <Recipeitem
              strMeal={meal.strMeal}
              strMealThumb={meal.strMealThumb}
              strCategory={category!.replaceAll('-', ' ')}
              strInstructions={meal.strInstructions}
              key={uuidv4()} />)}
            </div>
          </section>
        }
        {err !== '' &&
          <div>{err}</div>
        }
        {(data && data.res && data.res.num > recipeItems.length) && <div className='loading-content'>Loading ...</div>}
      </main>
    </>
  )
}
