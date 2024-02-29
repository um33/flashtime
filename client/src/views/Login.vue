<template>
  <b-container fluid>
    <Navbar />
    <b-container class="main-container">
      <h1>Log in</h1>
      <b-form @submit="submitHandler" class="form-container">
        <b-form-group label="Email" label-for="email">
          <b-form-input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="Email"
            required
          >
          </b-form-input>
        </b-form-group>
        <b-form-group label="Password" label-for="password">
          <b-form-input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="Password"
            required
          >
          </b-form-input>
          <div class="btn-container">
            <b-button variant="secondary" @click="$router.push({name:'signup'})">Sign up</b-button>
            <b-button type="submit" variant="primary">Login</b-button>
          </div>
        </b-form-group>
      </b-form>
    </b-container>
  </b-container>
</template>

<script>
import { Api } from '../Api'
import Navbar from '../components/Navbar.vue'
export default {
  name: 'Login',
  components: { Navbar },
  data: function () {
    return {
      form: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    submitHandler: async function (e) {
      e.preventDefault()
      try {
        const response = await Api.post('/auth/login', this.form, {
          withCredentials: true
        })
        localStorage.setItem('accessToken', response.data.accessToken)
        this.$router.push('/')
      } catch (error) {
        const serverErrror = error.response.data.error
        if (serverErrror) {
          this.$vToastify.error(serverErrror)
        } else {
          this.$vToastify.error('Something went wrong')
        }
      }
    }
  }
}
</script>

<style scoped>

.main-container{
  max-width: 600px;
}

h1{
  text-align: left;
}

.form-container{
  margin-top: 2rem;
}

.form-container .form-group >>> label{
  text-align: left;
}

.btn-container{
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.2rem;
}

.btn-container button{
  font-size: 14px;
  min-width: 120px;
  padding: 0.5rem 1rem;
}

.btn-container button.btn.btn-primary{
  background: var(--primary);
  border: 1px solid var(--primary);
}

.btn-container button.btn.btn-primary:hover{
  border: 1px solid var(--primary-dark);
  background: var(--primary-dark);
}

.btn-container button.btn.btn-secondary{
  background: none;
  border: 1px solid var(--secondary-light);
  color: var(--secondary-light);
}

.btn-container button.btn.btn-secondary:hover{
  background: var(--secondary-light);
  color: white;
}

</style>
