<template>
  <b-badge
    pill
    v-if="deck.deckCollection"
    :style="{ background: generateColor(deck.deckCollection._id) }"
    >{{ deck.deckCollection.name }}</b-badge
  >
</template>

<script>
export default {
  name: 'CollectionBadge',
  props: ['deck'],
  methods: {
    generateColor: function (id) {
      const colors = [
        '#00695c',
        '#00838f',
        '#0277bd',
        '#6a1b9a',
        '#4527a0',
        '#558b2f',
        '#d84315',
        '#2e7d32'
      ]
      const colorNum = id
        .match(/\d/g)
        .reduce((a, b) => parseInt(a) + parseInt(b))
      const chosenColor = colors[colorNum % colors.length]
      return chosenColor
    }
  }
}
</script>

<style scoped>
.badge {
  background: var(--primary);
  margin: 0;
  padding: 0.25rem 0.5rem;
  margin-left: 5px;
  align-self: center;
  text-transform: lowercase;
}
</style>
