const router = require('express').Router()
const db = require('../db')
const auth = require('../middlewares/auth')

router.get('/', (req, res) => {
	db.models.alunos.findAll({
		order: [['id', 'DESC']],
		include: [
			{
				model: db.models.cursos,
				as: 'curso'
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
	db.models.alunos.create({ nome: req.body.nome, cursoId: req.body.curso })
		.then(data => {
			res.json(data)
		})
		.catch(err => {
			res.status(400).send(err.message)
		})
})

router.put('/:id', auth, (req, res) => {
	const id = req.params.id
	db.models.alunos.update({ nome: req.body.nome, cursoId: req.body.curso }, { where: { id } })
		.then(data => {
			res.json(data)
		})
		.catch(err => {
			res.status(400).send(err.message)
		})
})

router.put('/:id/votos', (req, res) => {
	const id = req.params.id
	db.models.alunos.findById(id, { attributes: ['votos'] })
		.then(aluno => {
			db.models.alunos.update({ votos: aluno.votos + 1 }, { where: { id } })
				.then(data => {
					res.json(data)
				})
				.catch(err => {
					res.status(400).send(err.message)
				})
		})
		.catch(err => {
			res.status(500).send(err.message)
		})
})

router.delete('/:id', auth, (req, res) => {
	const id = req.params.id
	db.models.alunos.destroy({ where: { id } })
		.then(data => {
			res.json(data)
		})
		.catch(err => {
			res.status(500).send(err.message)
		})
})

module.exports = router