<template>
  <div>
    <Navbar />
    <b-container fluid class="main-container">
      <h2>{{ collection.name }}</h2>
      <div class="headers">
        <div>
          <InlineSearch @search="(value) => (query = value)" variant="secondary"/>
        </div>
        <div class="align-right">
          <b-form-select
            v-model="selected"
            @change="sort"
            :options="options"
            class="mr-3"
            value-field="item"
            text-field="name"
            disabled-field="notEnabled"
          ></b-form-select>
          <AddNewDeck :decks="decksToAdd" @addDeck="addNewDeck" />
        </div>
      </div>
      <NoItems
        v-if="decks.length === 0"
        message="This collection does not have any decks, click Add Deck to start"
        variant="secondary"
      />
      <DeckCard
        v-for="deck in filteredDecks"
        :key="deck._id"
        :deck="deck"
        :actions="[
          {
            id: 'remove',
            title: 'Remove from collection',
            icon: 'x-circle-fill',
            color: 'var(--danger)',
            clickHandler: removeDeck
          }
        ]"
      />
    </b-container>
  </div>
</template>
<script>
import { Api } from '../Api'
import DeckCard from '../components/DeckCard.vue'
import Navbar from '../components/Navbar.vue'
import AddNewDeck from '../components/AddNewDeck.vue'
import NoItems from '../components/NoItems.vue'
import InlineSearch from '../components/InlineSearch.vue'

export default {
  name: 'CollectionView',
  data() {
    return {
      decks: [],
      query: '',
      collection: '',
      decksToAdd: [],
      selected: 'Alphabetically',
      options: [
        { item: 'Alphabetically', name: 'Alphabetically' },
        { item: 'Number Of Cards', name: 'Number Of Cards' }
      ]
    }
  },
  components: {
    DeckCard,
    Navbar,
    AddNewDeck,
    NoItems,
    InlineSearch
  },
  mounted: async function () {
    try {
      const collectionRes = await Api.get(
        `/collections/${this.$route.params.id}`
      )
      this.collection = collectionRes.data
      const decksRes = await Api.get(
        `/collections/${this.$route.params.id}/decks`
      )
      this.decks = decksRes.data
      document.title += ` - ${this.collection.name}`
    } catch (err) {
      console.error(err)
    }
    this.sortAlphabetically()
    this.fetchDecksToAdd()
  },
  methods: {
    addNewDeck: async function () {
      Api.get(`/collections/${this.$route.params.id}/decks`).then((res) => {
        this.decks = res.data
      })
      this.fetchDecksToAdd()
    },
    removeDeck: async function (deckId) {
      try {
        await Api.delete(
          `/collections/${this.$route.params.id}/decks/${deckId}`
        )
        this.decks = this.decks.filter((d) => d._id !== deckId)
        this.fetchDecksToAdd()
      } catch (err) {
        this.$vToastify.error('Something went wrong')
      }
    },
    fetchDecksToAdd: async function () {
      try {
        const res = await Api.get('/decks')
        this.decksToAdd = res.data.filter((d) => d.deckCollection == null)
      } catch (err) {
        this.$vToastify.error('Something went wrong')
      }
    },
    sortAlphabetically: function () {
      this.decks.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1
        }
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return 1
        }
        return 0
      })
    },
    sortByNumOfCards: function () {
      this.decks.sort((a, b) => {
        if (a.cards.length > b.cards.length) {
          return -1
        }
        if (a.cards.length < b.cards.length) {
          return 1
        }
        return 0
      })
    },
    sort: function () {
      switch (this.selected) {
        case 'Alphabetically':
          this.sortAlphabetically()
          break
        case 'Number Of Cards':
          this.sortByNumOfCards()
          break
        default:
          this.sortAlphabetically()
      }
    }
  },
  computed: {
    filteredDecks: function () {
      return this.decks.filter((deck) => {
        return deck.name.toLowerCase().includes(this.query.toLowerCase())
      })
    }
  }
}
</script>
<style scoped>

.main-container h2{
  text-align: left;
  width: 100%;
  text-transform: capitalize;
}
.container-fluid {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 900px;
}

.headers {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem auto;
}

.headers > .align-right {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.headers .custom-select,
.headers .custom-select:focus {
  box-shadow: none;
  border: 0.5px solid rgba(212, 79, 95, 0.2);
  padding: 0.5rem auto;
}

@media screen and (max-width: 768px) {
  .headers {
    flex-direction: column;
  }

  .headers > .align-right {
    margin-top: 1rem;
    justify-content: space-between;
    width: 100%;
  }

  .headers > div:first-child {
    width: 100%;
  }
}
</style>
