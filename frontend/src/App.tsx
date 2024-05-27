import { FormEvent, useEffect, useRef, useState } from "react";
import "./App.css";
import * as api from "./api";
import { Recipe } from "./types";
import { RecipeCard } from "./components/RecipeCard";
import { RecipeModal } from "./components/RecipeModal";
import { AiOutlineSearch } from "react-icons/ai";

type Tabs = "search" | "favourites";

const App = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>(
    undefined
  );
  const [selectedTab, setSelectedTab] = useState<Tabs>("search");
  const [favouriteRecipes, setFavouriteRecipes] = useState<Recipe[]>([]);
  const pageNumber = useRef(1);

  useEffect(() => {
    const fetchFavouriteRecipes = async () => {
      try {
        const favouriteRecipes = await api.getFavouriteRecipes();
        setFavouriteRecipes(favouriteRecipes.results);
        console.log("favouriteRecipes", favouriteRecipes);
      } catch (e) {
        console.error(e);
      }
    };
    fetchFavouriteRecipes();
  }, []);

  const handleSearchSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const recipes = await api.searchRecipes(searchTerm, 1);
      setRecipes(recipes?.results);
      pageNumber.current = 1;
    } catch (e) {
      console.error(e);
    }
  };

  const handleViewMoreClick = async () => {
    const nextPageNumber = pageNumber.current + 1;
    try {
      const nextRecipeList = await api.searchRecipes(
        searchTerm,
        nextPageNumber
      );
      setRecipes([...recipes, ...nextRecipeList.results]);
      pageNumber.current = nextPageNumber;
    } catch (e) {
      console.error(e);
    }
  };

  const addFavouriteRecipe = async (recipe: Recipe) => {
    try {
      await api.addFavouriteRecipe(recipe);
      setFavouriteRecipes([...favouriteRecipes, recipe]);
    } catch (e) {
      console.error(e);
    }
  };

  const removeFavouriteRecipe = async (recipe: Recipe) => {
    try {
      await api.removeFavouriteRecipe(recipe);
      setFavouriteRecipes(
        favouriteRecipes.filter((favRecipe) => favRecipe.id !== recipe.id)
      );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <img src="/main-img.jpg"></img>
        <div className="title">Meal Master Recipes</div>
      </div>
      <div className="tabs">
        <h2
          className={selectedTab === "search" ? "tab-active" : ""}
          onClick={() => setSelectedTab("search")}
        >
          Recipe Search
        </h2>
        <h2
          className={selectedTab === "favourites" ? "tab-active" : ""}
          onClick={() => setSelectedTab("favourites")}
        >
          Favourites
        </h2>
      </div>
      {selectedTab === "search" && (
        <>
          <form onSubmit={(e) => handleSearchSubmit(e)}>
            <input
              type="text"
              required
              placeholder="Enter a search term..."
              onChange={(e) => setSearchTerm(e.target.value)}
            ></input>
            <button>
              <AiOutlineSearch size={30} />
            </button>
          </form>

          <div className="recipe-grid">
            {recipes.map((recipe) => {
              const isFavourite = favouriteRecipes.some(
                (favRecipe) => recipe.id == favRecipe.id
              );
              return (
                <RecipeCard
                  recipe={recipe}
                  onClick={() => setSelectedRecipe(recipe)}
                  onFavouriteButtonClick={
                    isFavourite ? removeFavouriteRecipe : addFavouriteRecipe
                  }
                  isFavourite={isFavourite}
                />
              );
            })}
          </div>
          <button className="view-more-button" onClick={handleViewMoreClick}>
            View More
          </button>
        </>
      )}

      {selectedTab === "favourites" && (
        <div className="recipe-grid">
          {favouriteRecipes.map((recipe) => (
            <RecipeCard
              recipe={recipe}
              onClick={() => setSelectedRecipe(recipe)}
              onFavouriteButtonClick={removeFavouriteRecipe}
              isFavourite={true}
            />
          ))}
        </div>
      )}

      {selectedRecipe ? (
        <RecipeModal
          recipeId={selectedRecipe.id.toString()}
          onClose={() => setSelectedRecipe(undefined)}
        />
      ) : null}
    </div>
  );
};

export default App;
