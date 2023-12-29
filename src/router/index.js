import { createRouter, createWebHashHistory } from "vue-router";
import StartView from "../views/StartView.vue";
import LoginView from "../views/LoginView.vue"; 
import RegisterView from "../views/RegisterView.vue";
const routes = [
  {
    path: "/",
    name: "start",
    component: StartView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView, // Use the imported LoginView component
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterView, // Use the imported LoginView component
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
