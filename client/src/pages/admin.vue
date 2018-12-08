<template>
	<div>
		<v-container v-if="!passwordDialog" grid-list-xl>
			<p>
				<router-link to="/">Página inicial</router-link>
			</p>
			<v-layout row wrap>
				<v-flex xs12>
					<v-card>
						<v-toolbar color="primary" dark>
							<v-toolbar-title>Alunos</v-toolbar-title>
						</v-toolbar>
						<v-data-table :headers="headersAlunos" :items="alunos">
							<template slot="items" slot-scope="props">
								<td>{{props.item.nome}}</td>
								<td>{{props.item.curso.nome}}</td>
								<td>{{props.item.votos}}</td>
								<td class="text-xs-right">
									<v-icon small @click="openEditAlunoDialog(props.item)">edit</v-icon>
									<v-icon small @click="deleteAluno(props.item)">delete</v-icon>
								</td>
							</template>
						</v-data-table>
						<v-card-actions>
							<v-btn color="primary" fab @click="addAlunoDialog = true">
								<v-icon>add</v-icon>
							</v-btn>
						</v-card-actions>
					</v-card>
				</v-flex>

				<v-flex xs12>
					<v-card>
						<v-toolbar color="primary" dark>
							<v-toolbar-title>Cursos</v-toolbar-title>
						</v-toolbar>
						<v-data-table :headers="headersCurso" :items="cursos">
							<template slot="items" slot-scope="props">
								<td>{{props.item.nome}}</td>
								<td class="text-xs-right">
									<v-icon small @click="openEditCursoDialog(props.item)">edit</v-icon>
									<v-icon small @click="deleteCurso(props.item)">delete</v-icon>
								</td>
							</template>
						</v-data-table>
						<v-card-actions>
							<v-btn color="primary" fab @click="addCursoDialog = true">
								<v-icon>add</v-icon>
							</v-btn>
						</v-card-actions>
					</v-card>
				</v-flex>
			</v-layout>
		</v-container>

		<v-dialog v-model="loading" max-width="290" persistent>
			<v-card>
				<v-container>
					<v-progress-linear indeterminate></v-progress-linear>
				</v-container>
			</v-card>
		</v-dialog>

		<v-dialog v-model="passwordDialog" max-width="290" persistent>
			<v-card>
				<v-container>
					<v-form ref="passwordForm" @submit.prevent="autenticar">
						<v-text-field label="Senha" v-model="password" type="password" :rules="[rules.required]"></v-text-field>
					</v-form>
				</v-container>
				<v-card-actions>
					<v-btn color="primary" @click="autenticar">Acessar</v-btn>
					<v-btn color="secondary" to="/">Cancelar</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog v-model="addCursoDialog" max-width="290" persistent>
			<v-card>
				<v-toolbar color="primary" dark>
					<v-toolbar-title>Adicionar curso</v-toolbar-title>
				</v-toolbar>
				<v-container>
					<v-form ref="addCursoForm" @submit.prevent="addCurso">
						<v-text-field label="Nome" v-model="addCursoNome" :rules="[rules.required]"></v-text-field>
					</v-form>
				</v-container>
				<v-card-actions>
					<v-btn color="primary" @click="addCurso">Salvar</v-btn>
					<v-btn color="secondary" @click="closeAddCursoDialog">Cancelar</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog v-model="addAlunoDialog" max-width="290" persistent>
			<v-card>
				<v-toolbar color="primary" dark>
					<v-toolbar-title>Adicionar aluno</v-toolbar-title>
				</v-toolbar>
				<v-container>
					<v-form ref="addAlunoForm" @submit.prevent="addAluno">
						<v-text-field label="Nome" v-model="addAlunoNome" :rules="[rules.required]"></v-text-field>
						<v-select
							label="Curso"
							:items="cursos"
							item-text="nome"
							item-value="id"
							v-model="addAlunoCurso"
							:rules="[rules.required]"
						></v-select>
					</v-form>
				</v-container>
				<v-card-actions>
					<v-btn color="primary" @click="addAluno">Salvar</v-btn>
					<v-btn color="secondary" @click="closeAddAlunoDialog">Cancelar</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog v-model="editCursoDialog" max-width="290" persistent>
			<v-card>
				<v-toolbar color="primary" dark>
					<v-toolbar-title>Editar curso</v-toolbar-title>
				</v-toolbar>
				<v-container>
					<v-form ref="editCursoForm" @submit.prevent="editCurso">
						<v-text-field label="Nome" v-model="editedCurso.nome" :rules="[rules.required]"></v-text-field>
					</v-form>
				</v-container>
				<v-card-actions>
					<v-btn color="primary" @click="editCurso">Salvar</v-btn>
					<v-btn color="secondary" @click="closeEditCursoDialog">Cancelar</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog v-model="editAlunoDialog" max-width="290" persistent>
			<v-card>
				<v-toolbar color="primary" dark>
					<v-toolbar-title>Editar aluno</v-toolbar-title>
				</v-toolbar>
				<v-container>
					<v-form ref="editAlunoForm" @submit.prevent="editAluno">
						<v-text-field label="Nome" v-model="editedAluno.nome" :rules="[rules.required]"></v-text-field>
						<v-select
							label="Curso"
							:items="cursos"
							item-text="nome"
							item-value="id"
							v-model="editedAluno.cursoId"
							:rules="[rules.required]"
						></v-select>
					</v-form>
				</v-container>
				<v-card-actions>
					<v-btn color="primary" @click="editAluno">Salvar</v-btn>
					<v-btn color="secondary" @click="closeEditAlunoDialog">Cancelar</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-snackbar v-model="error" color="error">
			{{errorMsg}}
			<v-btn icon dark @click="error = false">
				<v-icon>close</v-icon>
			</v-btn>
		</v-snackbar>
	</div>
