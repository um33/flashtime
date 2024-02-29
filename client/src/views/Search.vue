<template>
  <b-container fluid>
    <Navbar />
    <b-container fluid class="main-container">
      <div class="search">
        <TextLogo/>
        <Searchbar :initial="$route.query.query" @search="handleSearch" />
      </div>
      <div class="decks-container">
        <h3>Decks</h3>
        <div class="no-results" v-if="decks.length === 0">
          <p>No decks matched your query</p>
        </div>
        <DeckCard v-for="deck in decks" :key="deck._id" :deck="deck" />
      </div>
      <div class="collections-container">
        <h3>Collections</h3>
        <div class="no-results" v-if="collections.length === 0">
          <p>No collections matched your query</p>
        </div>
        <Collection
          v-for="collection in collections"
          :key="collection._id"
          :collection="collection"
        />
      </div>
    </b-container>
  </b-container>
</template>

<script>
import { Api } from '../Api'
import Navbar from '../components/Navbar.vue'
import Searchbar from '../components/Searchbar.vue'
import DeckCard from '../components/DeckCard.vue'
import Collection from '../components/Collection.vue'
import TextLogo from '../components/TextLogo.vue'
export default {
  name: 'Search',
  data: function () {
    return {
      decks: [],
      collections: []
    }
  },
  components: { Navbar, Searchbar, DeckCard, Collection, TextLogo },
  methods: {
    searchQuery: async function (query) {
      try {
        const res = await Api.get(`/search?query=${query}`)
        this.decks = res.data.decks
        this.collections = res.data.collections
      } catch (err) {
        this.$vToastify.error('Something went wrong')
      }
    },
    handleSearch: function (query) {
      this.$router.replace({ name: 'search', query: { query: query } })
      this.searchQuery(query)
    }
  },
  mounted: function () {
    this.searchQuery(this.$route.query.query)
  }
}
</script>

<style scoped>
.main-container {
  max-width: 900px;
}
.search {
  width: 100%;
}

.search h2 {
  margin: 2rem 0;
}

.search >>> #logoText{
  margin-bottom: 1rem;
}

.search >>> #searchContainer{
  width: 100%;
  margin: 0;
}

h3 {
  text-align: left;
}

.decks-container {
  margin-top: 2rem;
}

.decks-container >>> .deck-container {
  margin-top: 0.8rem;
}

.collections-container {
  margin-top: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 1rem;
}

.collections-container h3 {
  grid-column: 1/-1;
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

.no-results {
  background: white;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.05);
  border-radius: 5px;
}

.no-results p {
  margin: 0;
  color: var(--tertiary);
}

.collections-container .no-results{
  grid-column: 1/-1;
}
</style>
