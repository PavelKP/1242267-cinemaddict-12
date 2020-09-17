import {FilterType} from '../const.js';

export const filter = {
  [FilterType.ALL]: (filmCards) => filmCards,
  [FilterType.WATCHLIST]: (filmCards) => filmCards.filter((filmCard) => filmCard.isListed),
  [FilterType.HISTORY]: (filmCards) => filmCards.filter((filmCard) => filmCard.isWatched),
  [FilterType.FAVORITES]: (filmCards) => filmCards.filter((filmCard) => filmCard.isFavorite),
};
