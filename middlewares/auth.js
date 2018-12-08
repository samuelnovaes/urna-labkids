module.exports = (req, res, next) => {
	if (req.headers['password'] == process.env.PASSWORD) {
		next()
	}
	else {
		res.sendStatus(401)
	}
}