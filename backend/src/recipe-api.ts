const apiKey = process.env.API_KEY;

export const searchRecipes = async (searchTerm: string, page: number) => {
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const url = new URL("https://api.spoonacular.com/recipes/complexSearch");

  const queryParams = {
    apiKey,
    query: searchTerm,
    number: "10", //items per page
    offset: (page * 10).toString(), //1st page offset = 0-9, 2nd page offset = 10-19
  };
  url.search = new URLSearchParams(queryParams).toString();

  try {
    const searchResponse = await fetch(url);
    const resultsJson = await searchResponse.json();
    return resultsJson;
  } catch (error) {
    console.error("Error searching for recipes", error);
    return null;
  }
};

export const getRecipeSummary = async (recipeId: string) => {
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  const url = new URL(
    `https://api.spoonacular.com/recipes/${recipeId}/summary`
  );
  const queryParams = {
    apiKey,
  };
  url.search = new URLSearchParams(queryParams).toString();
  try {
    const response = await fetch(url);
    const resultsJson = await response.json();
    return resultsJson;
  } catch (error) {
    console.error("Error searching for recipes", error);
    return null;
  }
};

export const getFavouriteRecipesByIds = async (ids: string[]) => {
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  const url = new URL("https://api.spoonacular.com/recipes/informationBulk");
  const params = {
    apiKey: apiKey,
    ids: ids.join(","),
  };
  url.search = new URLSearchParams(params).toString();

  try {
    const searchResponse = await fetch(url);
    const resultsJson = await searchResponse.json();
    return { results: resultsJson };
  } catch (error) {
    console.error("Error searching for favorites", error);
    return null;
  }
};
