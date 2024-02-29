<template>
  <b-container fluid class="nodecks-container">
    <b-icon icon="journals"></b-icon>
    <p>You have no decks, start by creating one.</p>
    <b-button variant="outlined" @click="handleCreate">New Deck</b-button>
  </b-container>
</template>

<script>
export default {
  name: 'NoDecks',
  methods: {
    handleCreate: async function () {
      const navigation = await this.$router.push({ name: 'decks' })
      if (navigation) this.$bvModal.show('deck-modal')
    }
  }
}
</script>

<style scoped>
.nodecks-container{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    background: #fff;
    margin: 1rem auto;
    border-radius: 5px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.05);
}

.nodecks-container p {
    margin: 0.5rem auto;
    font-size: 1.1rem;
    color: var(--tertiary);
}

.nodecks-container .bi-journals{
    color: var(--tertiary-light);
    font-size: 2rem;
}

.nodecks-container .btn{
    background: var(--secondary-light);
    color: white;
    padding: 4px auto;
    font-size: 14px;
}

</style>
