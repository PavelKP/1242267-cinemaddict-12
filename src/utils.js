// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

// Render a template in certain block
const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

// Convert date to format YYYY/MM/DD hh:mm
const formatCommentDate = (dateObject) => {
  const time = dateObject.toLocaleString(`en-GB`, {hour: `2-digit`, minute: `2-digit`});
  const year = dateObject.getFullYear();
  const month = dateObject.toLocaleString(`en-GB`, {month: `2-digit`});
  const day = dateObject.toLocaleString(`en-GB`, {day: `2-digit`});

  return `${year}/${month}/${day} ${time}`;
};

// Convert date to format DD mounth year
const formatReleaseDate = (dateObject) => {
  const day = dateObject.toLocaleString(`en-GB`, {day: `2-digit`});
  const month = dateObject.toLocaleString(`en-GB`, {month: `long`});
  const year = dateObject.getFullYear();

  return `${day} ${month} ${year}`;
};

// Convert date to year only
const formatYear = (dateObject) => {
  return dateObject.getFullYear();
};

// Remove extension
const removeExtension = (string) => {
  // Dot, any symbol one ore more times, end of word
  // Brackets are necessary
  return string.replace(/\.(.+)$/g, ``);
};

// Generate film descripion
const generateTextFromArray = (sentenceArray, arrayMinMaxAmount) => {
  const sentenceAmount = getRandomInteger(...arrayMinMaxAmount);
  let randomText = ``;

  for (let i = 0; i < sentenceAmount; i++) {
    randomText += sentenceArray[getRandomInteger(0, sentenceArray.length - 1)];
    randomText += (i < (sentenceAmount - 1)) ? ` ` : ``;
  }
  return randomText;
};

// Shorten string to limit -1
const shortenString = (string, limit) => {
  return (string.length > limit) ? `${string.slice(0, limit - 1).trim()}…` : string;
};


// Generate film duration
const convertMinutesToFilmLength = (durationInMinutes) => {

  const hours = Math.floor(durationInMinutes / 60);
  const hoursString = (hours === 0) ? `` : `${hours}h`;

  const minutes = durationInMinutes - (hours * 60);
  const minutesString = `${minutes}m`;

  return `${hoursString} ${minutesString}`;
};

export {getRandomInteger, render, formatCommentDate, formatReleaseDate, formatYear, removeExtension, generateTextFromArray, shortenString, convertMinutesToFilmLength};
