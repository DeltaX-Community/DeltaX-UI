import Vue from 'vue'
import VueRouter, {
  RouteConfig
} from 'vue-router'
import Home from '@/views/Home.vue'
import PageLoader from '@/views/PageLoader.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/home',
    alias: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import( /* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/:section', component: PageLoader,
    children: [
      {
        path: ':page',
        component: PageLoader
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router