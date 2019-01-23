const generateColor = () => {
  let color = '#'
  const hexCode = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'a', 'b', 'c', 'd', 'e', 'f'];
  for(let i = 0; i < 6; i++) {
    let randomIndex = Math.floor(Math.random() * hexCode.length);
    let newValue = hexCode[randomIndex];
    color += newValue;
  }
  return color;
}

const handleNewPalette = (event) => {
  const boxes = document.querySelectorAll('.color-box');
  const hexes = document.querySelectorAll('.hexcode');
  boxes.forEach((box, i) => {
    if(!box.nextSibling.nextSibling.classList.contains('locked')) {
      const color = generateColor();
      box.style.background = color;
      hexes[i].innerText = color;
    }
  });
}

const prependProjectCard = (project) => {
  const card = document.createElement('article');
  
  card.innerHTML = `
    <article class="project-card">
      <h3>${project.name}</h3>
    </article>
  `
  document.querySelector('.project-section').prepend(card);
}

const fetchProjects = () => {
  fetch('/api/v1/projects')
    .then((response) => response.json())
    .then((projects) => projects.forEach((project) => {
      prependProjectCard(project);
    }))
    .catch((error) => console.log(error));
}

const handleLock = (event) => {
  event.target.classList.toggle('locked');
}

fetchProjects();

document.querySelector('.new-palette').addEventListener('click', handleNewPalette);
document.querySelectorAll('.lock-button').forEach((button) => {
  button.addEventListener('click', handleLock);
});