<template>
  <b-modal
    id="card-modal"
    :title="card ? 'Edit Card' : 'Create New Card'"
    @show="resetModal"
    @hidden="resetModal"
    @ok="handleOk"
    :ok-title="card ? 'Update' : 'Create'"
  >
    <form ref="frontForm" @submit.stop.prevent="handleSubmit">
      <b-form-group
        label="Front"
        label-for="front-input"
        invalid-feedback="Front is required"
        :state="frontState"
      >
        <b-form-input
          id="front-input"
          v-model="front"
          required
          :state="frontState"
          ref="frontInput"
          autofocus
        ></b-form-input>
      </b-form-group>
    </form>
    <form ref="backForm" @submit.stop.prevent="handleSubmit">
      <b-form-group
        label="Back"
        label-for="back-input"
        invalid-feedback="Back is required"
        :state="backState"
      >
        <b-form-input
          id="back-input"
          v-model="back"
          required
          :state="backState"
        ></b-form-input>
      </b-form-group>
    </form>
  </b-modal>
</template>
<script>
export default {
  name: 'CardModal',
  data() {
    return {
      front: '',
      back: '',
      frontState: null,
      backState: null
    }
  },
  props: ['card'],
  methods: {
    checkFormValidity() {
      const front = this.$refs.frontForm.checkValidity()
      const back = this.$refs.backForm.checkValidity()
      this.frontState = front
      this.backState = back
      return front && back
    },
    resetModal() {
      this.front = ''
      this.back = ''
    },
    async handleOk(bvModalEvent) {
      bvModalEvent.preventDefault()
      // Trigger submit handler
      this.handleSubmit()
    },
    handleSubmit() {
      if (!this.checkFormValidity()) return
      if (this.card) {
        this.$emit('updateCard', this.card._id, this.front, this.back)
      } else {
        this.$emit('createCard', this.front, this.back)
      }

      // Hide the modal manually
      this.$nextTick(() => {
        // this.$bvModal.hide('card-modal')
        this.frontState = null
        this.backState = null
        this.front = ''
        this.back = ''
        this.$vToastify.success('Card created')
        this.$refs.frontInput.focus()
      })
    }
  },
  watch: {
    card: {
      immediate: true,
      handler: function (newCard) {
        if (newCard) {
          this.front = newCard.front
          this.back = newCard.back
          this.frontState = null
          this.backState = null
        }
      }
    }
  }
}
</script>
