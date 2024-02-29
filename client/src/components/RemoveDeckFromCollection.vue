<template>
  <b-button class="button" @click="removeDeck">Reove</b-button>
</template>

<script>
import { Api } from '../Api'

export default {
  name: 'RemoveDeckFromCollection',
  data: function () {
    return {
      decks: []
    }
  },
  props: ['deck'],
  mounted: async function (e) {
    try {
      const res = await Api.get(`/collections/${this.$route.params.id}/decks/`)
      this.decks = res.data
    } catch (err) {
      this.$vToastify.error('Something went wrong')
    }
  },
  methods: {
    removeDeck: async function (deckId, e) {
      try {
        await Api.delete(
          `/collections/${this.$route.params.id}/decks/${deckId}`
        )
      } catch (err) {
        this.$vToastify.error('Something went wrong')
      }
    }
  }
}
</script>

<style scoped></style>
