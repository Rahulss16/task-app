const express = require('express')
const bodyParser = require('body-parser')
const InitiateMongoServer = require('./config/db')

// Initiate Mongo Server
InitiateMongoServer()

const app = express()

// PORT
const PORT = process.env.PORT || 1997

// Middleware
// app.use(bodyParser.json())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'API Working' })
})
app.use(function (req, res, next) {
  //Enabling CORS
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization'
  )
  next()
})

app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`)
})
