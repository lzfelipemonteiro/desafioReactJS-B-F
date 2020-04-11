const express = require('express')
const cors = require('cors')
const { uuid, isUuid } = require('uuidv4')

const app = express()
app.use(cors())
app.use(express.json())

const projects = []

function logRequest(req, res, next){
  const { method, url } = req

  const logLabel = `[${method.toUpperCase()}] ${url}`

  console.time(logLabel)

  next()

  console.timeEnd(logLabel)
}

function validateProjectId(req, res, next) {
  const { id } = req.params

  if(!isUuid(id)) {
    return res.status(400).json({ erro: "Invalidad Project Id"})
  }

  return next()
}

app.use(logRequest)
app.use('/projects/:id', validateProjectId)

app.get('/projects', (req, res) => {
  const { title } = req.query

  const results = title
    ? projects.filter(project => project.title.includes(title))
    : projects

  // console.log(title)
  // console.log(owner)

  return res.json(results)
})

app.post('/projects', (req, res) => {
  const { title, owner } = req.body

  const project = { id: uuid(), title, owner }

  projects.push(project)

  return res.json(project)
})

app.put('/projects/:id', (req, res) => {
  const { id } = req.params
  const { title, owner } = req.body

  const projectIdenx = projects.findIndex(project => project.id === id)
  
  if  (projectIdenx < 0) {
    return res.status(400).json({ error: 'Project not found.'})
  }

  const project = {
    id,
    title,
    owner
  }

  projects[projectIdenx] = project

  return res.json(project)
})

app.delete('/projects/:id', (req, res) => {
  const { id } = req.params

  const projectIdenx = projects.findIndex(project => project.id === id)
  
  if  (projectIdenx < 0) {
    return res.status(400).json({ error: 'Project not found.'})
  }

  projects.splice(projectIdenx, 1)

  return res.status(204).send()
})

app.listen(3333, () => {
  console.log('🚀 Back-end Started')
})