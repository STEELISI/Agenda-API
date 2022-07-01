require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;

function createTrainingFiles(triggers){
// in NLI_PATH folder, create $t.txt
// in NLU_PATH folder, create $t.txt, NOT$t.txt
  console.log(triggers);
  console.log(process.env.NLI_PATH);
  console.log(process.env.NLU_PATH);
}

app.get('/', (req, res) => {
  res.send('Agenda-Express API Running.');
});

app.post('/', (req, res) => {
  const triggers=req.header('TRIGGERS');
  console.log('TRIGGERS: ' + triggers);
  createTrainingFiles(triggers.split(','));
  res.end('SUCCESS');
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
