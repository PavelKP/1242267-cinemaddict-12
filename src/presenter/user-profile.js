import UserProfileView from '../view/user-profile.js';
import {render, replace, remove} from '../utils/render.js';

export default class UserProfilePresenter {
  constructor(container, userProfileModel, filmCardsModel) {
    this._container = container;
    this._userProfileModel = userProfileModel;
    this._filmCardsModel = filmCardsModel;

    this._activeRank = null;
    this._userProfileComponent = null;

    this._userProfileModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._activeRank = this._userProfileModel.getRank();

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
