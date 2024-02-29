<template>
  <b-container fluid class="main-home-container">
    <Navbar />
    <b-container fluid class="home-container">
      <h1>The <span>Modern</span> Solution to Flashcards</h1>
      <p>Based on the scientifically proven spaced repitition method.</p>
      <div class="btn-container">
        <router-link to="/signup"
          ><b-button variant="primary">Sign up</b-button></router-link
        >
        <router-link to="/login"
          ><b-button variant="secondary">Log in</b-button></router-link
        >
      </div>
      <div class="custom-shape-divider-bottom-1665711853">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            class="shape-fill"
          ></path>
        </svg>
      </div>
    </b-container>
  </b-container>
</template>

<script>
import Navbar from '../components/Navbar.vue'
export default {
  name: 'Home',
  components: { Navbar },
  mounted: function () {
    document.title = 'Flashtime - Home'
  }
}
</script>

<style scoped>
.main-home-container{
  padding: 0;
}
.home-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  justify-content: center;
  align-items: center;
  font-family: 'Montserrat', sans-serif;
  color: var(--black);
  max-width: 900px;
}

.home-container h1 {
  font-weight: 700;
  font-size: 3rem;
}

.home-container p {
  font-size: 1.25rem;
  max-width: 50%;
}

.home-container h1 span {
  color: var(--primary);
}

.image-container {
  width: 100%;
  margin-top: 5rem;
  align-self: flex-end;
}

.image-container img {
  width: 30%;
  min-width: 400px;
}

.btn{
  margin: 0.5rem;
  min-width: 150px;
  padding: 0.75rem;
  box-sizing: border-box;
  border: none;
}

.btn.btn-primary{
  background: var(--primary);
}

.btn.btn-primary:hover{
  background: var(--primary-dark);
}

.btn.btn-secondary{
  background: var(--secondary-light);
}

.btn.btn-secondary:hover{
  background: var(--secondary);
}

.home-container h1 span {
  text-align: center;
  background: linear-gradient(to right, var(--secondary-light) 20%, var(--primary) 40%, var(--primary) 60%, var(--secondary-light) 80%);
  background-size: 200% auto;
  color: #000;
  background-clip: text;
  text-fill-color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shine 3s linear infinite;
}

@keyframes shine {
    to {
      background-position: 200% center;
    }
  }

.custom-shape-divider-bottom-1665711853 {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    line-height: 0;
    transform: rotate(180deg);
}

.custom-shape-divider-bottom-1665711853 svg {
    position: relative;
    display: block;
    width: calc(135% + 1.3px);
    height: 307px;
}

.custom-shape-divider-bottom-1665711853 .shape-fill {
    fill: #0D47A1;
}

/** For mobile devices **/
@media (max-width: 767px) {
    .custom-shape-divider-bottom-1665711853 svg {
        width: calc(152% + 1.3px);
        height: 122px;
    }
}
</style>
