// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
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

// Extract random elements from array (amount = quantity of extracted elements)
const getRandomElementsFromArray = (array, amount) => {
  array = array.slice(); // Make copy of the array
  const resultArray = []; // Create empty array

  // Iterate "amount" times
  // Cut element from the array
  // Spread element
  // Push in the result array
  for (let i = 0; i < amount; i++) {
    resultArray.push(...array.splice(getRandomInteger(0, array.length - 1), 1));
  }

  return resultArray;
};

// Get random element from array
const getRandomFromArray = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);
  return array[randomIndex];
};

// Date.now() и Math.random() - плохие решения для генерации id
// в "продуктовом" коде, а для моков самое то.
// Для "продуктового" кода используйте что-то понадежнее,
// вроде nanoid - https://github.com/ai/nanoid
const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

export {getRandomInteger, generateTextFromArray, getRandomElementsFromArray, getRandomFromArray, generateId};
