const Sequelize = require('sequelize')

const db = new Sequelize({
	dialect: 'sqlite',
	storage: 'db.sqlite',
	logging: false,
	operatorsAliases: false
})

const Alunos = db.define('alunos', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		unique: true,
		allowNull: false
	},
	nome: {
		type: Sequelize.STRING,
		allowNull: false
	},
	votos: {
		type: Sequelize.INTEGER,
		defaultValue: 0
	}
})

const Cursos = db.define('cursos', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		unique: true,
		allowNull: false
	},
	nome: {
		type: Sequelize.STRING,
		allowNull: false
	}
})

Alunos.belongsTo(Cursos, {
	as: 'curso',
	onDelete: 'cascade',
	foreignKey: {
		allowNull: false
	}
})


Cursos.hasMany(Alunos, { as: 'alunos' })


module.exports = db