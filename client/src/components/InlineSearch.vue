<template>
    <b-form-input @input="inputHandler" placeholder="Search..." :class="variant"></b-form-input>
</template>

<script>
export default {
  name: 'InlineSearch',
  props: ['variant'],
  methods: {
    inputHandler: function (value) {
      this.$emit('search', value)
    }
  }
}
</script>

<style scoped>

input[type="text"].form-control,
input[type="text"].form-control:focus{
  outline: none;
  border: none;
  background: none;
  box-shadow: none;
  color: var(--primary);
  border-bottom: 1px solid var(--primary);
  border-radius: 0;
  padding: 0;
}

input[type="text"].form-control.secondary,
input[type="text"].form-control.secondary:focus{
  outline: none;
  border: none;
  background: none;
  box-shadow: none;
  color: var(--secondary);
  border-bottom: 1px solid var(--secondary);
  border-radius: 0;
  padding: 0;
}

input[type="text"].form-control::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: var(--primary) !important;
  opacity: 1; /* Firefox */
}

input[type="text"].form-control.secondary::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: var(--secondary) !important;
  opacity: 1; /* Firefox */
}

</style>
