import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class ResultsView extends previewView {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'Application could not find your recipe, please try again ;)';
  _message = '';
}

export default new ResultsView();
