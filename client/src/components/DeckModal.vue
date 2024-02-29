<template>
    <b-modal
  id="deck-modal"
  :title="deck ? 'Update Deck' : 'Create New Deck'"
  @show="resetModal"
  @hidden="resetModal"
  @ok="handleOk"
  :ok-title="deck ? 'Update' : 'Create'"
>
  <form ref="nameForm" @submit.stop.prevent="handleSubmit">
    <b-form-group
      label ="Name"
      label-for="name-input"
      invalid-feedback="Name is required"
      :state="nameState"
    >
      <b-form-input
        id="name-input"
        v-model="name"
        required
        :state="nameState"
        autofocus
      ></b-form-input>
    </b-form-group>
  </form>
</b-modal>
</template>
<script>

export default {
  name: 'DeckModal',
  data() {
    return {
      name: '',
      nameState: null
    }
  },
  props: ['deck'],
  methods: {
    checkFormValidity() {
      const valid = this.$refs.nameForm.checkValidity()
      this.nameState = valid
      return valid
    },
    resetModal() {
      this.name = ''
    },
    async handleOk(bvModalEvent) {
      bvModalEvent.preventDefault()
      // Trigger submit handler
      this.handleSubmit()
    },
    handleSubmit() {
      if (!this.checkFormValidity()) return
      if (this.deck) {
        this.$emit('updateDeck', this.deck._id, this.name)
      } else {
        this.$emit('createDeck', this.name)
      }
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('deck-modal')
      })
    }
  },
  watch: {
    deck: {
      immediate: true,
      handler: function (newDeck) {
        this.name = newDeck ? newDeck.name : ''
      }
    }
  }
}
</script>
