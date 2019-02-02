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
      card.setAttribute('data-id', project.id)
      const paletteCards = palettes.map((palette) => {
        return (`
          <div class="palette-card" data-id=${palette.id}>
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
      
      card.innerHTML = (`
      <h3>${project.name}</h3>
      ${paletteCards}
      <hr>`);
      
      document.querySelector('.project-container').append(card);
  });
}

const fetchProjects = () => {
  return fetch('/api/v1/projects')
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        return response = {projects: []}
      }
    })
    .then(results => results.projects)
    .catch(error => console.log(error));
}

const fetchPalettes = (projectId) => {
  return fetch(`/api/v1/projects/${projectId}/palettes`)
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        return response = {palettes: []}
      }
    })
    .then(results => results.palettes)
    .catch(error => {
      console.log(error)
      return []
    })
}

const getAllProjects = () => {
  fetchProjects()
    .then(projects => {
      const sortedProjects = projects.sort((projectA, projectB) => {
        return projectB.id - projectA.id
    });
  
    sortedProjects.forEach((project) => {
      prependProjectCard(project);
    });
  });
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
      getAllProjects();
      populateOptions();
      document.querySelector('.new-project-input').value = '';
      document.querySelector('.new-project-button').disabled = true;
    });
}

const savePalette = (event) => {
  event.preventDefault();
  const name = document.querySelector('.new-palette-input').value;
  const colors = [];
  document.querySelectorAll('.hexcode').forEach((element) => {
    colors.push(element.innerText);
    // element.innerText = '#808080'
  });
  const project_id = document.querySelector('#project-select').value;
  // document.querySelectorAll('.color-box').forEach((box) => {
  //   box.style.background = '#808080'
  // })

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
      getAllProjects();
      document.querySelector('.new-palette-input').value = '';
      document.querySelector('.new-palette-button').disabled = true;
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
    })
}

const handleProjectClick = (event) => {
  if(event.target.classList.contains('delete-palette-button')) {
    const { id } = event.target.closest('.palette-card').dataset
    fetch(`/api/v1/palettes/${id}`, {
      method: 'DELETE'
    })
    .then(() => {
      const cards = document.querySelectorAll('.project-card');
      const options = document.querySelectorAll('option');
      cards.forEach(card => card.remove());
      options.forEach(option => option.remove());
      getAllProjects();
      populateOptions();
    })
  }
}

const handleButtonDisabled = (event) => {
  const button = event.target.nextSibling.nextSibling
  if (event.target.value.length) {
    button.disabled = false;
  } else {
    button.disabled = true;
  }
}

getAllProjects();
populateOptions();
document.querySelector('.new-palette-input').focus();
document.querySelector('.new-palette-button').disabled = true;
document.querySelector('.new-project-button').disabled = true;

document.querySelector('.new-palette').addEventListener('click', handleNewPalette);
document.querySelectorAll('.lock-button').forEach((button) => {
  button.addEventListener('click', handleLock);
});
document.querySelector('.new-project-button').addEventListener('click', saveProject);
document.querySelector('.new-palette-button').addEventListener('click', savePalette);

document.querySelector('.project-container').addEventListener('click', handleProjectClick);
document.querySelectorAll('input').forEach((input) => {
  input.addEventListener('keyup', handleButtonDisabled);
})