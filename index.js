require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const makeDir = require('make-dir');
const path = require('node:path');
const touch = require('touch');
const nliPath = process.env.NLI_PATH + '';
const nluPath = process.env.NLU_PATH + '';
const port = Number(process.env.PORT);

async function doCreateTrainingFiles(triggers){
// in NLI_PATH folder, create $t.txt
// in NLU_PATH folder, create $t.txt, NOT$t.txt
  console.log(triggers);

  console.log(nliPath);
  console.log(nluPath);

  await makeDir(nliPath);
  await makeDir(nluPath);

  for (let t in triggers) {
    touch.sync(path.join(nliPath, t + '.txt'));
    touch.sync(path.join(nluPath, t + '.txt'));
    touch.sync(path.join(nluPath, 'NOT' + t + '.txt'));
  }
}

function createTrainingFiles(t){
  doCreateTrainingFiles(t).then((result) => {});
}

app.use(cors());

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
