import { useState, useEffect, KeyboardEvent, SetStateAction, Dispatch, useRef} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RecipeDiscription from '../components/recipediscription';
import Recipeitem from '../components/recipeitem';
import CommemtContainer from '../components/commemtcontainer';
import { RecipeTypeHome, RecipeType, IngredientMeasure,} from '../types/apitype';
import { v4 as uuidv4 } from 'uuid';

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




export default function Recipe(props: {account: string}) {
  const [recipeItems, setRecipeItems] = useState<RecipeTypeHome[] | null>(null);
  const [canCallApi, setCanCallApi] = useState<boolean>(true);
  const [mealsNumber, setMealsNumber] = useState<number>(0);
  const [loadMealsNumber, setLoadMealsNumber] = useState<number>(0);
  const [mealsId, setMealsId] = useState<RecipeTypeHome[] | null>(null);
  const [youtubeVideo, setYoutubeVideo] = useState<string | undefined>('');
  const [recipeDiscription, setRecipeDiscription] = useState<RecipeType | null>(null);
  const [ingredientsMeasures, setIngredientsMeasures] = useState<IngredientMeasure[]>([]);
  const [hideRecipeText, setHideRecipeText] = useState<string>('hide-text');
  const [hideRecipeIngredients, setHideRecipeIngredients] = useState<string>('hide-ingredients');
  const [hideComments, setHideComments] = useState<string>('hide-comments');
  const [recipeId, setRecipeId] = useState<number>(0);
  const [readMore, setReadMore] = useState<boolean>(true);
  const mainRef = useRef<HTMLUListElement | null>(null);

  const { name } = useParams();
  const { category } = useParams();
  const navigate = useNavigate();

  //recipe loading
  useEffect(() => {
    setRecipeItems(null);
    const callRecipeDiscriptionApi = async () => {
      try {
        const response: Response = await fetch('/recipe',{
          method: "POST",
          headers:{
            "Accept": "application/json, text/plain",
            "Content-type": "application/json"
          },
          body: JSON.stringify({name: name?.replaceAll('-', ' ')})
        } );
        const data: JSON = await response.json();
        const meal: RecipeType[] | null = data as unknown as RecipeType[] | null;
        if (meal?.length === 0 || meal === null) {
          navigate('/');
        }
        else {
          setRecipeDiscription(meal[0]);
          setYoutubeVideo(meal[0]?.strYoutube.replace('watch?v=', 'embed/'));
          getIngredientsMeasures(meal[0], setIngredientsMeasures);
          setRecipeId(Number(meal[0].id));
        }
      }
      catch (e) {
        console.error('Error1:', e);
      }
    };

    const callRecipesApi = async () => {
      try {
        const response: Response = await fetch('/category',{
          method: 'POST',
          headers:{
            "Accept": "application/json, text/plain",
            "Content": "apllication/json"
          },
          body: JSON.stringify({category: category?.replaceAll('-', ' ')})
        });
        const data: JSON = await response.json();
        const meals: RecipeTypeHome[] | null = data as unknown as RecipeTypeHome[];

        let mealById: RecipeTypeHome[] = [];
        setMealsNumber(meals.length);
        setMealsId(meals);
        for (let i = 0; i < 6 && i < meals.length; i++) {
          const recipe: RecipeTypeHome | null = meals[i] as unknown as RecipeTypeHome

          mealById.push(recipe);
        }
        setRecipeItems(mealById);
        setLoadMealsNumber(6);
      }
      catch (e) {
        console.error('Error2: ', e);
      }
    };
    setReadMore(true);
    setHideRecipeIngredients('hide-ingredients');
    setHideRecipeText('hide-text');
    setHideComments('hide-comments');
    callRecipeDiscriptionApi();
    callRecipesApi()
  }, [name, category]);


  //More recipe loading when page scroll
  useEffect(() => {
    const trackScrolling = async () => {
      if (canCallApi && mainRef.current !== null) {
        if (mainRef.current.getBoundingClientRect().bottom < window.innerHeight && loadMealsNumber < mealsNumber && mealsNumber > 6 && mealsId) {
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
    <main ref={mainRef}>
      <div className='recipe-discription'>
        <div className='recipe-header' style={{ backgroundImage: `url(${recipeDiscription?.strMealThumb})` }}>
          <h2>
            {recipeDiscription !== null &&
            recipeDiscription.strMeal.slice(0,1).toLocaleUpperCase() + recipeDiscription.strMeal.slice(1,recipeDiscription.strMeal.length)}
          </h2>
        </div>

        <div className='recipe-main '>
          <div className={`recipe-video-text ${hideRecipeText}`}>
            {youtubeVideo !== '' &&
              <iframe src={youtubeVideo} width="560" height="315" frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin" allowFullScreen title={recipeDiscription?.strMeal}>
              </iframe>}
            <p>
              {recipeDiscription?.strInstructions.replaceAll('\r\n\r\n',' \n ')}
            </p>
          </div>

          <div className={`recipe-ingredients-container ${hideRecipeIngredients}`}>
            <div className="recipe-ingredients">
              <div className='decoration'></div>
              <div className='decoration'></div>
              <ul>
                {ingredientsMeasures.map(r => <RecipeDiscription strIngredient={r.strIngredient} strMeasure={r.strMeasure} key={uuidv4()} />)}
              </ul>

              <div className='decoration'></div>
              <div className='decoration'></div>
            </div>
          </div>

          <CommemtContainer recipeId={recipeId} hideComments={hideComments} account={props.account}/>

          {readMore && <div className='read-more' onClick={handleClick} tabIndex={0} onKeyDown={handleKeyDown}>
            Read more
          </div>}
        </div>
      </div>
      {recipeItems !== null &&
        <section className='another-recipes'>
          <h2>You’ll Also Love</h2>
          <div id="recipes-container">{recipeItems?.filter(recipe => recipe.strMeal !== recipeDiscription?.strMeal).map(meal => <Recipeitem
            strMeal={meal.strMeal}
            strMealThumb={meal.strMealThumb}
            strCategory={category!.replaceAll('-', ' ')}
            strInstructions={meal.strInstructions}
            key={uuidv4()} />)}
          </div>
        </section>
      }
      {loadMealsNumber < mealsNumber && <div className='loading-content'>Loading ...</div>}
    </main>
  )
}
