<template>
  <b-container class="deck-container" fluid>
    <router-link
      :to="{ name: 'deck', params: { id: deck._id } }"
      class="content-container"
    >
      <p>{{ deck.name }}</p>
      <div class="badge-container">
        <b-badge variant="primary">{{ deck.cards.length }}</b-badge>
        <b-badge variant="secondary">{{ cardsDue }}</b-badge>
      </div>
    </router-link>
    <div class="actions">
      <b-button variant="outlined" v-for="action in actions" :key="action.id" @click="action.clickHandler(deck._id)" :title="action.title">
        <b-icon :icon="action.icon" :style="{color: action.color}"></b-icon>
      </b-button>
    </div>
  </b-container>
</template>
<script>
import { Api } from '../Api'
export default {
  name: 'DeckCard',
  props: ['deck', 'actions'],
  data: function () {
    return {
      cardsDue: 0,
      cards: 0

    }
  },
  mounted: async function () {
    const res = await Api.get(`/decks/${this.deck._id}/cards/due`)
    this.cardsDue = res.data.length
  }
}
</script>
<style scoped>
div.deck-container {
  padding: 1rem 2rem;
  background: #fff;
  margin: 0;
  border-radius: 5px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.05);
  text-decoration: none;
  color: var(--black);
  transition: 0.2s;
  display: grid;
  grid-template-columns: 9fr 1fr;
  box-sizing: border-box;
}

.deck-container:hover  {
  box-shadow: 2px 3px 5px rgba(0, 0, 0, 0.1);
  text-decoration: none;
}

p {
  margin: 0;
  padding: 0;
}

.content-container {
  grid-column: 1/2;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-decoration: none;
  color: var(--black);
}

.badge {
  font-size: 0.9rem;
  padding: auto 0.5rem;
}

.badge-container {
  margin-left: 1rem;
}

.badge-primary {
  background: var(--primary);
}

.badge-secondary {
  background: var(--secondary-light);
  margin-left: 0.25rem;
}

.actions{
  text-align: right;
  display: flex;
  justify-content: flex-end;
}

.actions *, .actions *:focus, .actions *:hover {
  outline: none;
  border: none;
}

</style>
