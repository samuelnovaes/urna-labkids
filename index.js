require('dotenv').config()
const express = require('express')
const Bundler = require('parcel-bundler')
const path = require('path')
const bodyParser = require('body-parser')
const db = require('./db')

const app = express()
const port = 8080 || process.env.PORT
const bundler = new Bundler(path.join(__dirname, 'client', 'index.html'))
const router = express.Router()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

router.use('/alunos', require('./routes/alunos'))
router.use('/cursos', require('./routes/cursos'))
router.use('/auth', require('./routes/auth'))

app.use('/api', router)
app.use(bundler.middleware())

db.sync().then(() => {
	app.listen(port, () => {
		console.log(`\nRodando na porta ${port}`)
	})
}).catch(err => {
	console.error('Erro ao se concetar ao o banco de dados:', err.message)
})

