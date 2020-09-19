import UserProfileView from '../view/user-profile.js';
import {render, replace, remove} from '../utils/render.js';
import {getUserRank} from '../utils/user-profile.js';
import {userGradeSettings} from '../const.js';

export default class UserProfilePresenter {
  constructor(container, filmCardsModel) {
    this._container = container;
    this._filmCardsModel = filmCardsModel;

    this._activeRank = null;
    this._userProfileComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filmCardsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._activeRank = getUserRank(this._filmCardsModel.getFilmCards(), userGradeSettings);

    const prevUserProfileComponent = this._userProfileComponent;

    this._userProfileComponent = new UserProfileView(this._activeRank);

    if (!prevUserProfileComponent) {
      render(this._container, this._userProfileComponent, `beforeend`);
      return;
    }

    replace(this._userProfileComponent, prevUserProfileComponent);
    remove(prevUserProfileComponent);
  }

  _handleModelEvent() {
    this.init();
  }
}
