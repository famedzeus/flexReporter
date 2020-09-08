const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')

const app = express()

// Enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "DELETE, GET, POST, PUT, OPTIONS")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})
app.use(bodyParser.json())

const baseUri = '/vehicle-scheduling/api/v1/'

const start = (new Date()).getTime()

const task = {
  state: "RUNNING",
  modelContexts: '[ null]',
  progress: 100,
  taskId: '2',
  percentComplete: 50,
  name: 'Some task',
  started: (new Date()).toISOString(),
  cancelled: false
}

app.get(baseUri + 'tasks', (req, res) => {
  const now = (new Date()).getTime()
  const diff = now - start
  if (diff > 20000 && diff < 40000) {
    return setTimeout(() => res.send(503, 'gfdfg 89huihb  jhkg'), 2200)
  }

  if (diff > 60000 && diff < 70000) {
    return setTimeout(() => res.send(204, 'gfdfg 89huihb  jhkg'), 2200)
  }

  if (diff > 100000 && diff < 110000) {
    return setTimeout(() => res.send(200, 'test test'), 2200)
  }

  task.progress = diff
  return setTimeout(() => res.send(200, [task]), 30)
})

const port = 8090
app.listen(port, () =>
  console.log(`Mock server up & running on ${port}`)
)