<template>
  <div class="collection-container">
    <router-link
      :to="{ name: 'collection', params: { id: collection._id } }"
      class="box"
      ><p>{{ collection.name }}</p>
      </router-link
    >
    <div class="actions" v-if="controls">
      <b-icon
        @click="clickHandler"
        icon="pencil"
        title="Edit Collection"
      ></b-icon>
      <b-icon
        @click="deleteCollection"
        icon="trash"
        title="Delete collection"
      ></b-icon>
    </div>
  </div>
</template>
<script>
import { Api } from '../Api'

export default {
  name: 'Collection',
  props: ['collection', 'controls'],
  methods: {
    clickHandler: function () {
      this.$emit('updateCurrentCollection', this.collection)
    },
    deleteCollection: async function () {
      try {
        await Api.delete(`/collections/${this.collection._id}`)
        this.$emit('removeCollection', this.collection._id)
      } catch (err) {
        this.$vToastify.error('Something went wrong')
      }
    }
  }
}
</script>
<style scoped>
.collection-container{
  position: relative;
  width: 100%;
}
.box {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: #fff;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.05);
  padding: 3rem;
  font-size: 1.1rem;
  border-radius: 8px;
  transition: 0.4s;
  text-decoration: none;
  color: var(--black);
  text-transform: capitalize;
}

.box:hover {
  box-shadow: 2px 3px 5px rgba(0, 0, 0, 0.1);
}

.box p{
  margin: 0;
  padding: 0;
}

.actions {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.actions .b-icon {
  font-size: 1.25rem;
  cursor: pointer;
  box-sizing: content-box;
  padding: 3px;
}
.actions .bi-trash {
  color: var(--secondary);
  margin-left: 0.3rem;
}

.actions .bi-pencil {
  color: var(--primary);
}
</style>
