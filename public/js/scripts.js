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
  fetchPalettes(project.id)
    .then(palettes => {
      if (typeof palettes === "string") {
        palettes = []
      }

      const card = document.createElement('article');
      card.classList.add('project-card');
      const paletteCards = palettes.map((palette) => {
        return (`
          <div class="palette-card">
            <p>${palette.name}</p>
            <div class="palette" style="background: ${palette.color1}"></div>
            <div class="palette" style="background: ${palette.color2}"></div>
            <div class="palette" style="background: ${palette.color3}"></div>
            <div class="palette" style="background: ${palette.color4}"></div>
            <div class="palette" style="background: ${palette.color5}"></div>
            <button class="delete-palette-button">X</button>
          </div>
        `)
      });
      
      card.innerHTML = `
      <h3>${project.name}</h3>
      ${paletteCards}
      <hr>`
      
      document.querySelector('.project-container').append(card);
  });
}

const fetchProjects = () => {
  fetch('/api/v1/projects')
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        return response = {projects: []}
      }
    })
    .then(results => {
      results.projects.forEach((project) => {
        prependProjectCard(project);
      })
      document.querySelector('.new-project-input').value = ''
    })
    .catch(error => console.log(error));
}

const fetchPalettes = (projectId) => {
  return fetch(`/api/v1/projects/${projectId}/palettes`)
    .then(response => response.json())
    .then(results => results.palettes)
    .catch(error => {return []})
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
    .then(() => {
      const cards = document.querySelectorAll('.project-card');
      const options = document.querySelectorAll('option');
      cards.forEach(card => card.remove());
      options.forEach(option => option.remove());
      fetchProjects();
      populateOptions();
    });
}

const savePalette = (event) => {
  event.preventDefault();
  const name = document.querySelector('.new-palette-input').value;
  const colors = [];
  document.querySelectorAll('.hexcode').forEach((element) => {
    colors.push(element.innerText);
  });
  const project_id = document.querySelector('#project-select').value;

  fetch('/api/v1/palettes', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      color1: colors[0],
      color2: colors[1],
      color3: colors[2],
      color4: colors[3],
      color5: colors[4],
      project_id
    })
  })
    .then(response => {
      const cards = document.querySelectorAll('.project-card');
      cards.forEach(card => card.remove());
      fetchProjects();
    })
}

const populateOptions = () => {
  fetch('/api/v1/projects')
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        return response = {projects: []}
      }
    })
    .then(results => {
      const select = document.querySelector('#project-select');
      const option = document.createElement('option');
      option.innerText = 'Select a project';
      select.append(option);

      results.projects.forEach((project) => {
        const option = document.createElement('option');
        option.setAttribute('value', project.id);
        option.innerText = project.name;
        select.append(option);    
      })
      document.querySelector('.new-palette-input').value = '';
    })
}

fetchProjects();
populateOptions();

document.querySelector('.new-palette').addEventListener('click', handleNewPalette);
document.querySelectorAll('.lock-button').forEach((button) => {
  button.addEventListener('click', handleLock);
});
document.querySelector('.new-project-button').addEventListener('click', saveProject);
document.querySelector('.new-palette-button').addEventListener('click', savePalette);