<template>
    <div>
        <Navbar/>
        <b-button @click="clickHandler">Add new card</b-button>
        <CardModal :card="currentCard" @updateCard="updateCard" @createCard="createCard"/>
        <Card v-for ="card in cards" :key="card._id" :card="card" @deleteCard="deleteCard" @setCurrentCard="setCurrentCard"/>
</div>
</template>
<script>
import Navbar from '../components/Navbar.vue'
import Card from '../components/Card.vue'
import { Api } from '../Api'
import CardModal from '../components/CardModal.vue'
export default {
  name: 'home',
  data() {
    return {
      cards: [],
      currentCard: undefined
    }
  },
  methods: {
    fetchCards: function () {
      Api.get(`/decks/${this.$route.params.id}/cards`)
        .then(res => { this.cards = res.data })
        .catch(err => console.error(err))
    },
    async createCard(front, back) {
      try {
        await Api.post(`/decks/${this.$route.params.id}/cards/`, { front, back })
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
    },
    clickHandler: function () {
      this.setCurrentCard(undefined)
    }
  },
  components: { Navbar, Card, CardModal },
  mounted: function () {
    this.fetchCards()
  }
}

</script>
<style scoped>
</style>
