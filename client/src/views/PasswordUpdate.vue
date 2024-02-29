<template>
  <div>
    <Navbar />
    <div class="main-container">
      <h1>Update Password</h1>
      <div>
        <b-form @submit.stop.prevent @submit="saveNewPassword">
          <b-form-group>
            <label for="currentPassword">Current Password</label>
            <b-form-input
              type="password"
              id="currentPassword"
              v-model="currentPassword"
              aria-describedby="password-help-block"
              placeholder="Current Password"
            ></b-form-input>
          </b-form-group>
          <b-form-group>
            <label for="newPassword">New Password</label>
            <b-form-input
              type="password"
              id="newPassword"
              v-model="newPassword"
              aria-describedby="password-help-block2"
              placeholder="New Password"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group>
            <label for="confirmPassword">Confirm Password</label>
            <b-form-input
              type="password"
              id="confirmPassword"
              v-model="confirmNewPassWord"
              aria-describedby="password-help-block3"
              placeholder="Confirm New Password"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-text id="password-help-block2">
            Your password must be 8-20 characters long, contain letters and
            numbers, and must not contain spaces, special characters, or emoji.
          </b-form-text>
          <div class="btn-container">
            <b-button
              @click="$router.push('/profile')"
              type="back"
              variant="outlined"
              id="backBtn"
              >Back</b-button
            >
            <b-button type="submit" variant="success">Save</b-button>
          </div>
        </b-form>
      </div>
    </div>
  </div>
</template>
<script>
import { Api } from '../Api'
import Navbar from '../components/Navbar.vue'
export default {
  name: 'passwordUpdate',
  data() {
    return {
      currentPassword: '',
      newPassword: '',
      confirmNewPassWord: ''
    }
  },
  methods: {
    saveNewPassword: async function (e) {
      e.preventDefault()
      if (this.newPassword !== this.confirmNewPassWord) {
        this.$vToastify.error('Passwords do not match')
        return
      }
      try {
        await Api.patch('/users/password', {
          currentPassword: this.currentPassword,
          newPassword: this.newPassword
        })
        this.$vToastify.success('Password updated successfully')
        this.$router.push('/profile')
      } catch (err) {
        const error = err.response.data.error
        this.$vToastify.error(error)
      }
    }
  },
  components: { Navbar }
}
</script>
<style scoped>
.main-container {
  max-width: 500px;
  text-align: left;
  padding: 2rem;
}

h1 {
  margin-bottom: 2rem;
}

.btn-container {
  margin-top: 1rem;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-container button {
  min-width: 120px;
  font-size: 14px;
}

#backBtn {
  border: 1px solid var(--secondary-light);
  color: var(--secondary-light);
  background: none;
}

#backBtn:hover {
  background: var(--secondary-light) !important;
  color: var(--white) !important;
}
</style>
