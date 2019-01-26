const express = require('express');
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const app = express();
app.use(bodyParser.json());

app.set('port', process.env.POST || 3000);
app.locals.title = 'Palette Picker';

app.use(express.static('public'));

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then((projects) => {
      response.status(200).json(projects)
    })
    .catch((error) => {
      response.status(500).json({error});
    })
  // sad path: there are no projects?
});

app.get('/api/v1/palettes', (request, response) => {
  database('palettes').select()
    .then((palettes) => {
      response.status(200).json(palettes);
    })
    .catch((error) => {
      response.status(500).json({error});
    })
});

app.get('/api/v1/palettes/:id', (request, response) => {
  const id = parseInt(request.params.id);
  database('palettes').where('id', id)
    .then((palette) => {
      response.status(200).json({palette})
    })
    .catch((error) => {
      response.status(500).json({error})
    })
});

app.get('/api/v1/projects/:id', (request, response) => {
  const id = parseInt(request.params.id);
  database('projects').where('id', id)
    .then((project) => {
      response.status(200).json({project})
    })
    .catch((error) => {
      response.status(500).json({error})
    })

    // sad path: how to deal with projects that have no palettes?
});

app.post('/api/v1/projects', (request, response) => {
  const { body } = request;
  database('projects').insert(body, 'id')
    .then((body) => {
      response.status(201).json({id: body[0]});
    })
    .catch((error) => {
      response.status(500).json({error})
    })
  // sad path: project name aready exists, bad body: 422
});

app.post('/api/v1/palettes', (request, response) => {
  const { body } = request;
  database('palettes').insert(body, 'id')
    .then((body) => {
      response.status(201).json({id: body[0]});
    })
    .catch((error) => {
      response.status(500).json({error})
    })
  // sad path: palette name already exists
  // sad path: check the project_id and project name to see if a palette already exists for that project
});

app.delete('/api/v1/palettes/:id/', (request, response) => {
  const id = parseInt(request.params.id);
  database('palettes').where('id', id).del()
    .then(() => {
      response.sendStatus(200);
    })
  // sad path: id not found
});

app.listen(app.get('port'), () => {
  console.log(app.locals.title + ' is running on port ' + app.get('port'));
});