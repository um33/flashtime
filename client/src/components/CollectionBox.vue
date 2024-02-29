<template>
  <div>
    <div class="box">
      <p>{{ collection.name }}</p>

      <button class="delete" @click="removeCollection">
        Delete
      </button>
      <b-button @click="clickHandler">Edit</b-button>
    </div>
  </div>
</template>
<script>
import { Api } from '../Api'
export default {
  name: 'CollectionBox',
  props: ['collection'],
  methods: {
    clickHandler: function () {
      this.$emit('updateCurrentCollection', this.collection)
    },
    removeCollection: async function () {
      try {
        const res = await Api.delete(`/collections/${this.collection._id}`)
        if (res.status.code !== 204) throw new Error()
        this.$emit('removeCollection', this.collection._id)
      } catch (err) {
        console.error(err)
      }
    }
  }
}
</script>
<style scoped>
.box {
  margin-left: 11%;
  width: 200px;
  height: 100px;
  border: none;
  background: transparent;
  box-shadow: 0px 0px 16px rgba(168, 83, 83, 0.25);
  background-color: rgba(225, 225, 225, 0.75);
}
</style>
