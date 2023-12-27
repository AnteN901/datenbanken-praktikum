import { createRouter, createWebHashHistory } from "vue-router";
import StartView from "../views/StartView.vue";
import LoginView from "../views/LoginView.vue"; // Add the missing import statement for LoginView
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
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
