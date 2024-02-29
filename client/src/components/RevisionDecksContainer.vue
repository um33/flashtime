<template>
  <b-col cols="12" md="8" class="mx-auto mt-3">
    <h2>Needs Revision</h2>
    <NoDecks v-if="noDecks"/>
    <NoRevisions v-else-if="noRevisionDecks"/>
    <b-container fluid v-else>
      <b-row v-for="deck in topDecks" :key="deck._id">
        <RevisionDeck :deck="deck" />
      </b-row>
    </b-container>
  </b-col>
</template>

<script>
import { Api } from '../Api'
import RevisionDeck from './RevisionDeck.vue'
import NoDecks from './NoDecks.vue'
import NoRevisions from './NoRevisions.vue'

export default {
  name: 'NeedRevisionDecks',
  data: function () {
    return {
      topDecks: [],
      noDecks: false,
      noRevisionDecks: false
    }
  },
  methods: {},
  components: { RevisionDeck, NoDecks, NoRevisions },
  mounted: async function () {
    try {
      const response = await Api.get('/decks/')
      if (response.data.length === 0) this.noDecks = true
      response.data.sort((a, b) => a.cardsDue < b.cardsDue)
      const filteredDecks = response.data
        .slice(0, 3)
        .filter((deck) => deck.cardsDue > 0)
      this.topDecks = filteredDecks
      if (filteredDecks.length === 0) this.noRevisionDecks = true
    } catch (err) {
      console.error(err)
    }
  }
}
</script>

<style scoped>
h2 {
  font-size: 1.5rem;
  text-align: left;
  margin: 0;
}
</style>
