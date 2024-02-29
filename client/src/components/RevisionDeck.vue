<template>
  <router-link :to="{ name: 'revise', params: { id: deck._id } }" class="mt-3 revision-container">
    <p>
      {{ deck.name }}
      <CollectionBadge :deck="deck" />
    </p>
    <div class="deck-info">
      <div>
        <p class="total-cards">{{ deck.cards.length }}</p>
        <p>cards</p>
      </div>
      <div>
        <p class="cards-due">{{ deck.cardsDue }}</p>
        <p>due</p>
      </div>
    </div>
  </router-link>
</template>

<script>
import CollectionBadge from './CollectionBadge.vue'
export default {
  name: 'Deck',
  props: ['deck'],
  components: { CollectionBadge }
}
</script>

<style scoped>
a {
  background: #fff;
  color: var(--black);
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 20px;
  text-decoration: none;
  border-radius: 8px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.05);
  transition: 0.2s;
}

a:hover {
  text-decoration: none;
  box-shadow: 2px 3px 5px rgba(0, 0, 0, 0.1);
  color: var(--black);
}

p {
  margin: 0;
}

p:first {
  display: flex;
  align-items: center;
}

a .deck-info {
  display: flex;
}

a .deck-info div:last-child {
  margin-left: 20px;
}

a .deck-info p {
  color: var(--tertiary);
}

a .deck-info p.total-cards {
  font-size: 20px;
  color: var(--primary);
}

a .deck-info p.cards-due {
  font-size: 20px;
  color: var(--red);
}
</style>
