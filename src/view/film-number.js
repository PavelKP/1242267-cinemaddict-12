export const createFilmNumberTemplate = (filmCards) => {
  const filmsTotal = filmCards.length;

  return (
    `<p>${filmsTotal} movies inside</p>`
  );
};
