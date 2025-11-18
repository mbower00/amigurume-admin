import LogIn from '@/views/LogIn.vue'
import Orders from '@/views/Orders.vue'
import Products from '@/views/Products.vue'
import Users from '@/views/Users.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { loginUser } from '@/helpers/api'

async function requireAuth() {
  const userStore = useUserStore()
  if (userStore.isLoggedIn) {
    // Already logged in, success
    return true
  }
  try {
    await loginUser()
    // Login refreshed, success
    return true
  } catch {
    // refresh problem, failure
    return '/login'
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: LogIn },
    { path: '/orders', name: 'orders', component: Orders, beforeEnter: requireAuth },
    { path: '/products', name: 'products', component: Products, beforeEnter: requireAuth },
    { path: '/users', name: 'users', component: Users, beforeEnter: requireAuth },
    // using code from https://router.vuejs.org/guide/essentials/dynamic-matching.html#Catch-all-404-Not-found-Route
    { path: '/:anything(.*)', redirect: '/orders' },
  ],
})

export default router
