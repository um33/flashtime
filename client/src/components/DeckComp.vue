<template>
     <div>
        <b-card
        border-variant="primary"
        :header="deck.name"
        header-bg-variant="primary"
        header-text-variant="white"
      >
      <button class="update" @click="clickHandler">UPDATE</button>
      <button class="delete" @click="deleteDeck(deck._id)">DELETE</button>
      </b-card>
    </div>
  </template>
<script>
import { Api } from '../Api'
export default {
  name: 'DeckComp',
  props: ['deck'],
  methods: {
    deleteDeck(id) {
      
      // eslint-disable-next-line no-return-assign, vue/no-mutating-props
        .then(() => this.$emit('deleteDeck', id))
        .catch(err => console.error(err))
    },
    clickHandler: function () {
      this.$emit('setCurrentDeck', this.deck)
      this.$bvModal.show('deckModal')
    }
  }
}
</script>
  <style scoped>
  .delete {
    position:   absolute;
    top:        5px;
    left:       5px;
    text-align: left;
  }
  .update{
    position:   absolute;
    top:        5px;
    right:       5px;
    text-align: right;
  }
  </style>
