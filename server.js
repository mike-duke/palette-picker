const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

app.set('port', process.env.POST || 3000);
app.locals.title = 'Palette Picker';

app.use(express.static('public'));

app.locals.projects = [
  {
    id: 1, 
    name: 'Gov.biz'
  },
  {
    id: 2,
    name: 'Biz.gov'
  },
  {
    id: 3, 
    name: 'Place.org'
  },
  {
    id: 4,
    name: 'Org.com'
  }
]

app.locals.palettes = [
  {
    id: 1,
    name: 'Autumn Flowers',
    project_id: 3
  },
  {
    id: 2,
    name: 'Daisy Mist',
    project_id: 4
  },
  {
    id: 3,
    name: 'Spring Insurgent',
    project_id: 2
  },
  {
    id: 4,
    name: 'Dark Mode',
    project_id: 2
  }
]

app.get('/api/v1/projects', (request, response) => {
  const { projects } = app.locals;
  response.status(200).json(projects)
  // sad path: there are no projects?
});

app.get('/api/v1/palettes', (request, response) => {
  const { palettes } = app.locals;
  response.status(200).json(palettes);
});

app.get('/api/v1/palettes/:id', (request, response) => {
  const id = parseInt(request.params.id);
  const foundPalette = app.locals.palettes.find((palette) => {
    return palette.id === id;
  });

  if (foundPalette) {
    response.status(200).json(foundPalette);
  } else {
    response.sendStatus(404)
  }
});

app.get('/api/v1/projects/:id', (request, response) => {
  const id = parseInt(request.params.id);
  const foundProject = app.locals.projects.find((project) => {
    return project.id === id;
  });
  const filteredPalettes = app.locals.palettes.filter((palette) => {
    return palette.project_id === id;
  });

  if(!foundProject) {
    response.status(404).send('Project ID not found');
  }
  
  if (filteredPalettes.length > 0) {
    response.status(200).json(filteredPalettes);
  } else {
    response.status(404).send('This project does not have any saved palettes');
  }
});

app.post('/api/v1/projects', (request, response) => {
  // assign the body of the request to a variable
  const id = Math.floor(Math.random() * 10);
  const { body } = request;
  // create SQL record with all data to the projects table
  app.locals.projects.push({...body, id});
  // make SQL query for the new id?
  // send the new id as a response with a status of 201
  response.status(201).send({id});
  // sad path: project name aready exists
});

app.post('/api/v1/palettes', (request, response) => {
  const id = Math.floor(Math.random() * 10);
  const { body } = request;
  // create SQL query with all record data to the palettes table
  app.locals.palettes.push({...body, id})
  // respond with the new id
  response.status(201).send({id});
  // sad path: palette name already exists
  // sad path: check the project_id and project name to see if a palette already exists for that project
});

app.delete('/api/v1/palettes/:id/', (request, response) => {
  const id = parseInt(request.params.id);
  // DELETE palette based on SQL query with id
  response.sendStatus(200);
  // sad path: id not found
});

app.listen(app.get('port'), () => {
  console.log(app.locals.title + ' is running on port ' + app.get('port'));
});