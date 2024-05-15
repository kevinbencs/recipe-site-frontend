import SearchImg from '../img/search2.png';
import { SyntheticEvent, useState, useEffect } from 'react';
import Recipeitem from '../components/recipeitem';
import { useNavigate, useParams } from "react-router-dom";
import { RecipeTypeHome } from '../types/apitype';


const url: string = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

export default function Search() {
  const navigate = useNavigate();
  const [recipeItems, setRecipeItems] = useState<Array<RecipeTypeHome> | null>(null);
  const { name } = useParams<string>();


  useEffect(() => {
    const callApi = async () => {
      try {
        const target: string | undefined = name?.replaceAll('-', ' ');
        const response: Response = await fetch('/',{
          method: "POST",
          headers: {
            "Accept": "application/json, text/plain",
            "Content-type": "application/json"
          },
          body: JSON.stringify({ name: target}),
        });
        const data: JSON = await response.json();
        const meals: RecipeTypeHome[] | null = data as unknown as RecipeTypeHome[] | null;
        setRecipeItems(meals);
      }
      catch (e) {
        console.error('Error: ', e);
      }
    };

    callApi();
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
        <h2 className="recipes-container-header">Recipes</h2>
        <div id="recipes-container">
          {recipeItems !== null &&
            recipeItems?.map((meal: RecipeTypeHome) => <Recipeitem
              strMeal={meal.strMeal}
              strMealThumb={meal.strMealThumb}
              strCategory={meal.strCategory}
              strInstructions={meal.strInstructions}
              key={meal.id} />)
          }
          {recipeItems === null &&
            <div>Sorry, there is no {name?.replaceAll('-', ' ')} recipe.</div>
          }
        </div>
      </article>
    </main>
  )
}
