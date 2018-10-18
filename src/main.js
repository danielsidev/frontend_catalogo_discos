import Vue from 'vue'
import VueRouter from 'vue-router'
import moment from 'moment'
import VueResource from 'vue-resource'
import Vue2Filters from 'vue2-filters'

import App from './components/App'
import Dashboard from './components/Dashboard'
import AdicionarDisco from './components/AdicionarDisco'
import EditarDisco from './components/EditarDisco'
import BootstrapVue from 'bootstrap-vue'

Vue.use(BootstrapVue);

Vue.use(VueRouter)

Vue.use(VueResource)
Vue.use(Vue2Filters)


// Define a base da URL das requisições AJAX será
// a constante API que configuramos
Vue.http.options.root = process.env.API

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

export const  HOST_BACKEND  = "http://localhost:30838";
export const  HOST_FRONTEND = "http://localhost:8080";

const routes = [
   { path: '/', component: App },
   { path: '/dashboard', component: Dashboard, name:'dashboard' },
   { path: '/dashboard/disk/add', component: AdicionarDisco, name:'dashboard.add' },
   { path: '/dashboard/disk/edit/:id', component: EditarDisco, name:'dashboard.edit', props:true }
 ];
 
 const router = new VueRouter({
   mode:'history',
   routes
 });
 
 router.mode = 'html5';
 
 Vue.router = router;
 
 
 const app = new Vue({
  router
}).$mount('#app');

 /*
new Vue({
  el: '#app',
  render: h => h(App)
})
*/

