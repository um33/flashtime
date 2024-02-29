const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const path = require('path')
const cors = require('cors')
const history = require('connect-history-api-fallback')
require('dotenv').config()

const userRoutes = require('./controller/users')
const authController = require('./controller/authentication')
const { deckController, deckSearch } = require('./controller/decks')
const {
  collectionController,
  collectionSearch,
} = require('./controller/collections')
const cardController = require('./controller/cards')

// Variables
const mongoURI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/flashCardAppDB'
const port = process.env.PORT || 3000

// Connect to MongoDB
mongoose.connect(
  mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err) {
    if (err) {
      console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`)
      console.error(err.stack)
      process.exit(1)
    }
    console.log(`Connected to MongoDB with URI: ${mongoURI}`)
  }
)

// Create Express app
const app = express()
const cookieParser = require('cookie-parser')
const trim = require('./middlewares/trim')
const verifyToken = require('./middlewares/verifyToken')
// Parse requests of content-type 'application/json'
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
// HTTP request logger
app.use(morgan('dev'))
// Enable cross-origin resource sharing for frontend must be registered before api
// Note: in order for the refresh token cookie to be set properly, the domain must not be a wildcard (*)
// hence the origin has been set to the default vue port
app.options('http://localhost:8080', cors())
app.use(cors({ credentials: true, origin: 'http://localhost:8080' }))

// Trim all strings in request body
app.use(trim)

// Import routes
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/auth', authController)
app.use('/api/v1/decks', deckController)
app.use('/api/v1/collections', collectionController)
app.use('/api/v1/cards', cardController)

app.get('/api/', function (req, res) {
  res.json({ message: 'Welcome to your DIT342 backend ExpressJS project!' })
})

app.get('/api/v1/search', verifyToken, async (req, res) => {
  try {
    const { query } = req.query
    const decks = await deckSearch(req, query)
    const collections = await collectionSearch(req, query)
    res.json({ decks, collections })
  } catch (err) {
    res.sendStatus(500)
  }
})

// Catch all non-error handler for api (i.e., 404 Not Found)
app.use('/api/*', function (req, res) {
  res.status(404).json({ message: 'Not Found' })
})

// Configuration for serving frontend in production mode
// Support Vuejs HTML 5 history mode
app.use(history())
// Serve static assets
const root = path.normalize(__dirname + '/..')
const client = path.join(root, 'client', 'dist')
app.use(express.static(client))

// Error handler (i.e., when exception is thrown) must be registered last
const env = app.get('env')
// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
  console.error(err.stack)
  const err_res = {
    message: err.message,
    error: {},
  }
  if (env === 'development') {
    // Return sensitive stack trace only in dev mode
    err_res['error'] = err.stack
  }
  res.status(err.status || 500)
  res.json(err_res)
})

app.listen(port, function (err) {
  if (err) throw err
  console.log(`Express server listening on port ${port}, in ${env} mode`)
  console.log(`Backend: http://localhost:${port}/api/`)
  console.log(`Frontend (production): http://localhost:${port}/`)
})

module.exports = app
