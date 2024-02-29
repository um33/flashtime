<template>
  <div class="main-container">
    <Navbar />
    <div class="content-container">
      <h2>Your Decks</h2>
      <div class="headers">
        <div>
          <InlineSearch @search="(value) => (query = value)" />
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
          <b-button @click="setCurrentDeck(undefined)" variant="outlined"
            >New Deck</b-button
          >
        </div>
      </div>
      <NoItems
        v-if="decks.length === 0"
        message="You do not have any decks. Click on New Deck to get started."
      />
      <div class="decks-container" v-else>
        <DeckCard
          v-for="deck in filteredDeck"
          :key="deck._id"
          :deck="deck"
          :actions="deckActions[deck._id]"
        />
      </div>
    </div>
    <DeckModal
      :deck="currentDeck"
      @updateDeck="updateDeck"
      @createDeck="createDeck"
    />
  </div>
</template>
<script>
import { Api } from '../Api'
import DeckModal from '../components/DeckModal.vue'
import Navbar from '../components/Navbar.vue'
import DeckCard from '../components/DeckCard.vue'
import NoItems from '../components/NoItems.vue'
import InlineSearch from '../components/InlineSearch.vue'

export default {
  name: 'Decks',
  data() {
    return {
      decks: [],
      query: '',
      currentDeck: undefined,
      selected: 'Newest to Oldest',
      options: [
        { item: 'Alphabetically', name: 'Alphabetically' },
        { item: 'Newest to Oldest', name: 'Newest to Oldest' },
        { item: 'Oldest to Newest', name: 'Oldest to Newest' },
        { item: 'Number of Cards', name: 'Number of Cards' }
      ]
    }
  },
  components: {
    DeckModal,
    Navbar,
    DeckCard,
    NoItems,
    InlineSearch
  },
  methods: {
    fetchDecks: async function () {
      try {
        const res = await Api.get('/decks')
        this.decks = res.data
        this.sort()
      } catch (err) {
        console.error(err)
      }
    },
    async createDeck(name) {
      try {
        const res = await Api.post('/decks', { name })
        this.$router.push({ name: 'deck', params: { id: res.data._id } })
      } catch (err) {
        const error = err.response.data.error
        this.$vToastify.error(error)
      }
    },
    async updateDeck(id, name) {
      try {
        await Api.put(`/decks/${id}`, { name })
        this.fetchDecks()
      } catch (err) {
        this.$vToastify.error('Something went wrong')
      }
    },
    deleteDeck: async function (id) {
      try {
        await Api.delete(`/decks/${id}`)
        this.decks = this.decks.filter((deck) => deck._id !== id)
      } catch (err) {
        this.$vToastify.error('Something went wrong')
      }
    },

    setCurrentDeck: function (id) {
      this.currentDeck = this.decks.find((deck) => deck._id === id)
      this.$bvModal.show('deck-modal')
    },
    sort: function () {
      switch (this.selected) {
        case 'Newest to Oldest':
          this.sortByNewest()
          break
        case 'Alphabetically':
          this.sortAlphabetically()
          break
        case 'Oldest to Newest':
          this.sortByOldest()
          break
        case 'Number of Cards':
          this.sortByNumberOfCards()
          break
        default:
          this.sortAlphabetically()
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
    sortByNewest: function () {
      this.decks.sort((a, b) => {
        if (a.createdAt > b.createdAt) {
          return -1
        }
        if (a.createdAt < b.createdAt) {
          return 1
        }
        return 0
      })
    },
    sortByOldest: function () {
      this.decks.sort((a, b) => {
        if (a.createdAt < b.createdAt) {
          return -1
        }
        if (a.createdAt > b.createdAt) {
          return 1
        }
        return 0
      })
    },
    sortByNumberOfCards: function () {
      this.decks.sort((a, b) => a.cards.length < b.cards.length)
    }
  },
  mounted: function () {
    this.fetchDecks()
  },
  computed: {
    filteredDeck() {
      return this.decks.filter((deck) =>
        deck.name.toLowerCase().includes(this.query.toLowerCase())
      )
    },
    deckActions() {
      const decks = this.decks.map((deck) => {
        const actions = [
          {
            id: 'update',
            title: 'Update Deck',
            icon: 'pencil',
            color: 'var(--primary)',
            clickHandler: this.setCurrentDeck
          },
          {
            id: 'delete',
            title: 'Delete Deck',
            icon: 'trash',
            color: 'var(--danger)',
            clickHandler: this.deleteDeck
          }
        ]
        if (deck.cardsDue > 0) {
          actions.unshift({
            id: 'revise',
            title: 'Revise Deck',
            icon: 'journals',
            color: 'var(--green)',
            clickHandler: () =>
              this.$router.push({ name: 'revise', params: { id: deck._id } })
          })
        }
        return [deck._id, actions]
      })
      return Object.fromEntries(decks)
    }
  }
}
</script>

<style scoped>
.content-container {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 2rem;
}

h2 {
  text-align: left;
  width: 100%;
}

.decks-container {
  width: 100%;
}

.decks-container >>> .deck-container:not(:last-child) {
  margin-bottom: 1rem;
}

.headers {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1.5rem auto;
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
.btn {
  background: var(--primary);
  color: white;
  font-size: 14px;
  min-width: 120px;
}

.btn:hover {
  background: var(--primary-dark);
  color: white;
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
