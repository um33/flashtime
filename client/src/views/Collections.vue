<template>
  <div>
    <Navbar />
    <div class="main-container">
      <h2>Your Collections</h2>
      <div class="headers">
        <div>
          <InlineSearch @search="(value) => (query = value)" />
        </div>
        <div class="align-right">
          <b-form-select
            v-model="selected"
            @change="sort"
            :options="options"
            class="mr-3"
            value-field="item"
            text-field="name"
            disabled-field="notEnabled"
          ></b-form-select>
          <b-button @click="clickHandler">Create</b-button>
        </div>
      </div>
      <NoItems
        v-if="deckCollections.length === 0"
        message="You do not have any Collections. Click on Create to get started."
      />
      <div class="collections-container" v-else>
        <Collection
          v-for="collection in filteredCollections"
          :key="collection._id"
          :collection="collection"
          @removeCollection="removeCollection"
          @updateCurrentCollection="setCurrentCollection"
          :controls="true"
        />
      </div>
    </div>
    <CollectionModal
      :collection="currentCollection"
      @updateCollection="updateCollectionName"
    />
  </div>
</template>

<script>
import { Api } from '../Api'
import CollectionModal from '../components/CollectionModal.vue'
import Collection from '../components/Collection.vue'
import Navbar from '../components/Navbar.vue'
import NoItems from '../components/NoItems.vue'
import InlineSearch from '../components/InlineSearch.vue'

export default {
  data() {
    return {
      deckCollections: [],
      currentCollection: undefined,
      query: '',
      selected: 'Alphabetically',
      options: [
        { item: 'Alphabetically', name: 'Alphabetically' },
        { item: 'Newest to Oldest', name: 'Newest to Oldest' },
        { item: 'Oldest to Newest', name: 'Oldest to Newest' }
      ]
    }
  },
  components: { CollectionModal, Collection, Navbar, NoItems, InlineSearch },

  mounted: function () {
    this.fetchCollections()
  },
  methods: {
    fetchCollections: async function () {
      try {
        const res = await Api.get('/collections')
        this.deckCollections = res.data
        this.sort()
      } catch (err) {
        console.error(err)
      }
    },

    setCurrentCollection: function (newCollection) {
      this.currentCollection = newCollection
      this.$bvModal.show('collection-modal')
    },

    removeCollection: async function (collectionId) {
      this.deckCollections = this.deckCollections.filter(
        (c) => c._id !== collectionId
      )
    },
    clickHandler: function () {
      this.currentCollection = undefined
      this.$bvModal.show('collection-modal')
    },
    updateCollectionName: async function (collectionId, newName) {
      try {
        await Api.patch(`/collections/${collectionId}`, { name: newName })
        this.fetchCollections()
      } catch (err) {
        this.$vToastify.error('Something went wrong')
      }
    },
    sort: function () {
      switch (this.selected) {
        case 'Alphabetically':
          this.sortAlphabetically()
          break
        case 'Newest to Oldest':
          this.sortByNewest()
          break
        case 'Oldest to Newest':
          this.sortByOldest()
          break
        default:
          this.sortAlphabetically()
      }
    },
    sortAlphabetically: function () {
      this.deckCollections.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1
        }
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return 1
        }
        return 0
      })
    },
    sortByNewest: function () {
      this.deckCollections.sort((a, b) => {
        if (a.createdAt > b.createdAt) {
          return -1
        }
        if (a.createdAt < b.createdAt) {
          return 1
        }
        return 0
      })
    },
    sortByOldest: function () {
      this.deckCollections.sort((a, b) => {
        if (a.createdAt < b.createdAt) {
          return -1
        }
        if (a.createdAt > b.createdAt) {
          return 1
        }
        return 0
      })
    }
  },
  computed: {
    filteredCollections: function () {
      return this.deckCollections.filter((collection) =>
        collection.name.toLowerCase().includes(this.query.toLowerCase())
      )
    }
  }
}
</script>
<style scoped>
.main-container {
  max-width: 900px;
  width: 100%;
  padding: 2rem;
}

.main-container h2{
  width: 100%;
  text-align: left;
}

.collections-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-gap: 1rem;
  margin-top: 1rem;
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

.headers .custom-select,
.headers .custom-select:focus {
  box-shadow: none;
  border: 0.5px solid rgba(212, 79, 95, 0.2);
  padding: 0.5rem auto;
}
.btn {
  background: var(--primary);
  color: white;
  font-size: 14px;
  min-width: 120px;
}

.btn:hover {
  background: var(--primary-dark);
  color: white;
}

@media screen and (max-width: 768px) {
  .headers {
    flex-direction: column;
  }

  .headers > .align-right {
    margin-top: 1rem;
    justify-content: space-between;
    width: 100%;
  }

  .headers > div:first-child {
    width: 100%;
  }
}
</style>
