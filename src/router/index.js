import { createRouter, createWebHashHistory } from "vue-router";
import StartView from "../views/StartView.vue";
import LoginView from "../views/LoginView.vue"; 
import RegisterView from "../views/RegisterView.vue";
import ProfileView from "../views/ProfileView"
import { useCustomerStore } from '@/stores/CustomerStore';

const routes = [
  {
    path: "/",
    name: "start",
    component: StartView,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    beforeEnter: (to, from, next) => {
      const customerStore = useCustomerStore();
      if (customerStore.isLoggedIn) {
        next({ name: 'start' }); // Replace 'Home' with the name of your home route
      } else {
        next();
      }
    }
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterView, // Use the imported LoginView component
    beforeEnter: (to, from, next) => {
      const customerStore = useCustomerStore();
      if (customerStore.isLoggedIn) {
        next({ name: 'start' }); // Replace 'Home' with the name of your home route
      } else {
        next();
      }
    }
  },
  {
    path: "/profile",
    name: "Profile",
    component: ProfileView,
    beforeEnter: (to, from, next) => {
      const customerStore = useCustomerStore();
      if (customerStore.isLoggedIn) {
        next({ name: 'start' }); // Replace 'Home' with the name of your home route
      } else {
        next();
      }
    }
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
