import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'welcome-view',
    //   component: require('@/components/WelcomeView').default,
    // },
    {
      path: '/',
      name: 'contact-page',
      component: require('@/components/ContactPage').default,
    },
    {
      path: '/sync',
      name: 'sync-page',
      component: require('@/components/DataPage').default,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
