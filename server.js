const express = require('express');
// import express node module
const bodyParser = require('body-parser');
// import body-parser node module to be able to read incoming data from request body
const environment = process.env.NODE_ENV || 'development';
// declare environment variable as either the current Node environment or default to development
const configuration = require('./knexfile')[environment];
// declare configuration variable and set its value to the object associated with the current environment
const database = require('knex')(configuration);
// declare database variable and assign it the value of the knex import that has been passed the current configuration based on the environment
const app = express();
// declare app variable and assign it the express node module
app.use(bodyParser.json());
// allows access to the body parser with json data

app.set('port', process.env.PORT || 3000);
// set the port of the server to either the current Node environment or default to 3000
app.locals.title = 'Palette Picker';
//set the title of the application locally

app.use(express.static('public'));
// serves the static website in the index.html file in the public directory while the server is running

app.get('/api/v1/projects', (request, response) => {
// declare first get endpoint for all of the projects
  database('projects').select()
// select all of the information in the projects table
    .then((projects) => {
// then take that project information and...
      if (projects.length) {
// if there are projects in the database
        response.status(200).json({projects});
// send a response to the client with the status of 200 and a body of project data in json format
      } else {
// otherwise...
        response.status(404).send('No projects stored');
// send a response of 404 and a message that no projects are stored
      }
    })
    .catch(error => response.status(500).json({error}));
// OR if there is an error, send a status of 500 with the error in json format
});

app.get('/api/v1/palettes', (request, response) => {
// declare the get endpoint for the all the palettes
  database('palettes').select()
// select all of the information in the palettes table
    .then((palettes) => {
// then take that palette information and ...
      if (palettes.length) {
// if there are palettes in the database
        response.status(200).json({palettes});
// send a response with the status of 200 and a body of palette information in json format
      } else {
//otherwise
        response.status(404).send('No palettes stored');
// send a status of 404 and a message that no palettes are stored
      }
    })
    .catch(error => response.status(500).json({error}));
// OR, if there is an error, send a status of 500 with the error message in json format
});

app.get('/api/v1/palettes/:id', (request, response) => {
// declare the get endpoint for a specific palette
  const id = parseInt(request.params.id);
// declare the variable id with a value of the id from the path of the request (which is a string) and parse it into a number
  database('palettes').where('id', id)
// select a record from the palettes table where the value of the id column matches the id variable
    .then((palette) => {
// then take that record and ....
      if (Object.keys(palette).length) {
// check if the record exists
        response.status(200).json({palette})
// and send a status of 200 with the record in json format
      } else {
// otherwise
        response.status(404).send('No palettes match that id');
// send a status of 404 and a message that there are no matching palettes
      }
    })
    .catch(error => response.status(500).json({error}));
// OR if there is an error, send a status of 500 with the error in json format
});

app.get('/api/v1/projects/:id/palettes', (request, response) => {
// declare the endpoint to get all of the palettes associated with a specific project
  const id = parseInt(request.params.id);
// declare the varaible id and parse the id from the request path
  database('palettes').where('project_id', id)
//select everything from the palette table where the project_id matches the id
    .then((palettes) => {
// then, take that data and ...
      if (palettes.length) {
// if there are palettes in the array
        response.status(200).json({palettes})
// send the status of 200 with the palettes in json format
      } else {
// otherwise 
        response.status(404).send('Project has no palettes or id does not match');
// send a status of 404 with the message that the project has no palettes or the id does not match
      }
    })
    .catch(error => response.status(500).json({error}));
// OR if there is an error, send a status of 500 and the error in json format
});

app.post('/api/v1/projects', (request, response) => {
// declare post endpoint for new projects
  const { body } = request;
// parse the body information out of the request
  if (Object.keys(body).length) {
// if the body has information in it
    database('projects').select('name')
// select the name column from the projects table
      .then((projectNames) => {
// then, take that array of project names
        const names = projectNames.map(project => project.name);
// and map over them to create an array of just the names and not individual objects

        if (names.includes(body.name)) {
// if the new array includes the new project name from the body
          response.status(409).send('Please choose a unique project name');
// send a status of 409 (conflict) with a message to choose another name
        } else {
// otherwise
          database('projects').insert(body, 'id')
// insert the body information into the projects database and assign it an id
            .then(body => response.status(201).json({id: body[0]}))
// then send a status of 201 with the new project's id
        }
      })
      .catch(error => response.status(500).json({error}));
// OR, if there is an error, send a status of 500 with the error in json format
  } else {
// otherwise, if the body does not include any information
    response.status(422).send('Please include project information');
// send a status of 422 (Unprocessable entity) with a message that there is no data
  }
});

app.post('/api/v1/palettes', (request, response) => {
// declare post endpoint for new palettes
  const { body } = request;
// parse the body out of the request object
  if (Object.keys(body).length) {
// if there is information in the body
    database('palettes').select('name')
// select the name column from the palettes table
      .then((paletteNames) => {
// then take that array of palette names
        const names = paletteNames.map(palette => palette.name);
// and map over them to create an array of just the names

        if (names.includes(body.name)) {
// if the name of the new palette is included in the array of names from the database
          response.status(409).send('Please choose a unique palette name')
// send a status of 409 (conflict) with a message to choose another palette name
        } else {
// otherwise
          database('palettes').insert(body, 'id')
// insert the body information into the palettes table and assign it an id
            .then(body => response.status(201).json({id: body[0]}))
// then send a status of 201 (created) and the new id in json format
        }
      })
      .catch(error => response.status(500).json({error}))
// OR, if there is an error, send a status of 500 with the error in json format
  } else {
// otherwise, if there is no information in the body of the request
    response.status(422).send('Please include palette information');
// send a status of 422 and a message to include the palette data
  }
});

app.delete('/api/v1/palettes/:id/', (request, response) => {
// declare the delete endpoint for an individual palette by the id
  const id = parseInt(request.params.id);
// parse the id from the request path
  database('palettes').select('id')
// select the id column from the palettes table
    .then((ids) => {
// then take that array of objects
      const paletteIds = ids.map(id => id.id);
// and map over the it to create a new array of just the ids

      if(paletteIds.includes(id)) {
// if the new array includes the id from the request
        database('palettes').where('id', id).del()
// delete (with del()) the record from the palettes table with the matching id
          .then(() => response.status(200).send('Palette deleted'));
// and send the status of 200 with a confirmation message
      } else {
// otherwise
        response.status(404).send('Id not found');
// send a status of 404 with a message that the id is not found
      }
    })
    .catch(error => response.status(500).json({error}))
// OR, if there is an error, send a status of 500 with the error in json format
});

app.listen(app.get('port'), () => {
// listen on whatever the current port is
  console.log(app.locals.title + ' is running on port ' + app.get('port'));
// and log a message that the server is running and what port it's on
});