import icons from 'url:../../img/icons.svg';
import { Fraction } from 'fractional';
import View from './View.js';

class ShoppingListView extends View {
  _parentElement = document.querySelector('.shopping-list-container');
  _window = document.querySelector('.shopping-list-window');
  _overlay = document.querySelector('.overlay');
  _btnClose = document.querySelector('.btn--close-modal-shopping-list');
  _btnOpen = document.querySelector('.nav__btn--shopping-list');
  _btnDelete = document.querySelector('.btn-delete-shop-item');
  _errorMessage = 'No items added to shopping list';
  constructor() {
    super();
    this.addHandlerShowWindow();
    this.addHandlerHideWindow();
  }

  toggleWindow() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }
  addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener(
      'click',
      function () {
        this._window.classList.add('hidden');
        this._overlay.classList.add('hidden');
      }.bind(this)
    );
  }

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  addHandlerDelete(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn-delete-shop-item');
      if (!btn) return;
      const title = btn
        .closest('.items-title')
        .querySelector('.items-title-name').textContent;
      handler(title);
    });
  }

  _generateMarkup() {
    return `
      <ul class="recipe__ingredient-list shopping-list">
    ${this._data.map(rec => {
      return `
      <div class="items-title"><h1 class="items-title-name">${
        rec.title
      }</h1><button class="btn-delete-shop-item">delete</button></div>;
       ${rec.ingredients.map(ing => {
         return `
      <li class="recipe__ingredient">
      <svg class="recipe__icon">
        <use href="${icons}#icon-check"></use>
      </svg>
      <div class="recipe__quantity">${
        ing.quantity ? new Fraction(ing.quantity).toString() : ''
      }</div>
      <div class="recipe__description">
        <span class="recipe__unit">${ing.unit}</span>
        ${ing.description}
      </div>
    </li>
    `;
       })};
      `;
    })}
    </ul>
      `;
  }
}
export default new ShoppingListView();
