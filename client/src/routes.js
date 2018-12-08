import index from './pages/index.vue'
import error404 from './pages/404.vue'
import admin from './pages/admin.vue'

export default [
	{ path: '*', component: error404 },
	{ path: '/', component: index },
	{ path: '/admin', component: admin }
]