import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Recipe } from "../types";

//as we use typescript we can define the props types as below
interface Props {
  recipe: Recipe;
  isFavourite: boolean;
  onClick: () => void;
  onFavouriteButtonClick: (recipe: Recipe) => void;
}

export const RecipeCard = ({
  recipe,
  onClick,
  onFavouriteButtonClick,
  isFavourite,
}: Props) => {
  return (
    <div className="recipe-card" onClick={onClick}>
      <img src={recipe?.image} alt={recipe?.title} />
      <div className="recipe-card-title">
        <span
          onClick={(event) => {
            event.stopPropagation(); //since we have nested onClick events, if we click on this event it will also trigger the parent onClick event
            onFavouriteButtonClick(recipe);
          }}
        >
          {isFavourite ? (
            <AiFillHeart size={25} color="red"/>
          ) : (
            <AiOutlineHeart size={25} />
          )}
        </span>
        <h3>{recipe.title}</h3>
      </div>
    </div>
  );
};
