import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class ResultsView extends previewView {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'Application could not find your recipe, please try again ;)';
  _message = '';

  addHandlerSort(handler) {
    // let sorted = false;
    document.querySelector('.btn--sort').addEventListener('click', function () {
      // sorted = !sorted;
      handler();
    });
  }
}

export default new ResultsView();
