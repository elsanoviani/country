<template>
  <div class="container">
    <h1 class="title">Country</h1>

    <div class="search-wrapper">
      <input
        v-model="query"
        type="text"
        placeholder="Search country..."
        class="search-box"
        @input="fetchSuggestions"
      />
      <span class="search-icon">🔍</span>

      <!-- Suggestion List -->
      <ul v-if="suggestions.length" class="suggestions">
        <li
          v-for="country in suggestions"
          :key="country.cca3"
          @click="goToDetail(country.name.common)"
          class="suggestion-item"
        >
          {{ country.name.common }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const query = ref('')
const suggestions = ref([])
const router = useRouter()

async function fetchSuggestions() {
  if (query.value.length < 2) {
    suggestions.value = []
    return
  }

  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${query.value}`)
    if (!res.ok) return
    const data = await res.json()
    suggestions.value = data.slice(0, 5) // ambil max 5 suggestion
  } catch (e) {
    console.error(e)
    suggestions.value = []
  }
}

function goToDetail(name) {
  suggestions.value = []
  query.value = ''
  router.push(`/country/${name}`)
}
</script>

<style scoped>
.container {
  background: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.title {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 20px;
  color: black;
}

.search-wrapper {
  position: relative;
  width: 350px;
}

.search-box {
  width: 100%;
  padding: 12px 40px 12px 12px;
  border: 2px solid #7c3aed; /* ungu */
  border-radius: 6px;
  font-size: 16px;
  outline: none;
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #7c3aed;
}

.suggestions {
  margin-top: 5px;
  list-style: none;
  padding: 0;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  max-height: 200px;
  overflow-y: auto;
}

.suggestion-item {
  padding: 10px;
  cursor: pointer;
}

.suggestion-item:hover {
  background: #f0f0f0;
}
</style>
