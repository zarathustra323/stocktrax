import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'index',
    component: () => import('../pages/index.vue'),
  },
  {
    path: '/transactions',
    name: 'transactions',
    component: () => import('../pages/transactions.vue'),
  },
  {
    path: '/style-guide',
    name: 'style-guide',
    component: () => import('../pages/style-guide.vue'),
  },
  {
    // always be open
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../pages/not-found.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
