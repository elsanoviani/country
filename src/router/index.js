import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import CountryDetail from '../views/CountryDetail.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/country/:name', name: 'CountryDetail', component: CountryDetail }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