</template>

<script>
import axios from 'axios'
export default {
	data() {
		return {
			password: '',
			passwordDialog: true,
			error: false,
			errorMsg: '',
			alunos: [],
			cursos: [],
			loading: false,
			addCursoDialog: false,
			addAlunoDialog: false,
			editCursoDialog: false,
			editAlunoDialog: false,
			editedCurso: {},
			editedAluno: {},
			addCursoNome: '',
			addAlunoNome: '',
			addAlunoCurso: null,
			headersCurso: [
				{ text: 'Nome', value: 'nome' },
				{ text: 'Ações', value: 'nome', sortable: false, align: 'right' }
			],
			headersAlunos: [
				{ text: 'Nome', value: 'nome' },
				{ text: 'Curso', value: 'curso' },
				{ text: 'Votos', value: 'votos'},
				{ text: 'Ações', value: 'nome', sortable: false, align: 'right' }
			],
			rules: {
				required: v => !!v || 'Campo obrigatório!'
			}
		}
	},
	methods: {
		autenticar() {
			if (this.$refs.passwordForm.validate()) {
				this.loading = true
				axios.post('/api/auth', { password: this.password })
					.then(() => {
						this.passwordDialog = false
						return axios.get('/api/alunos')
					})
					.then(response => {
						this.alunos = response.data
						return axios.get('/api/cursos')
					})
					.then(response => {
						this.cursos = response.data
					})
					.catch(err => {
						if (err.response.status == 401) this.errorMsg = 'Senha errada!'
						else this.errorMsg = err.response.data
						this.error = true
					})
					.finally(() => {
						this.loading = false
					})
			}
		},
		closeAddCursoDialog() {
			this.$refs.addCursoForm.reset()
			this.addCursoDialog = false
		},
		closeAddAlunoDialog() {
			this.$refs.addAlunoForm.reset()
			this.addAlunoDialog = false
		},
		closeEditCursoDialog() {
			this.$refs.editCursoForm.reset()
			this.editCursoDialog = false
		},
		closeEditAlunoDialog() {
			this.$refs.editAlunoForm.reset()
			this.editAlunoDialog = false
		},
		addCurso() {
			if (this.$refs.addCursoForm.validate()) {
				this.loading = true
				axios.post('/api/cursos', { nome: this.addCursoNome }, { headers: { password: this.password } })
					.then(response => {
						this.$refs.addCursoForm.reset()
						this.addCursoDialog = false
						return axios.get('/api/cursos')
					})
					.then(response => {
						this.cursos = response.data
					})
					.catch(err => {
						this.errorMsg = err.response.data
						this.error = true
					})
					.finally(() => {
						this.loading = false
					})
			}
		},
		addAluno() {
			if (this.$refs.addAlunoForm.validate()) {
				this.loading = true
				axios.post('/api/alunos', { nome: this.addAlunoNome, curso: this.addAlunoCurso }, { headers: { password: this.password } })
					.then(response => {
						this.$refs.addAlunoForm.reset()
						this.addAlunoDialog = false
						return axios.get('/api/alunos')
					})
					.then(response => {
						this.alunos = response.data
					})
					.catch(err => {
						this.errorMsg = err.response.data
						this.error = true
					})
					.finally(() => {
						this.loading = false
					})
			}
		},
		editCurso() {
			if (this.$refs.editCursoForm.validate()) {
				this.loading = true
				axios.put(`/api/cursos/${this.editedCurso.id}`, { nome: this.editedCurso.nome }, { headers: { password: this.password } })
					.then(response => {
						this.$refs.editCursoForm.reset()
						this.editCursoDialog = false
						return axios.get('/api/cursos')
					})
					.then(response => {
						this.cursos = response.data
						return axios.get('/api/alunos')
					})
					.then(response => {
						this.alunos = response.data
					})
					.catch(err => {
						this.errorMsg = err.response.data
						this.error = true
					})
					.finally(() => {
						this.loading = false
					})
			}
		},
		editAluno() {
			if (this.$refs.editAlunoForm.validate()) {
				this.loading = true
				axios.put(`/api/alunos/${this.editedAluno.id}`, { nome: this.editedAluno.nome, curso: this.editedAluno.cursoId }, { headers: { password: this.password } })
					.then(response => {
						this.$refs.editAlunoForm.reset()
						this.editAlunoDialog = false
						return axios.get('/api/alunos')
					})
					.then(response => {
						this.alunos = response.data
					})
					.catch(err => {
						this.errorMsg = err.response.data
						this.error = true
					})
					.finally(() => {
						this.loading = false
					})
			}
		},
		deleteCurso(item) {
			this.loading = true
			axios.delete(`/api/cursos/${item.id}`, { headers: { password: this.password } })
				.then(() => {
					return axios.get('/api/cursos')
				})
				.then(response => {
					this.cursos = response.data
					return axios.get('/api/alunos')
				})
				.then(response => {
					this.alunos = response.data
				})
				.catch(err => {
					this.errorMsg = err.response.data
					this.error = true
				})
				.finally(() => {
					this.loading = false
				})
		},
		deleteAluno(item) {
			this.loading = true
			axios.delete(`/api/alunos/${item.id}`, { headers: { password: this.password } })
				.then(() => {
					return axios.get('/api/alunos')
				})
				.then(response => {
					this.alunos = response.data
				})
				.catch(err => {
					this.errorMsg = err.response.data
					this.error = true
				})
				.finally(() => {
					this.loading = false
				})
		},
		openEditCursoDialog(item) {
			this.editedCurso = { ...item }
			this.editCursoDialog = true
		},
		openEditAlunoDialog(item) {
			this.editedAluno = { ...item }
			this.editAlunoDialog = true
		}
	}
}
</script>

