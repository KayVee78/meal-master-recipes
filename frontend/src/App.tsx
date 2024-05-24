import { FormEvent, useRef, useState } from "react";
import "./App.css";
import * as api from "./api";
import { Recipe } from "./types";
import { RecipeCard } from "./components/RecipeCard";

const App = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const pageNumber = useRef(1);

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

  return (
    <div>
      <form onSubmit={(e) => handleSearchSubmit(e)}>
        <input
          type="text"
          required
          placeholder="Enter a search term..."
          onChange={(e) => setSearchTerm(e.target.value)}
        ></input>
        <button>Search</button>
      </form>
      {recipes.map((recipe) => (
        <RecipeCard recipe={recipe} />
      ))}
      <button className="view-more-btn" onClick={handleViewMoreClick}>
        View More
      </button>
    </div>
  );
};

export default App;
