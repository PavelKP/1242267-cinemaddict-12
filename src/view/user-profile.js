export const createUserProfileTemplate = (filmCards, userProfileData) => {
  // Cards with watched flag
  const watchedFilmsAmount = filmCards.filter((el) => el.isWatched).length;

  // Count user profile grade
  const userGrade = Object.entries(userProfileData).filter((grade) => {
    return watchedFilmsAmount >= grade[1].min && watchedFilmsAmount <= grade[1].max;
  });

  // User profile grade name
  const userGradeName = userGrade[0][0];

  return (
    `<section class="header__profile profile">
    <p class="profile__rating">${userGradeName}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
  );
};
