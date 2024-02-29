<template>
  <b-col cols="12" md="8" class="mx-auto mb-3 container" id="searchContainer">
    <b-form @submit="handleSubmit">
      <input type="text" v-model="query" placeholder="Search for decks and collections..."/>
    </b-form>
  </b-col>
</template>
<script>
export default {
  name: 'Searchbar',
  props: ['initial'],
  data() {
    return {
      query: ''
    }
  },
  methods: {
    handleSubmit: function (e) {
      e.preventDefault()
      this.$emit('search', this.query)
    }
  },
  mounted: function () {
    this.query = this.initial
  }
}
</script>
<style scoped>
input {
  width: 100%;
  padding: 15px 30px;
  padding-top: 20px;
  color: #313131;
  background: #fff;
  border: none;
  transition: 0.4s;
  border-radius: 30px;
  box-shadow: 2px 3px 5px rgba(0, 0, 0, 0.1);
}

input:focus {
  outline: none;
  box-shadow: 2px 8px 20px rgba(0, 0, 0, 0.2);
}

.input::after{
  content:'\F52A';
  display: block;
  width: 24px;
  height: 24px;
}

</style>
