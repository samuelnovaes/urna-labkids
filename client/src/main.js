import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import App from './App.vue'
import routes from './routes'
import 'vuetify/dist/vuetify.css'

Vue.use(Vuetify, {
	theme: {
		primary: '#AB37C8'
	}
})

Vue.use(VueRouter)

new Vue({
	el: '#app',
	router: new VueRouter({
		routes,
		mode: 'history'
	}),
	render: h => h(App)
})