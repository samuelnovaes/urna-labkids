const router = require('express').Router()

router.post('/', (req, res) => {
	if (req.body.password == process.env.PASSWORD) res.sendStatus(200)
	else res.sendStatus(401)
})

module.exports = router