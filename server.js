const express = require('express');
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const app = express();
app.use(bodyParser.json());

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';

app.use(express.static('public'));

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then((projects) => {
      if (projects.length) {
        response.status(200).json({projects});
      } else {
        response.status(404).send('No projects stored');
      }
    })
    .catch(error => response.status(500).json({error}));
});

app.get('/api/v1/palettes', (request, response) => {
  database('palettes').select()
    .then((palettes) => {
      if (palettes.length) {
        response.status(200).json({palettes});
      } else {
        response.status(404).send('No palettes stored');
      }
    })
    .catch(error => response.status(500).json({error}));
});

app.get('/api/v1/palettes/:id', (request, response) => {
  const id = parseInt(request.params.id);
  database('palettes').where('id', id)
    .then((palette) => {
      if (Object.keys(palette).length) {
        response.status(200).json({palette})
      } else {
        response.status(404).send('No palettes match that id');
      }
    })
    .catch(error => response.status(500).json({error}));
});

app.get('/api/v1/projects/:id/palettes', (request, response) => {
  const id = parseInt(request.params.id);
  database('palettes').where('project_id', id)
    .then((palettes) => {
      if (palettes.length) {
        response.status(200).json({palettes})
      } else {
        response.status(404).send('Project has no palettes or id does not match');
      }
    })
    .catch(error => response.status(500).json({error}));
});

app.post('/api/v1/projects', (request, response) => {
  const { body } = request;
  if (Object.keys(body).length) {
    database('projects').select('name')
      .then((projectNames) => {
        const names = projectNames.map(project => project.name);

        if (names.includes(body.name)) {
          response.status(409).send('Please choose a unique project name');
        } else {
          database('projects').insert(body, 'id')
            .then(body => response.status(201).json({id: body[0]}))
        }
      })
      .catch(error => response.status(500).json({error}));
  } else {
    response.status(422).send('Please include project information');
  }
});

app.post('/api/v1/palettes', (request, response) => {
  const { body } = request;
  if (Object.keys(body).length) {
    database('palettes').select('name')
      .then((paletteNames) => {
        const names = paletteNames.map(palette => palette.name);

        if (names.includes(body.name)) {
          response.status(409).send('Please choose a unique palette name')
        } else {
          database('palettes').insert(body, 'id')
            .then(body => response.status(201).json({id: body[0]}))
        }
      })
      .catch(error => response.status(500).json({error}))
  } else {
    response.status(422).send('Please include palette information');
  }
});

app.delete('/api/v1/palettes/:id/', (request, response) => {
  const id = parseInt(request.params.id);
  database('palettes').select('id')
    .then((ids) => {
      const paletteIds = ids.map(id => id.id);

      if(paletteIds.includes(id)) {
        database('palettes').where('id', id).del()
          .then(() => response.status(200).send('Palette deleted'));
      } else {
        response.status(404).send('Id not found');
      }
    })
    .catch(error => response.status(500).json({error}))
});

app.listen(app.get('port'), () => {
  console.log(app.locals.title + ' is running on port ' + app.get('port'));
});