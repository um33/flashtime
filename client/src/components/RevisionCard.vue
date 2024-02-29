/* eslint-disable vue/no-mutating-props */ /* eslint-disable
vue/no-mutating-props */
<template>
  <div class="card-container" v-bind:class="{ flipped: cardFlipped }">
    <div class="card" @click="cardFlipped = !cardFlipped">
      <div
        :data-contentlength="card ? Math.floor(card.front.length / 7) : 0"
        class="card-face card-front"
      >
        <p>{{ card ? card.front : '' }}</p>
      </div>
      <div
        :data-contentlength="card ? Math.floor(card.back.length / 7) : 0"
        class="card-face card-back"
      >
        {{ card ? card.back : '' }}
      </div>
    </div>
    <div v-if="cardFlipped" class="flippedGroup">
      <p>Rate your level of ease with the question</p>
      <div class="btn-group" role="group" aria-label="First group">
        <button @click="handleClick" value="0" class="btn">0</button>
        <button @click="handleClick" value="1" class="btn">1</button>
        <button @click="handleClick" value="2" class="btn">2</button>
        <button @click="handleClick" value="3" class="btn">3</button>
        <button @click="handleClick" value="4" class="btn">4</button>
        <button @click="handleClick" value="5" class="btn">5</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CardRevision',
  props: ['card'],
  data() {
    return {
      cardFlipped: false
    }
  },
  methods: {
    async handleClick(e) {
      this.cardFlipped = false
      await new Promise((resolve) =>
        setTimeout(() => {
          this.$emit('nextCard', this.card._id, e.target.value)
          resolve()
        }, 200)
      )
    }
  }
}
</script>
<style scoped>
.card-container {
  background-color: transparent;
  width: 100%;
  height: 400px;
  perspective: 2000px;
}

.card {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
  border: none;
  cursor: pointer;
}

.card-container.flipped .card {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.card-face[data-contentlength='0'] {
  font-size: 1.75rem;
}
.card-face[data-contentlength='1'] {
  font-size: 1.5rem;
}
.card-face[data-contentlength='2'] {
  font-size: 1.3rem;
}
.card-face[data-contentlength='3'] {
  font-size: 1.2rem;
}
.card-face[data-contentlength='4'] {
  font-size: 1.1rem;
}
.card-face[data-contentlength='5'] {
  font-size: 1rem;
}
.card-face[data-contentlength='6'] {
  font-size: 0.9rem;
}
.card-face[data-contentlength='7'] {
  font-size: 0.8rem;
}

.card-back {
  background-color: #fff;
  transform: rotateY(180deg);
}

.card-front {
  background-color: #fff;
}

.btn-group {
  width: 100%;
}

.btn[value='0'] {
  background: #ef9a9a;
}

.btn[value='1'] {
  background: #ffab91;
}

.btn[value='2'] {
  background: #ffcc80;
}

.btn[value='3'] {
  background: #ffe082;
}

.btn[value='4'] {
  background: #a5d6a7;
}

.btn[value='5'] {
  background: #81c784;
}

.flippedGroup {
  margin-top: 1.5rem;
}
.flippedGroup p {
  margin: 0;
  margin-bottom: 0.5rem;
  color: var(--teritiary);
  font-style: italic;
}
</style>
