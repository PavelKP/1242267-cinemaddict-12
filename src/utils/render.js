// Render a template in certain block
const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

// Render DOM element
const render = (container, element, place) => {
  container.insertAdjacentElement(place, element);
};

// 1. создаём пустой div-блок
// 2. берём HTML в виде строки и вкладываем в этот div-блок, превращая в DOM-элемент
// 3. возвращаем этот DOM-элемент
const createElement = (template) => {
  const newElement = document.createElement(`div`); // 1
  newElement.innerHTML = template; // 2

  return newElement.firstChild; // 3
};
// HTML в строке должен иметь общую обёртку,
// то есть быть чем-то вроде <nav><a>Link 1</a><a>Link 2</a></nav>,
// а не просто <a>Link 1</a><a>Link 2</a>

export {renderTemplate, render, createElement};
