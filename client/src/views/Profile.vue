<template>
  <div>
    <Navbar />
    <div class="main-container">
      <h2>Profile</h2>
      <b-form @submit="onSubmit" class="main-form">
        <b-form-group id="emailGroup" label="Email address:" label-for="email">
          <b-form-input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="Enter email"
            :disabled="!Boolean(ready)"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="firstNameGroup"
          label="First Name:"
          label-for="firstName"
        >
          <b-form-input
            id="firstName"
            v-model="form.firstName"
            placeholder="Enter First Name"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group id="lastNameGroup" label="Last Name:" label-for="input-3">
          <b-form-input
            id="input-3"
            v-model="form.lastName"
            placeholder="Enter Last Name"
            required
          ></b-form-input>
        </b-form-group>
        <div class="btn-container">
          <b-button
            id="secondaryBtn"
            class="change-password"
            @click="changePassword"
            type="submit"
            variant="outlined"
            >Change password</b-button
          >
          <b-button type="submit" variant="outlined" id="primaryBtn">Update</b-button>
        </div>
      </b-form>
      <div class="delete-data">
        <h3>Delete Data</h3>
        <div class="delete-action">
          <p>Delete all decks from your account</p>
          <b-button @click="deleteAllDecks">Delete Decks</b-button>
        </div>
        <div class="delete-action">
          <p>Delete all collections from your account</p>
          <b-button @click="deleteAllCollections"
            >Delete Collections</b-button
          >
        </div>
        <div>
          <div class="delete-action">
            <p>Delete your account. Proceed with caution.</p>
            <b-button v-b-modal.modal-prevent-closing variant="outlined">Delete Account</b-button>
          </div>

          <b-modal
            id="modal-prevent-closing"
            ref="modal"
            title="Delete your account"
            @show="resetModal"
            @hidden="resetModal"
            @ok="handleOk"
            ok-title="Delete"
            ok-variant="danger"
          >
            <form ref="form" @submit.stop.prevent="handleSubmit">
              <b-form-group
                label="Please type your password"
                label-for="password-input"
                invalid-feedback="password is required"
                :state="passwordState"
              >
                <b-form-input
                  id="name-input"
                  type="password"
                  v-model="password"
                  :state="passwordState"
                  required
                ></b-form-input>
              </b-form-group>
            </form>
          </b-modal>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Api } from '../Api'
