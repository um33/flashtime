<template>
  <b-col class="logo-container">
    <p id="logoText">flashtime</p>
  </b-col>
</template>

<script>
export default {
  name: 'TextLogo'
}
</script>

<style scoped>
p {
  font-weight: 300;
  font-size: 2.5rem;
  background: linear-gradient(
    to right,
    var(--secondary-light) 20%,
    var(--primary) 40%,
    var(--primary) 60%,
    var(--secondary-light) 80%
  );
  background-clip: text;
  text-fill-color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  width: fit-content;
  text-align: center;
  margin: 0 auto;
  margin-bottom: 3rem;
  color: var(--primary);
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}
</style>
