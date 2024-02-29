<template>
    <b-container fluid class="no-revisions">
        <b-icon icon="check-all"></b-icon>
        <p>Nothing to revise. You are all done.</p>
    </b-container>
</template>

<script>
export default {
  name: 'NoRevisions'
}
</script>

<style scoped>
.no-revisions{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.05);
  margin: 1rem auto;
  height: 100%;
  border-radius: 5px;
}

.no-revisions .bi-check-all{
  font-size: 3rem;
  color: var(--green);
}

.no-revisions p{
  font-size: 1.1rem;
  color: var(--tertiary);
}

</style>
