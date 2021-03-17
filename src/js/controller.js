import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Render spinner
    recipeView.renderSpinner();

    // Update highlight
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // Render recipe
    await model.loadRecipe(id);
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // 1: Get search query
    const query = searchView.getQuery();
    if (!query) return;
    resultsView.renderSpinner();

    // 2: Load search results
    await model.loadSearchResults(query);

    // 3: Render results
    resultsView.render(model.getSearchResultsPage());

    // 4: Render pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  // 1: Render results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2: Render pagination
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // 1: Update the state
  model.updateServings(newServings);
  // 2: Rerender the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1: Add or Delete bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2: Update recipe view
  recipeView.update(model.state.recipe);

  // 3: Render bookmark
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // 1: Show loading spinner
    addRecipeView.renderSpinner();

    // 2: Upload new recipe
    await model.uploadRecipe(newRecipe);

    // 3: Render new recipe
    recipeView.render(model.state.recipe);

    // 4: Show success message
    addRecipeView.renderMessage();

    // 5: Render new recipe in bookmarks
    bookmarksView.render(model.state.bookmarks);
    console.log(model.state.recipe);

    // 6: Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // 7: Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('welcome to recipe application');
};
init();
