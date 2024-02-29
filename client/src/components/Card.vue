<template>
  <div class="card">
    <div class="front">
      <p>{{ card.front }}</p>
    </div>
    <div class="back">
      <p>{{ card.back }}</p>
    </div>
    <div class="actions">
        <b-icon @click="clickHandler" icon="pencil" title="Edit card"></b-icon>
        <b-icon @click="deleteCard" icon="trash" title="Delete card"></b-icon>
      </div>
  </div>
</template>
<script>
import { Api } from '../Api'
export default {
  name: 'Card',
  props: ['card'],
  methods: {
    deleteCard() {
      Api.delete(`/cards/${this.card._id}`)
        // eslint-disable-next-line no-return-assign, vue/no-mutating-props
        .then(() => this.$emit('deleteCard', this.card._id))
        .catch((err) => console.error(err))
    },
    clickHandler: function () {
      this.$emit('setCurrentCard', this.card)
      this.$bvModal.show('cardModal')
    }
  }
}
</script>
<style scoped>
.card {
  width: 100%;
  display: grid;
  grid-template-columns: 2fr 3fr auto;
  text-align: left;
  padding: 2rem;
  border: none;
  background: #fff;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  transition: .2s;
}

.card:hover{
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.15);
}

.card p {
  width: 100%;
  margin: 0;
  padding: 0;
}

.card .front {
  border-right: 1px solid var(--tertiary-light);
}

.card .front p{
  margin-right: 1rem;
}

.card .back {
  margin: auto 1rem;
}

.actions {
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
.actions .bi-trash{
  color: var(--secondary);
  margin-left: 0.75rem;
}

.actions .bi-pencil{
  color: var(--primary);
}

@media screen and (max-width: 768px){
  .card{
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 3fr auto;
  }

  .card div{
    width : 100%;
    text-align: center
  }

  .card p {
    margin: 1rem 0;
  }
  .card .front {
    border-right: none;
    border-bottom: 1px solid var(--tertiary-light);
  }
}

</style>
