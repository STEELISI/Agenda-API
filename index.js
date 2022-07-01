const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Agenda-Express API Running.');
});

app.post('/', (req, res) => {
  const triggers=req.header('TRIGGERS');
  console.log('TRIGGERS: ' + triggers);
// TODO: create directories and files
  res.end('SUCCESS');
});


app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
