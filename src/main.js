import '@fortawesome/fontawesome-free/css/all.min.css'
import 'bootstrap-css-only/css/bootstrap.min.css'
import 'mdbvue/lib/css/mdb.min.css'
import Vue from 'vue'
import App from './App'
import router from './router'
import Notifications from 'vue-notification'
import VueKatex from 'vue-katex'

Vue.config.productionTip = false;
Vue.use(Notifications);
Vue.use(VueKatex)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
