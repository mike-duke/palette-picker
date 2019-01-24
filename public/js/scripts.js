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
  document.querySelector('.project-container').prepend(card);
}

const fetchProjects = () => {
  fetch('/api/v1/projects')
    .then(response => response.json())
    .then(projects => projects.forEach((project) => {
      prependProjectCard(project);
    }))
    .catch(error => console.log(error));
}

const handleLock = (event) => {
  event.target.classList.toggle('locked');
}

const saveProject = (event) => {
  event.preventDefault();
  const projectName = document.querySelector('.new-project-input').value;
  fetch('/api/v1/projects', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({name: projectName})
  })
    .then(response => fetchProjects());
}

const savePalette = (event) => {
  event.preventDefault();
  const paletteName = document.querySelector('.new-palette-input').value;
  const colors = [];
  document.querySelectorAll('.hexcode').forEach((element) => {
    colors.push(element.innerText);
  });
  const projectName = document.querySelector('#project-select').value;
  fetch('/api/v1/palettes', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: paletteName,
      colors,
      projectName
    })
  })
    .then(response => console.log(response))
}

const populateOptions = () => {
  fetch('/api/v1/projects')
    .then(response => response.json())
    .then(projects => projects.forEach((project) => {
      const option = document.createElement('option');
      option.setAttribute('value', project.name);
      option.setAttribute('data-id', project.id);
      option.innerText = project.name;
      document.querySelector('#project-select').append(option);
    }))
}

fetchProjects();
populateOptions();

document.querySelector('.new-palette').addEventListener('click', handleNewPalette);
document.querySelectorAll('.lock-button').forEach((button) => {
  button.addEventListener('click', handleLock);
});
document.querySelector('.new-project-button').addEventListener('click', saveProject);
document.querySelector('.new-palette-button').addEventListener('click', savePalette);