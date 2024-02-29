<template>
  <div>
    <Navbar />
    <div class="main-container">
      <div class="headers">
        <p class="deck-name">{{ deckName }}</p>
        <p class="progress-card">
          {{ this.currentCard + 1 }}/{{ this.cards.length }}
        </p>
      </div>
      <b-progress
        variant="primary"
        :value="this.currentCard"
        :max="this.cards.length"
        :precision="1"
        class="mb-3 w-100"
      ></b-progress>
      <RevisionCard @nextCard="nextCard" :card="cards[currentCard]" />
    </div>
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'
import RevisionCard from '../components/RevisionCard.vue'
import { Api } from '../Api'
export default {
  name: 'Revision',
  data() {
    return {
      currentCard: 0,
      cards: [],
      deckName: '',
      progress: this.currentCard,
      value: '',
      max: ''
    }
  },
  methods: {
    nextCard: async function (id, grade) {
      try {
        const res = await Api.patch(`/cards/${id}/revise`, { grade })
        const card = res.data
        // add card back to cards if it still needs revision
        if (card.nextRevision <= Date.now()) {
          this.cards.splice(this.currentCard, 1)
          this.cards.push(card)
        }

        if (this.currentCard + 1 < this.cards.length) {
          this.currentCard++
          document.title = `Revise - ${this.currentCard + 1} / ${this.cards.length}`
        } else {
          this.$vToastify.success('You are done with your revision.')
          this.$router.back()
        }
      } catch (err) {
        console.error(err)
        this.$vToastify.error('Something went wrong')
      }
    }
  },
  // eslint-disable-next-line vue/no-unused-components
  components: { Navbar, RevisionCard },
  mounted: async function () {
    try {
      const res = await Api.get(`/decks/${this.$route.params.id}/cards/due`)
      if (res.data.length === 0) {
        this.$vToastify.success('You have no cards to revise.')
        this.$router.back()
      } else {
        const deck = await Api.get(`/decks/${this.$route.params.id}`)
        this.deckName = deck.data.name
        this.cards = res.data
        document.title = `Revise - ${this.currentCard + 1} / ${this.cards.length}`
      }
    } catch (err) {
      this.$vToastify.error('An error occurred.')
      console.error(err)
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.main-container {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 2rem;
}

.headers {
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 1.5rem;
}

.deck-name {
  text-align: left;
}
.progress-card {
  text-align: right;
}

</style>
