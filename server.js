const express = require('express');
const app = express();

app.set('port', process.env.POST || 3000);
app.locals.title = 'Palette Picker';

app.use(express.static('public'));

app.get('/api/v1/projects', (request, response) => {
  // set all projects to a variable
  // send all projects as a json response
  // sad path
});

app.get('/api/v1/projects/:id', (request, response) => {
  // parse id from the request params
  // find the project with the matching id
  // send the matching project as a json response
  // sad path
});

app.post('/api/v1/projects', (request, response) => {
  // create an id
  // assign the body of the request to a variable
  // push the new project into the database array
  // send the new id as a response with a status of 201
  // sad path
});

app.put('/api/v1/projects/:id', (request, response) => {
  // create an id for the palette
  // assign the body of the request to a variable
  // push the new palette into the palette array of the project with the matching project id
  // send the new id as a response with a status of 201(?)
  // sad path
});

app.delete('/api/v1/projects/:id/', (request, response) => {
  // parse the projectId
  // filter out the palette by the id on the request and reassign the new array to the project by the project id
  // return a status code of OK
  // sad path
});

app.listen(app.get('port'), () => {
  console.log(app.locals.title + ' is running on port ' + app.get('port'));
});