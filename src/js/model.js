import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helpers';

export let sorted = false;

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
  shoppingList: [],
};

const convertData = function (data) {
  const recipe = data.data.recipe;
  return {
    cookingTime: recipe.cooking_time,
    id: recipe.id,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = convertData(data);
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page, sort) {
  state.search.page = page;
  const results = sort
    ? state.search.results.slice().sort(function (a, b) {
        if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;
        if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
      })
    : state.search.results;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (newServings / state.recipe.servings) * ing.quantity;
  });
  state.recipe.servings = newServings;
};

const storeBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const storeShoppingList = function () {
  localStorage.setItem('shopping list', JSON.stringify(state.shoppingList));
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  storeBookmarks();
};

export const addToShoppingList = function () {
  const shoppingListFormat = {
    title: state.recipe.title,
    ingredients: state.recipe.ingredients,
  };
  // state.shoppingList.push(state.recipe.ingredients);
  state.shoppingList.push(shoppingListFormat);
  storeShoppingList();
};

export const deleteFromShoppingList = function (title) {
  const index = state.shoppingList.findIndex(recipe => recipe.title === title);
  state.shoppingList.splice(index, 1);
  storeShoppingList();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  storeBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
  const shoppingListStorage = localStorage.getItem('shopping list');
  if (shoppingListStorage) state.shoppingList = JSON.parse(shoppingListStorage);
};
init();

const clearBookmarks = function () {
  localStorage.clear();
};
// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ings = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient'))
      .map(entry => entry[1]);
    const length = ings.length;
    let ingredientsArr = [];
    for (let i = 1; i <= length / 3; i++) {
      ingredientsArr.push(ings.slice(0, 3));
      ings.splice(0, 3);
    }
    console.log(ingredientsArr);
    const ingredients = ingredientsArr
      .filter(ing => ing[2] !== '')
      .map(ing => {
        const [quantity, unit, description] = ing;
        return { quantity: quantity ? quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: newRecipe.cookingTime,
      servings: newRecipe.servings,
      ingredients,
    };
    console.log(recipe);
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = convertData(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
