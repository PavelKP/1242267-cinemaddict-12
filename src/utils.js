// Render a template in certain block
const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

export {render};
