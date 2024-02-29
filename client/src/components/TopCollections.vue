<template>
  <b-col cols="12" md="8" class="mx-auto mt-5">
    <div class="header">
      <h2>Top Collections</h2>
      <b-button v-b-modal.collection-modal>Create</b-button>
    </div>
    <div class="no-collections" v-if="deckCollections.length === 0">
      <p>You have not created any collections yet</p>
    </div>
    <div class="collections-container" v-else>
      <Collection
        v-for="collection in deckCollections.slice(0, 9)"
        :key="collection._id"
        :collection="collection"
      />
    </div>
    <CollectionModal />
  </b-col>
</template>

<script>
import { Api } from '../Api'
import Collection from './Collection.vue'
import CollectionModal from './CollectionModal.vue'

export default {
  name: 'TopCollections',
  data: function () {
    return {
      deckCollections: []
    }
  },
  mounted: function () {
    Api.get('/collections')
      .then((res) => {
        this.deckCollections = res.data
          .sort((a, b) => a.createdAt < b.createdAt)
          .slice(0, 3)
      })
      .catch((err) => console.error(err))
  },
  components: { Collection, CollectionModal }
}
</script>

<style scoped>
h2 {
  font-size: 1.5rem;
  text-align: left;
  margin: 0;
}

.collections-container {
  display: grid;
  grid-template-columns: repeat(3, minmax(200px, 1fr));
  grid-gap: 1rem;
  width: 100%;
}

.header {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin: 1rem auto;
}

button,
button:focus,
button:hover {
  background: none;
  border: 1px solid var(--secondary);
  color: var(--secondary);
  padding: 0.25rem 1.5rem;
  outline: none;
  transition: 0.2s;
  border-radius: 5px;
  text-transform: uppercase;
  font-size: 14px;
}

button:hover {
  background: var(--secondary);
  color: #fff;
  border: 1px solid var(--secondary);
}

.no-collections {
  background: white;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.05);
  border-radius: 5px;
}

.no-collections p{
  margin: 0;
  color: var(--tertiary)
}

@media screen and (max-width: 1200px) {
  .collections-container {
    grid-template-columns: repeat(2, minmax(200px, 1fr));
  }
}

@media screen and (max-width: 768px) {
  .collections-container {
    grid-template-columns: 1fr;
  }
}
</style>
