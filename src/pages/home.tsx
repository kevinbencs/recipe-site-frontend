import SearchImg from '../img/search2.png';
import { SyntheticEvent, useState, useEffect } from 'react';
import Recipeitem from '../components/recipeitem';
import { useNavigate } from "react-router-dom";
import {RecipeTypeHome } from '../types/apitype';


const url: string = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

export default function Home() {
  const navigate = useNavigate()
  const [recipeItems1, setRecipeItems1] = useState<RecipeTypeHome[] | null>(null);
  const [recipeItems2, setRecipeItems2] = useState<RecipeTypeHome[] | null>(null);
  const [recipeItems3, setRecipeItems3] = useState<RecipeTypeHome[] | null>(null);


  useEffect(() => {
    const callApi = async () => {
      try {
        const apiData1: Response = await fetch('/',{
          method: "POST",
          headers: {
            "Accept": "application/json, text/plain",
            "Content-type": "application/json"
          },
          body: JSON.stringify({ name: 'beef and' }),
        });
        const apiData2: Response = await fetch('/',{
          method: "POST",
          headers: {
            "Accept": "application/json, text/plain",
            "Content-type": "application/json"
          },
          body: JSON.stringify({ request: "name", name: 'alfredo' }),
        });
        const apiData3: Response = await fetch('/',{
          method: "POST",
          headers: {
            "Accept": "application/json, text/plain",
            "Content-type": "application/json"
          },
          body: JSON.stringify({ request: "name", name: 'eggplant with' }),
        });

        const data1 = await apiData1.json();
        const data2 = await apiData2.json();
        const data3 = await apiData3.json();

        const meals1 = data1 as unknown as RecipeTypeHome[] | null;
        const meals2 = data2 as unknown as RecipeTypeHome[] | null;
        const meals3 = data3 as unknown as RecipeTypeHome[] | null;

        setRecipeItems1(meals1);
        setRecipeItems2(meals2);
        setRecipeItems3(meals3);
      }
      catch (e) {
        console.error('Error ', e)
      }

    }

    callApi();
  }, []);

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
          {recipeItems1 !== null && recipeItems1?.map(recipe => <Recipeitem
            strMeal={recipe.strMeal}
            strMealThumb={recipe.strMealThumb}
            strCategory={recipe.strCategory}
            strInstructions={recipe.strInstructions}
            key={recipe.id} />)}
          {recipeItems2 !== null && recipeItems2?.map(recipe => <Recipeitem
            strMeal={recipe.strMeal}
            strMealThumb={recipe.strMealThumb}
            strCategory={recipe.strCategory}
            strInstructions={recipe.strInstructions}
            key={recipe.id} />)}
          {recipeItems3 !== null && recipeItems3?.map(recipe => <Recipeitem
            strMeal={recipe.strMeal}
            strMealThumb={recipe.strMealThumb}
            strCategory={recipe.strCategory}
            strInstructions={recipe.strInstructions}
            key={recipe.id} />)}

        </div>
      </article>
    </main>
  )
}
