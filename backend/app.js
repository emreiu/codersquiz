const fs = require('fs');
const { join } = require('path');
const express = require('express');
const cors = require('cors');

const datapath = join(__dirname, 'data');
const staticpath = join(__dirname, 'public');
const entities = [];
const initialContent = '{"lastInsertId": 0, "data": []}';

fs.readdir(datapath, (er, files) => {
  if (er) return console.log(er);
  files.forEach(file => entities.push(file.split('.')[0]));
});

const app = express()
  .use(express.json())
  .use(cors())
  .use(express.static(staticpath));

app.get('/', (req, res) => {
  res.send('works');
});

app.use('/api/:entity', (req, res, next) => {
  if (entities.indexOf(req.params.entity) === -1) {
    fs.writeFile(join(datapath, `${req.params.entity}.json`), initialContent, (er) => {
      if (er) return res.status(500).send({ msg: 'Entity could not be created' });
      entities.push(req.params.entity);
      next();
    });
  } else {
    next();
  }
});

app.get('/api/:entity', (req, res) => {
  fs.readFile(join(datapath, `${req.params.entity}.json`), 'utf-8', (er, fileContent) => {
    if (er) return res.status(500).send({ msg: 'Data could not be read' });
    res.send(JSON.parse(fileContent).data);
  });
});

app.get('/api/:entity/:id', (req, res) => {
  fs.readFile(join(datapath, `${req.params.entity}.json`), 'utf-8', (er, data) => {
    if (er) return res.status(500).send({ msg: 'Data could not be read' });
    const fileContent = JSON.parse(data);
    const item = fileContent.data.find(item => item.id === req.params.id);
    item ? res.send(item) : res.sendStatus(404);
  });
});

app.post('/api/:entity', (req, res) => {
  fs.readFile(join(datapath, `${req.params.entity}.json`), 'utf-8', (er, data) => {
    if (er) return res.status(500).send({ msg: 'Data could not be read' });
    const fileContent = JSON.parse(data);
    fileContent.data.push(req.body);
    fs.writeFile(join(datapath, `${req.params.entity}.json`), JSON.stringify(fileContent), (er) => {
      if (er) return res.status(500).send({ msg: 'Data could not be written' });
      res.status(201).send(req.body);
    });
  });
});

app.put('/api/:entity/:id', (req, res) => {
  fs.readFile(join(datapath, `${req.params.entity}.json`), 'utf-8', (er, data) => {
    if (er) return res.status(500).send({ msg: 'Data could not be read' });
    const fileContent = JSON.parse(data);
    const dataIndex = fileContent.data.findIndex(item => item.id === req.params.id);
    if (dataIndex === -1) return res.sendStatus(404);
    for (let prop in fileContent.data[dataIndex]) {
      if (req.body[prop] !== undefined) fileContent.data[dataIndex][prop] = req.body[prop];
    }
    fs.writeFile(join(datapath, `${req.params.entity}.json`), JSON.stringify(fileContent), (er) => {
      if (er) return res.status(500).send({ msg: 'Data could not be written' });
      res.send(fileContent.data[dataIndex]);
    });
  });
});

app.delete('/api/:entity/all', (req, res) => {
  fs.readFile(join(datapath, `${req.params.entity}.json`), 'utf-8', (er, data) => {
    if (er) return res.status(500).send({ msg: 'Data could not be read' });
    const fileContent = JSON.parse(data);
    fileContent.data.length = 0;
    fs.writeFile(join(datapath, `${req.params.entity}.json`), JSON.stringify(fileContent), (er) => {
      if (er) return res.status(500).send({ msg: 'Data could not be written' });
      res.sendStatus(204);
    });
  });
});

app.delete('/api/:entity/some', (req, res) => {
  if (req.body.length < 1) res.sendStatus(404);
  fs.readFile(join(datapath, `${req.params.entity}.json`), 'utf-8', (er, data) => {
    if (er) return res.status(500).send({ msg: 'Data could not be read' });
    const fileContent = JSON.parse(data);
    req.body.forEach(id => {
      fileContent.data.splice(fileContent.data.findIndex(item => item.id === parseInt(id)), 1);
    });
    fs.writeFile(join(datapath, `${req.params.entity}.json`), JSON.stringify(fileContent), (er) => {
      if (er) return res.status(500).send({ msg: 'Data could not be written' });
      res.sendStatus(204);
    });
  });
});

app.delete('/api/:entity/:id', (req, res) => {
  fs.readFile(join(datapath, `${req.params.entity}.json`), 'utf-8', (er, data) => {
    if (er) return res.status(500).send({ msg: 'Data could not be read' });
    const fileContent = JSON.parse(data);
    const dataIndex = fileContent.data.findIndex(item => item.id === req.params.id);
    if (dataIndex === -1) return res.sendStatus(404);
    fileContent.data.splice(dataIndex, 1);
    fs.writeFile(join(datapath, `${req.params.entity}.json`), JSON.stringify(fileContent), (er) => {
      if (er) return res.status(500).send({ msg: 'Data could not be written' });
      res.sendStatus(204);
    });
  });
});

// Change 3000 to your desired port
app.listen(3000, () => console.log('Server running on Port 3000\nPress Ctrl+C to quit'));
