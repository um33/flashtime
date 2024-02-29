<template>
  <div>
    <Navbar />
    <div class="main-container">
      <h1>Revision Page</h1>
      <InlineSearch @search="handleSearch" />
      <div class="content-container">
        <div v-if="decks.length === 0" class="no-revisions">
          <b-icon icon="check-all"></b-icon>
          <p>Nothing to revise. You are all done.</p>
        </div>
        <div
          class="no-results"
          v-else-if="decks.length !== 0 && filteredDecks.length === 0"
        >
          <p>No collections matched your query</p>
        </div>
        <div class="cards-container" v-else>
          <RevisionDeck
            v-for="deck in filteredDecks"
            :key="deck._id"
            :deck="deck"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Api } from '../Api'
import RevisionDeck from '../components/RevisionDeck.vue'
import Navbar from '../components/Navbar.vue'
import InlineSearch from '../components/InlineSearch.vue'
export default {
  name: 'revisionPage',
  data: function () {
    return {
      query: '',
      decks: []
    }
  },
  components: { RevisionDeck, Navbar, InlineSearch },
  mounted: async function () {
    try {
      const response = await Api.get('/decks/')
      this.decks = response.data
        .filter((deck) => deck.cardsDue > 0)
        .sort((a, b) => a.cardsDue < b.cardsDue)
    } catch (err) {
      console.error(err)
    }
  },
  methods: {
    handleSearch: function (query) {
      this.query = query
    }
  },
  computed: {
    filteredDecks: function () {
      return this.decks.filter((deck) =>
        deck.name.toLowerCase().includes(this.query.toLowerCase())
      )
    }
  }
}
</script>
<style scoped>
h1 {
  margin: 2rem auto;
}
.main-container {
  max-width: 900px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main-container >>> input[type='text'].form-control,
.main-container >>> input[type='text'].form-control:focus {
  color: var(--black);
  border: 1px solid var(--tertiary);
  border-radius: 30px;
  padding: 1.3rem 2rem;
  background: #f7f7f7;
  max-width: 70%;
}

.main-container >>> input[type='text'].form-control::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: var(--black) !important;
  opacity: 1; /* Firefox */
}

.main-container .content-container {
  width: 100%;
  margin-top: 2rem;
}

.main-container .cards-container {
  width: 100%;
}

.cards-container >>> .revision-container {
  width: 100%;
}

.cards-container div.no-revisions {
  padding: 5rem !important;
}

.no-results {
  padding: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
}

.no-results p {
  margin: 0;
  color: var(--tertiary);
}

.no-revisions {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 1rem auto;
  height: 100%;
  border-radius: 5px;
  padding: 5rem;
}

.no-revisions .bi-check-all {
  font-size: 3.5rem;
  color: var(--green);
}

.no-revisions p {
  font-size: 1.2rem;
  color: var(--tertiary);
}

@media screen and (max-width: 768px){
  .main-container >>> input[type='text'].form-control,
  .main-container >>> input[type='text'].form-control:focus {
  max-width: 100%;
  width: 100%;
}

}
</style>
