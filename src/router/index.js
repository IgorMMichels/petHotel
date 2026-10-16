import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/pets/novo',
      name: 'addPet',
      component: () => import('../views/AddPetView.vue'),
    },
    {
      path: '/tutores/novo',
      name: 'addTutores',
      component: () => import('../views/AddTutoresView.vue'),
    },
    {
      path: '/tutores',
      name: 'tutoresView',
      component: () => import('../views/TutoresView.vue'),
    },
    {
      path: '/tutores/:id',
      name: 'detalheTutor',
      component: () => import('../views/TutoresDetailsView.vue')
    },
    {
      path: '/pets',
      name: 'petsView',
      component: () => import('../views/PetViews.vue'),
    },
    {
      path: '/pets/:id',
      name: 'detalhePet',
      component: () => import('../views/PetDetailsView.vue')
    },
  ],
});

export default router;
