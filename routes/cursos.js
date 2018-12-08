const router = require('express').Router()
const db = require('../db')
const auth = require('../middlewares/auth')

router.get('/', (req, res) => {
	db.models.cursos.findAll({
		order: [['id', 'DESC']],
		include: [
			{
				model: db.models.alunos,
				as: 'alunos'
			}
		]
	})
		.then(data => {
			res.json(data)
		})
		.catch(err => {
			res.status(500).send(err.message)
		})
})

router.post('/', auth, (req, res) => {
	db.models.cursos.create({ nome: req.body.nome })
		.then(data => {
			res.json(data)
		})
		.catch(err => {
			res.status(400).send(err.message)
		})
})

router.put('/:id', auth, (req, res) => {
	const id = req.params.id
	db.models.cursos.update({ nome: req.body.nome }, { where: { id } })
		.then(data => {
			res.json(data)
		})
		.catch(err => {
			res.status(400).send(err.message)
		})
})

router.delete('/:id', auth, (req, res) => {
	const id = req.params.id
	db.models.cursos.destroy({ where: { id } })
		.then(data => {
			res.json(data)
		})
		.catch(err => {
			res.status(500).send(err.message)
		})
})

module.exports = router