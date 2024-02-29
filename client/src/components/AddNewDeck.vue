<template>
  <div>
    <b-button v-b-modal.decks-to-add-modal>Add Deck</b-button>

    <b-modal id="decks-to-add-modal" title="Add Decks" hide-footer>
      <div class="no-decks" v-if="decks.length === 0">
        <p>You have no decks to add</p>
        <b-button variant="outlined" @click="handleNewDeck">New Deck</b-button>
      </div>
      <b-list-group v-else>
        <b-list-group-item
          v-for="deck in decks"
          :key="deck._id"
          button
          @click="addDeck(deck._id)"
          >{{ deck.name }}</b-list-group-item
        >
      </b-list-group>
    </b-modal>
  </div>
</template>

<script>
import { Api } from '../Api'

export default {
  name: 'AddNewDeck',
  props: ['decks'],
  methods: {
    addDeck: async function (deckId) {
      try {
        await Api.put(`/collections/${this.$route.params.id}/decks/${deckId}`)
      } catch (err) {
        this.$vToastify.error('Something went wrong')
      }
      this.$emit('addDeck')
    },
    handleNewDeck: async function () {
      const navigation = await this.$router.push({ name: 'decks' })
      if (navigation) this.$bvModal.show('deck-modal')
    }
  }
}
</script>

<style scoped>
.no-decks {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 1rem auto;
}

.btn {
  background: var(--secondary-light);
  color: white;
  font-size: 14px;
  min-width: 120px;
  border: none;
}

.btn:hover {
  background: var(--secondary);
  color: white;
}
</style>
