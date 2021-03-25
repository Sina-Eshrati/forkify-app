import icons from 'url:../../img/icons.svg';
import View from './View.js';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _overlay = document.querySelector('.overlay');
  _window = document.querySelector('.add-recipe-window');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _message = 'Recipe was successfully uploaded :)';
  _btnMore = document.querySelector('.more');
  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
    this.addMoreIngredients();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }
  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener(
      'click',
      function () {
        this._window.classList.add('hidden');
        this._overlay.classList.add('hidden');
      }.bind(this)
    );
  }
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }
  addMoreIngredients() {
    let ingredientsArray = [];
    this._btnMore.addEventListener('click', function () {
      const html = `
      <label>Ingredient ${ingredientsArray.length + 7}</label>
          <div>
            <input
              class="input-ing"
              type="text"
              name="ingredient-qnt-${ingredientsArray.length + 7}"
              placeholder="Quantity"
            />
            <input
              class="input-ing"
              type="text"
              name="ingredient-unt-${ingredientsArray.length + 7}"
              placeholder="Unit"
            />
            <input
              class="input-ing"
              type="text"
              name="ingredient-des-${ingredientsArray.length + 7}"
              placeholder="Description"
            />
          </div>
      `;
      document
        .querySelector('.column_ingredients')
        .insertAdjacentHTML('beforeend', html);
      ingredientsArray.push(html);
    });
  }
}

export default new AddRecipeView();
