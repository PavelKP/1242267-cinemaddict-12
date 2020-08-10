// Render a template in certain block
const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

// Convert date to format YYYY/MM/DD hh:mm
const humanizeCommentDate = (dateObject) => {
  const time = dateObject.toLocaleString(`en-GB`, {hour: `2-digit`, minute: `2-digit`});
  const year = dateObject.getFullYear();
  const month = dateObject.toLocaleString(`en-GB`, {month: `2-digit`});
  const day = dateObject.toLocaleString(`en-GB`, {day: `2-digit`});

  return `${year}/${month}/${day} ${time}`;
};

// Convert date to format DD mounth year
const humanizeReleaseDate = (dateObject) => {
  const day = dateObject.toLocaleString(`en-GB`, {day: `2-digit`});
  const month = dateObject.toLocaleString(`en-GB`, {month: `long`});
  const year = dateObject.getFullYear();

  return `${day} ${month} ${year}`;
};

// Convert date to year only
const humanizeYear = (dateObject) => {
  return dateObject.getFullYear();
};

// Remove extension
const removeExtension = (string) => {
  // Dot, any symbol one ore more times, end of word
  // Brackets are necessary
  return string.replace(/\.(.+)$/g, ``);
};

export {render, humanizeCommentDate, humanizeReleaseDate, humanizeYear, removeExtension};
