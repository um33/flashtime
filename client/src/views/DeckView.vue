<template>
  <div>
    <Navbar />
    <CardModal
      :card="currentCard"
      @updateCard="updateCard"
      @createCard="createCard"
    />
    <b-container fluid class="main-container">
      <h2>
        {{ deck ? deck.name : '' }}
        <span v-if="!!deck"
          ><CollectionBadge :deck="deck || undefined" />
        </span>
      </h2>
      <div class="headers">
        <div>
          <InlineSearch @search="(value) => (query = value)" variant="secondary"/>
        </div>
        <b-button @click="setCurrentCard(undefined)">Create</b-button>
      </div>
      <NoItems
        v-if="cards.length === 0"
        message="This deck does not have any cards, click Create to add a card"
        variant="secondary"
      />
      <Card
        v-for="card in filteredCards"
        :key="card._id"
        :card="card"
        @deleteCard="deleteCard"
        @setCurrentCard="setCurrentCard"
      />
    </b-container>
  </div>
</template>
<script>
import Card from '../components/Card.vue'
import { Api } from '../Api'
import CardModal from '../components/CardModal.vue'
import CollectionBadge from '../components/CollectionBadge.vue'
import Navbar from '../components/Navbar.vue'
import NoItems from '../components/NoItems.vue'
import InlineSearch from '../components/InlineSearch.vue'
export default {
  name: 'DeckView',
  data() {
    return {
      cards: [],
      currentCard: undefined,
      deck: undefined,
      query: ''
    }
  },
  methods: {
    fetchCards: function () {
      Api.get(`/decks/${this.$route.params.id}/cards`)
        .then((res) => {
          this.cards = res.data
        })
        .catch((err) => console.error(err))
    },
    async createCard(front, back) {
      try {
        await Api.post(`/decks/${this.$route.params.id}/cards/`, {
          front,
          back
        })
        this.fetchCards()
      } catch (err) {
        this.$vToastify.error('Something went wrong')
        this.$router.push('/')
      }
    },
    async updateCard(id, front, back) {
      try {
        await Api.patch(`/cards/${id}`, { front, back })
        this.$vToastify.success('Card updated')
        this.fetchCards()
      } catch (err) {
        this.$vToastify.error('Something went wrong')
      }
    },
    deleteCard: function (id) {
      this.cards = this.cards.filter((card) => card._id !== id)
    },
    setCurrentCard: function (card) {
      this.currentCard = card
      this.$bvModal.show('card-modal')
    }
  },
  computed: {
    filteredCards: function () {
      return this.cards.filter((card) => {
        return (
          card.front.toLowerCase().includes(this.query.toLowerCase()) ||
          card.back.toLowerCase().includes(this.query.toLowerCase())
        )
      })
    }
  },
  components: {
    Card,
    CardModal,
    CollectionBadge,
    Navbar,
    NoItems,
    InlineSearch
  },
  mounted: async function () {
    this.fetchCards()
    try {
      const res = await Api.get(`/decks/${this.$route.params.id}`)
      this.deck = res.data
      document.title += ` - ${this.deck.name}`
    } catch (err) {
      console.error(err)
    }
  }
}
</script>
<style scoped>
.container-fluid {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 900px;
}

h2 {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
}

h2 >>> .badge {
  margin: auto;
  margin-left: 1rem;
  font-size: 14px;
}

.actions {
  width: 100%;
  text-align: right;
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

.main-container >>> .card:not(:last-child) {
  margin-bottom: 1rem;
}

</style>
