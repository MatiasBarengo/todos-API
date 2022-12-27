const express = require('express');
const path = require('path');
const fs = require('fs/promises');

const app = express();
app.use(express.json());

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`servidor escuchando en el puerto ${PORT}`);
})


const jsonPath = path.resolve('./file/tasks.json');

app.get('/tasks', async (req, res) => {
  const jsonFile = await fs.readFile(jsonPath, 'utf8');
  res.send(jsonFile);
});

app.post('/tasks', async (req, res) => {
  const task = req.body;
  const tasksArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
  const lastIndex = tasksArray.length - 1;
  const newId = tasksArray[lastIndex].id + 1;
  tasksArray.push({ ...task, id: newId });
  await fs.writeFile(jsonPath, JSON.stringify(tasksArray));
  res.end;
});

app.put('/tasks', async (req, res) => {
  const taskUpdated = req.body
  const tasksArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
  for (let i = 0; i < tasksArray.length; i++) {
    if (tasksArray[i].id === taskUpdated.id) {
      tasksArray.splice(i, 1, taskUpdated);
      const newJson = JSON.stringify(tasksArray);
      fs.writeFile(jsonPath, newJson);
    }
  }
  res.end();
});

app.delete('/tasks', async (req, res) => {
  const taskToDelete = req.body;
  const tasksArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
  for (let i = 0; i < tasksArray.length; i++) {
    if (tasksArray[i].id === taskToDelete.id) {
      tasksArray.splice(i, 1);
      const newJson = JSON.stringify(tasksArray);
      fs.writeFile(jsonPath, newJson);
    }
  }
  res.end()
});