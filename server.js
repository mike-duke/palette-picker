const express = require('express');
const app = express();

app.set('port', process.env.POST || 3000);
app.locals.title = 'Palette Picker';

app.get('/', (request, response) => {
  response.send('Oh Hello');
});

app.listen(app.get('port'), () => {
  console.log(app.locals.title + 'is running on port ' + app.get('port'));
});