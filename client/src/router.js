import Vue from 'vue'
import Router from 'vue-router'
import Root from './views/Root.vue'
import Signup from './views/Signup.vue'
import Login from './views/Login.vue'
import Revision from './views/Revision.vue'
import CollectionView from './views/CollectionView.vue'
import Collections from './views/Collections.vue'
import DeckView from './views/DeckView.vue'
import DeckPage from './views/DeckPage.vue'
import RevisionPage from './views/RevisionPage.vue'
import Profile from './views/Profile.vue'
import PasswordUpdate from './views/PasswordUpdate.vue'
import Search from './views/Search.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'root',
      component: Root
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/revise/:id',
      name: 'revise',
      component: Revision
    },
    {
      path: '/collection/:id',
      name: 'collection',
      component: CollectionView
    },
    {
      path: '/collections',
      name: 'collections',
      component: Collections
    },
    {
      path: '/deck/:id',
      name: 'deck',
      component: DeckView
    },
    {
      path: '/decks',
      name: 'decks',
      component: DeckPage
    },
    {
      path: '/revision',
      name: 'revision',
      component: RevisionPage
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile
    },
    {
      path: '/profile/password',
      name: 'passwordUpdate',
      component: PasswordUpdate
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    }
  ]
})

router.beforeEach((to, from, next) => {
  const uppercase = to.name.charAt(0).toUpperCase() + to.name.slice(1)
  document.title = uppercase
  next()
})

export default router
