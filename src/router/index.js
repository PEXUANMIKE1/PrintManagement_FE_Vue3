import { createRouter, createWebHistory } from "vue-router";
import LoginForm from "@/components/LoginForm.vue";
import RegisterForm from "@/components/RegisterForm.vue";
import Dashboard from "@/components/DashboardPage.vue";
import UserDetail from "@/components/UserDetail.vue";
import ForgotPassword from "@/components/ForgotPassword.vue";
import CreateNewPassword from "@/components/CreateNewPassword.vue";
import ConfirmCodeRegister from "@/components/ConfirmCodeRegister.vue";
import ProfilePage from "@/components/ProfilePage.vue";
import UsersManagement from "@/components/UsersManagement.vue";
import TeamsManagement from "@/components/TeamManagement.vue";
import ProjectManagement from "@/components/ProjectManagement.vue";
import store from "@/store";

const routes = [
  { path: '/', name: 'dashboardPage', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/loginform', name: 'loginform', component: LoginForm, meta: { noLayout: true} },
  { path: '/confirm-code-register', name: 'confirm-code-register', component: ConfirmCodeRegister, meta: { noLayout: true} },
  { path: '/forgotpassword', name: 'forgotpassword', component: ForgotPassword, meta: { noLayout: true} },
  { path: '/createnewpassword', name: 'createnewpassword', component: CreateNewPassword, meta: { noLayout: true} },
  { path: '/registerform', name: 'registerform', component: RegisterForm, meta: { noLayout: true} },
  { path: '/userdetail', name: 'userdetail', component: UserDetail, meta: { requiresAuth: true } },
  { path: '/profilepage', name: 'profilepage', component: ProfilePage, meta: { requiresAuth: true } },
  { path: '/users-management', name: 'usersmanagement', component: UsersManagement, meta: { requiresAuth: true } },
  { path: '/teams-management', name: 'teamsmanagement', component: TeamsManagement, meta: { requiresAuth: true } },
  { path: '/projects-management', name: 'projectsmanagement', component: ProjectManagement, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const loggedIn = store.state.accessToken;
  
  if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
    next('/loginform');
  } else if ((to.path === '/loginform' || to.path === '/registerform') && loggedIn) {
    next('/');
  } else {
    next();
  }
});

export default router;
