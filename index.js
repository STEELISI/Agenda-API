require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const makeDir = require('make-dir');
const nliPath = process.env.NLI_PATH + '';
const nluPath = process.env.NLU_PATH + '';

async function doCreateTrainingFiles(triggers){
// in NLI_PATH folder, create $t.txt
// in NLU_PATH folder, create $t.txt, NOT$t.txt
  console.log(triggers);

  console.log(nliPath);
  console.log(nluPath);

  await makeDir(nliPath);
  await makeDir(nluPath);
}

function createTrainingFiles(t){
  doCreateTrainingFiles(t).then((result) => {});
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
