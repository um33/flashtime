<template>
  <div class="no-decks">
    <img
      src="@/assets/images/curly-arrow.svg"
      alt="curly-arrow"
      class="svg-filter"
      :class="variant"
    />
    <p>{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: 'NoItems',
  props: ['variant', 'message']
}
</script>

<style>
.svg-filter {
  filter: invert(44%) sepia(13%) saturate(1521%) hue-rotate(177deg) brightness(94%) contrast(91%);
}

.svg-filter.secondary{
  filter: invert(69%) sepia(16%) saturate(1214%) hue-rotate(305deg) brightness(94%) contrast(79%);
}

.no-decks {
  margin-top: 3rem;
}

.no-decks p {
  color: var(--tertiary);
  font-size: 1.1rem;
  margin-top: 1rem;
}
</style>
