<template>
  <div>
    <b-navbar toggleable="lg" variant="outlined" fixed>
      <b-navbar-brand @click="$router.push({ name: 'root' })">
        flashtime
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav v-if="loggedIn">
          <b-nav-item @click="$router.push({name:'revision'})">Revise</b-nav-item>
          <b-nav-item @click="$router.push({name: 'collections'})"
            >Collections</b-nav-item
          >
          <b-nav-item @click="$router.push({name: 'decks'})">Decks</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right v-if="loggedIn">
            <!-- Using 'button-content' slot -->
            <template #button-content :style="{ color: 'var(--primary)' }">
              <em>{{ currentUser }}</em>
            </template>
            <b-dropdown-item @click="$router.push('/profile')"
              >Profile</b-dropdown-item
            >
            <b-dropdown-item @click="signOut">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item v-if="!loggedIn" @click="$router.push({ name: 'login' })"
            >Login</b-nav-item
          >
          <b-nav-item v-if="!loggedIn" @click="$router.push({ name: 'signup' })"
            >Sign Up</b-nav-item
          >
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import { Api } from '../Api'
export default {
  name: 'Navbar',
  data: function () {
    return {
      loggedIn: false,
      currentUser: ''
    }
  },
  mounted: function () {
    this.loggedIn = !!localStorage.getItem('accessToken')
    if (this.loggedIn) {
      Api.get('/users/')
        .then((res) => {
          this.currentUser = res.data.firstName + ' ' + res.data.lastName
        })
        .catch((err) => console.error(err))
    }
  },
  methods: {
    signOut: async function () {
      try {
        await Api.delete('/auth/logout', { withCredentials: true })
      } catch (err) {
        this.$vToastify.error('Something went wrong')
      }
      localStorage.removeItem('accessToken')
      window.location = '/'
    }
  }
}
</script>

<style scoped>
.navbar {
  background: #fff;
  position: fixed;
  top: 0;
  padding: 1rem 2rem;
  width: 100%;
  font-family: 'Raleway', sans-serif;
  font-size: 1.1rem;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.05);
  z-index: 1000;
}

div.navbar-brand {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: linear-gradient(
    to right,
    var(--secondary-light) 20%,
    var(--primary) 40%,
    var(--primary) 60%,
    var(--secondary-light) 80%
  );
  background-clip: text;
  text-fill-color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.nav-item a.nav-link {
  color: var(--primary);
}

.nav-item a.nav-link:hover {
  color: var(--primary-dark);
}

a.dropdown-toggle em {
  text-transform: capitalize;
  color: var(--primary);
}
</style>