import Navbar from '../components/Navbar.vue'
export default {
  name: 'profile',
  data() {
    return {
      form: {
        email: '',
        firstName: '',
        lastName: ''
      },
      ready: false,
      password: '',
      passwordState: null,
      decks: [],
      deckCollections: []
    }
  },
  methods: {
    // Delete Account methods:
    deleteAccount: function () {},
    deleteAllDecks: async function () {
      this.$bvModal
        .msgBoxConfirm(
          'Please confirm that you want to delete All your decks.',
          {
            title: 'Please Confirm',
            size: 'sm',
            buttonSize: 'sm',
            okVariant: 'danger',
            okTitle: 'YES',
            cancelTitle: 'NO',
            footerClass: 'p-2',
            hideHeaderClose: false,
            centered: true
          }
        )
        .then(() => {
          console.log(this.decks)
          if (this.decks.length === 0) {
            return this.$vToastify.error('You have no decks to delete')
          }
          Api.delete('/decks')
          this.decks = ''
          this.$vToastify.success('You have deleted all your decks')
        })
        .catch(() => {
          this.$vToastify.error('Something went wrong')
        })
    },
    deleteAllCollections: async function () {
      this.$bvModal
        .msgBoxConfirm(
          'Please confirm that you want to delete All your Collections.',
          {
            title: 'Please Confirm',
            size: 'sm',
            buttonSize: 'sm',
            okVariant: 'danger',
            okTitle: 'YES',
            cancelTitle: 'NO',
            footerClass: 'p-2',
            hideHeaderClose: false,
            centered: true
          }
        )
        .then(() => {
          console.log(this.deckCollections)
          if (this.deckCollections.length === 0) {
            return this.$vToastify.error('You have no collections to delete')
          }
          Api.delete('/collections')
          this.deleteAllCollections = ''
          this.$vToastify.success('You have deleted all your collections')
        })
        .catch(() => {
          this.$vToastify.error('Something went wrong')
        })
    },
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity()
      this.passwordState = valid
      return valid
    },
    resetModal() {
      this.password = ''
      this.passwordState = null
    },
    handleOk(bvModalEvent) {
      // Prevent modal from closing
      bvModalEvent.preventDefault()
      // Trigger submit handler
      this.handleSubmit()
    },
    handleSubmit: async function () {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return
      }
      try {
        await Api.delete('/users', { data: { password: this.password } })
        localStorage.removeItem('accessToken')
        window.location = '/'
      } catch (err) {
        this.$vToastify.error(err)
      }
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('modal-prevent-closing')
      })
    },
    // Update User information methods
    onSubmit: async function (event) {
      event.preventDefault()
      try {
        await Api.put('/users/', {
          firstName: this.form.firstName,
          lastName: this.form.lastName,
          email: this.form.email
        })
        this.$vToastify.success('User updated')
      } catch (err) {
        this.$vToastify.error('Something went wrong')
      }
    },
    changePassword: function () {
      this.$router.push('/profile/password')
    }
  },
  mounted: async function () {
    const res = await Api.get('/users')
    const decksfromUser = await Api.get('/decks')
    const collectionsfromUser = await Api.get('/collections')
    this.form.firstName = res.data.firstName
    this.form.lastName = res.data.lastName
    this.form.email = res.data.email
    this.decks = decksfromUser.data
    this.deckCollections = collectionsfromUser.data
  },
  components: { Navbar }
}
</script>

<style scoped>
.main-container {
  max-width: 700px;
  margin: inherit auto;
  padding: 2rem;
}

.main-container h2{
  text-align: left;
  margin-bottom: 2rem;
}

.main-form {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 1rem 2rem;
}

.form-group {
  margin: 0;
}

.form-group >>> label {
  text-align: left;
}

#emailGroup {
  grid-column: 1/-1;
}

#firstNameGroup {
  grid-column: 1/3;
}

#lastNameGroup {
  grid-column: 3/-1;
}

@media (max-width: 768px) {
  .main-form {
    grid-template-columns: 1fr;
  }

  #firstNameGroup {
  grid-column: 1/-1;
}

#lastNameGroup {
  grid-column: 1/-1;
}

}

.btn-container{
  grid-column: 1/-1;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

#primaryBtn{
  background: var(--primary);
  color: white;
  font-size: 14px;
}

#primaryBtn:hover{
  background: var(--primary-dark);
}

#secondaryBtn{
  border: 1px solid var(--secondary);
  color: var(--secondary);
  font-size: 14px;
}

#secondaryBtn:hover{
  background: var(--secondary);
  color: white;
}

.delete-data{
  margin-top: 5rem;
  border: 1px solid var(--danger);
  padding: 3rem;
  border-radius: 8px;
}

.delete-data h3{
  font-size: 1.5rem;
  text-align: left;
}

.delete-action{
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  background: white;
  padding: 1rem;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.05);
  border-radius: 5px;
}

.delete-action p{
  margin: 0;
  font-size: 14px;
}

.delete-action:not(:last-child) button{
  color: var(--danger);
  background: none;
  border: 1px solid var(--danger);
  font-size: 14px;
}

.delete-action:not(:last-child) button:hover{
  background: var(--danger);
  color: white;
}

.delete-action:last-child button{
  color: white;
  background: var(--danger);
  font-size: 14px;
  border: none;
}

.delete-action:last-child button.btn:hover{
  background: #dc3545 !important;
}

</style>
