import { Recipe } from "../types";

//as we use typescript we can define the props types as below
interface Props {
  recipe: Recipe;
}

export const RecipeCard = ({ recipe }: Props) => {
  return (
    <div className="recipe-card">
      <img src={recipe?.image} alt={recipe?.title} />
      <div className="recipe-card-title">
        <h3>{recipe.title}</h3>
      </div>
    </div>
  );
};
