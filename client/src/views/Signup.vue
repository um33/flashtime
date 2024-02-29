<template>
  <div>
    <Navbar />
    <b-container class="main-container">
      <h1>Create an Account</h1>
      <b-form @submit="submitHandler" class="form-container">
        <b-form-group label="First Name" label-for="fname" id="fnameGroup">
          <b-form-input
            id="fname"
            v-model="form.firstName"
            placeholder="First Name"
            required
          >
          </b-form-input>
        </b-form-group>
        <b-form-group label="Last Name" label-for="lname" id="lnameGroup">
          <b-form-input
            id="lname"
            v-model="form.lastName"
            placeholder="Last Name"
            required
          >
          </b-form-input>
        </b-form-group>
        <b-form-group label="Email" label-for="email" id="emailGroup">
          <b-form-input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="Email"
            required
          >
          </b-form-input>
        </b-form-group>
        <b-form-group label="Password" label-for="password" id="passwordGroup">
          <b-form-input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="Password"
            required
          >
          </b-form-input>
        </b-form-group>
        <b-form-group
          label="Confirm Password"
          label-for="confirmPassword"
          id="confirmPasswordGroup"
        >
          <b-form-input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            placeholder="Confirm Password"
          >
          </b-form-input>
        </b-form-group>
        <div id="footerContainer">
          <b-form-text>
            Your password must be 8-20 characters long, contain letters and
            numbers, and must not contain spaces, special characters, or emoji.
          </b-form-text>
          <div class="btn-container">
              <b-button variant="secondary" @click="$router.push({name:'login'})">Log in</b-button>
            <b-button variant="primary" type="submit">Sign up</b-button>
          </div>
        </div>
      </b-form>
    </b-container>
  </div>
</template>

<script>
import { Api } from '../Api'
import Navbar from '../components/Navbar.vue'

export default {
  name: 'Signup',
  components: { Navbar },
  data: function () {
    return {
      form: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
    }
  },
  methods: {
    submitHandler: async function (e) {
      e.preventDefault()
      try {
        await Api.post('/users', this.form)
        this.$vToastify.success('Account created successfully')
        this.$router.push('/login')
      } catch (error) {
        const errors = error.response.data.errors
        errors.forEach((error) => this.$vToastify.error(error))
      }
    }
  }
}
</script>

<style scoped>
.main-container {
  max-width: 700px;
}

h1 {
  text-align: left;
}

.form-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 0 1rem;
  margin-top: 2rem;
}

.form-container >>> .form-group label {
  text-align: left;
}

#emailGroup,
#passwordGroup,
#confirmPasswordGroup,
#footerContainer {
  grid-column: 1/-1;
}

#footerContainer{
  text-align: left;
}

.btn-container{
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
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

@media screen and (max-width: 768px){
  .form-container{
    grid-template-columns: 1fr;
  }

}

</style>
