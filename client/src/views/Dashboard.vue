<template>
  <div class="dashboard-container">
    <Navbar />
    <b-container>
      <b-row>
        <TextLogo />
      </b-row>
      <b-row>
        <Searchbar @search="handleSearch"/>
      </b-row>
      <b-row>
        <RevisionDecksContainer />
      </b-row>
      <b-row>
        <TopCollections />
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Searchbar from '../components/Searchbar.vue'
import Navbar from '../components/Navbar.vue'
import TextLogo from '../components/TextLogo.vue'
import TopCollections from '../components/TopCollections.vue'
import RevisionDecksContainer from '../components/RevisionDecksContainer.vue'
export default {
  data() {
    return {
      deckCollections: []
    }
  },
  name: 'Dashboard',
  components: {
    Searchbar,
    Navbar,
    TextLogo,
    TopCollections,
    RevisionDecksContainer
  },
  methods: {
    handleSearch: function (query) {
      this.$router.push({ name: 'search', query: { query: query } })
    }
  },
  mounted: function () {
    document.title = 'Dashboard'
  }
}
</script>

<style scoped>
.dashboard-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  min-height: 100vh;
}
</style>
