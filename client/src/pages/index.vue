<template>
	<div>
		<v-container grid-list-xl>
			<p>
				<router-link to="/admin" class="mb-5">Administração</router-link>
			</p>
			<v-layout row wrap>
				<v-flex xs12>
					<v-stepper v-model="step" v-if="step <= cursos.length">
						<v-stepper-header>
							<v-stepper-step
								v-for="(curso, i) in cursos"
								:step="i + 1"
								:complete="step > (i + 1)"
								:key="curso.id"
							>{{curso.nome}}</v-stepper-step>
						</v-stepper-header>
						<v-stepper-items>
							<v-stepper-content v-for="(curso, i) in cursos" :key="curso.id" :step="i + 1">
								<v-card>
									<v-container>
										<v-form>
											<v-radio-group v-model="escolhido">
												<v-radio
													v-for="aluno in curso.alunos"
													:key="aluno.id"
													:value="aluno.id"
													:label="aluno.nome"
												></v-radio>
											</v-radio-group>
										</v-form>
									</v-container>
									<v-card-actions>
										<v-btn color="primary" @click="escolher">Próximo</v-btn>
									</v-card-actions>
								</v-card>
							</v-stepper-content>
						</v-stepper-items>
					</v-stepper>
					<v-card v-else>
						<v-alert color="success" :value="true">Obrigado por votar!</v-alert>
						<v-card-actions>
							<v-btn color="primary" @click="step = 1">Nova votação</v-btn>
						</v-card-actions>
					</v-card>
				</v-flex>
			</v-layout>
		</v-container>
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
			step: null,
			cursos: [],
			escolhido: null,
			errorMsg: '',
			error: false
		}
	},
	mounted() {
		axios.get('/api/cursos').then(response => {
			this.cursos = response.data
			this.step = 1
		})
	},
	methods: {
		escolher() {
			axios.put(`/api/alunos/${this.escolhido}/votos`)
				.then(() => {
					this.step++
				})
				.catch(err => {
					this.errorMsg = err.response.data
					this.error = true
				})
		}
	}
}
</script>