const filmCardsToFilterMap = {
  all: (filmCards) => filmCards.length,
  watchlist: (filmCards) => filmCards.filter((filmCard) => filmCard.isListed).length,
  history: (filmCards) => filmCards.filter((filmCard) => filmCard.isWatched).length,
  favorites: (filmCards) => filmCards.filter((filmCard) => filmCard.isFavorite).length,
};

export const generateFilter = (filmCards) => {
  return Object.entries(filmCardsToFilterMap).map(([filterName, countCards]) => {

    const cardsAmount = countCards(filmCards);

    return {
      filterName,
      cardsAmount,
    };

  });

};
