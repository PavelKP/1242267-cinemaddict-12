import {FilterType} from '../const.js';

export const filter = {
  [FilterType.ALL]: (filmCards) => filmCards.length,
  [FilterType.WATCHLIST]: (filmCards) => filmCards.filter((filmCard) => filmCard.isListed).length,
  [FilterType.HISTORY]: (filmCards) => filmCards.filter((filmCard) => filmCard.isWatched).length,
  [FilterType.FAVORITES]: (filmCards) => filmCards.filter((filmCard) => filmCard.isFavorite).length,
};
