import { Link } from 'react-router-dom';

export default function Recipeitem(props: { strMeal: string, strMealThumb: string, strCategory: string, strInstructions: string }) {
    return (
        <Link to={`/${props.strCategory.toLocaleLowerCase().replaceAll(' ', '-')}/${props.strMeal.toLocaleLowerCase().replaceAll(' ', '-')}`} className='recipe-item'>
            <img src={props.strMealThumb} alt={props.strMeal} />
            <h3>
                {props.strMeal.slice(0, 1).toLocaleUpperCase()+props.strMeal.slice(1, 50)}
            </h3>
            <div className='link-text-container'>
                <p>
                    {props.strInstructions.slice(0, 80)}
                </p>
                <div className='link-text-shadow'></div>
            </div>

        </Link>
    )
}
