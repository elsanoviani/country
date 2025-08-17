<template>
  <div class="page">
    <div class="container">
      <button class="btn-back">
        <router-link to="/" class="back">← Back to Homepage</router-link>
      </button>

      <!-- Loading / Error -->
      <div v-if="loading" class="state">Loading country details…</div>
      <div v-else-if="error" class="state error">{{ error }}</div>

      <!-- Detail Layout -->
      <div v-else-if="country" class="detail">

        <!-- Top row: Flag + Name -->
        <div class="top-row">
            <div class="name-wrap">
                <h1 class="name">{{ country?.name?.common }}
                    <img
                    class="flag-inline"
                    :src="country?.flags?.png || country?.flags?.svg"
                    :alt="country?.name?.common"
                    />
                </h1>
                <h5><span class="badge">{{ country?.cca2 }} </span></h5>
            </div>
        </div>

        <!-- Row 1: Lat/Long & Capital/Region/Subregion -->
        <div class="row-top">
          <div class="container-row container-1">
            <p><span>Lat/Long:</span></p>
            <p><span class="number">{{ lat }}, {{ lng }}</span></p>
          </div>
          <div class="container-row container-2">
            <p><span>Capital:</span> {{ country?.capital?.[0] || '-' }}</p>
            <p><span>Region:</span> {{ country?.region || '-' }}</p>
            <p><span>Subregion:</span> {{ country?.subregion || '-' }}</p>
          </div>
        </div>

        <!-- Row 2: Calling Code & Currency (tooltip + hint) -->
        <div class="row-top">
          <div class="container-row container-3">
            <p class="label">Calling Code</p>
             <span class="number"> {{ callingCode || '-' }} </span> <br>
            <div
              class="chip has-tooltip"
              @mouseenter="ensureCallingList"
              @mouseleave="hideTooltip"
            >
              <span class="hint">
                {{ sameCalling.length }} country(ies) with this calling code
              </span>

              <div v-if="tooltip === 'calling'" class="tooltip">
                <ul>
                  <li v-for="c in sameCalling" :key="c.alpha3Code">{{ c.name }}</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="container-row container-4">
            <p class="label">Currency</p>
            <span class="number"> {{ currencyCode || '-' }} </span><br>
            <div
              class="chip has-tooltip"
              @mouseenter="ensureCurrencyList"
              @mouseleave="hideTooltip"
            >
              <span class="hint">
                {{ sameCurrency.length }} country(ies) with this currency
              </span>

              <div v-if="tooltip === 'currency'" class="tooltip">
                <ul>
                  <li v-for="c in sameCurrency" :key="c.alpha3Code">{{ c.name }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="state">No data.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// --- State ---
const country = ref(null)
const loading = ref(true)
const error = ref(null)

const sameCalling = ref([])
const sameCurrency = ref([])
const tooltip = ref(null)  // 'calling' | 'currency' | null

// --- Computed ---
const lat = computed(() => country.value?.latlng?.[0] ?? '-')
const lng = computed(() => country.value?.latlng?.[1] ?? '-')

const callingCode = computed(() => {
  const idd = country.value?.idd
  if (!idd?.root) return ''
  const suf = Array.isArray(idd.suffixes) && idd.suffixes.length ? idd.suffixes[0] : ''
  return `${idd.root}${suf}`
})

const currencyCode = computed(() => {
  const cur = country.value?.currencies
  if (!cur) return ''
  const keys = Object.keys(cur)
  return keys.length ? keys[0] : ''
})

const languages = computed(() => {
  const obj = country.value?.languages
  return obj ? Object.values(obj) : []
})

// --- Helpers ---
const formatNum = (n) => (typeof n === 'number' ? n.toLocaleString() : '-')

// --- Fetch country detail ---
onMounted(async () => {
  try {
    const name = route.params.name
    const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fullText=true`)
    if (!res.ok) throw new Error('Country not found')
    const data = await res.json()
    country.value = data[0]
  } catch (e) {
    error.value = e.message || 'Failed to load country'
  } finally {
    loading.value = false
  }
})

// --- Tooltip ---
async function ensureCallingList() {
  if (!callingCode.value) return
  tooltip.value = 'calling'
  const code = callingCode.value.replace('+', '')
  if (sameCalling.value.length) return
  try {
    const res = await fetch(`https://restcountries.com/v2/callingcode/${code}`)
    if (!res.ok) return
    sameCalling.value = await res.json()
  } catch {}
}

async function ensureCurrencyList() {
  if (!currencyCode.value) return
  tooltip.value = 'currency'
  if (sameCurrency.value.length) return
  try {
    const res = await fetch(`https://restcountries.com/v2/currency/${currencyCode.value}`)
    if (!res.ok) return
    sameCurrency.value = await res.json()
  } catch {}
}

function hideTooltip() {
  tooltip.value = null
}
</script>

<style scoped>
.page { 
    background: #ffffff; 
    min-height: 100vh; 
    display: flex; 
    justify-content: center; 
}
.container { 
    width: 100%; 
    max-width: 1100px; 
    padding: 24px; 
}
.back {
  display: inline-block;
  margin-bottom: 16px;
  text-decoration: none;
  color: #FFFFFF; 
  font-weight: 600;
  text-align: center;
}
.btn-back {
  display: inline-block;
  margin-bottom: 16px;
  text-decoration: none;
  color: #7c3aed;
  background-color:#7c3aed;
  text-align: center;
}
.state { 
    padding: 24px; 
    color: #555; 
}
.state.error { 
    color: #b00020; 
}
.detail { 
    background: #fff; 
    border-radius: 16px; 
    padding: 24px; 
    box-shadow: 0 8px 28px rgba(0,0,0,0.08); 
}

/* Top row: Flag + Name */
.top-row {
  display: flex;
  align-items: center; /* sejajar vertikal */
  gap: 16px; /* jarak antara bendera dan nama */
}

.flag-inline {
  width: 80px;  /* ukuran bendera di samping */
  height: auto;
  border-radius: 6px;
  border: 1px solid #e6e6e6;
}

.name-wrap {
  display: flex;
  flex-direction: column;
}

.official { 
    color: #6b7280; 
    margin: 6px 0; 
}
.badge { 
    padding: 4px 10px; 
    border-radius: 999px; 
    background: #ede9fe; 
    color: #6d28d9; 
    font-weight: 700; 
    font-size: 12px; 
}
.number{
    color: #7c3aed; /* ungu lembut */
    font-weight: 600;
    font-size: 52px; 
}

/* Row containers: */
.row-top { 
    display: flex; 
    gap: 16px; 
    margin-bottom: 16px; 
}
.container-row { 
    flex: 1; 
    padding: 16px; 
    border-radius: 12px; 
    background: #f9fafb; 
}
.container-2, .container-4 { 
    background: #f3f4f6; 
}

/* Chips + tooltips */
.chip { 
    display: inline-flex; 
    align-items: center; 
    gap: 8px; 
    padding: 8px 12px; 
    border-radius: 999px; 
    background: #f3f4f6; 
    font-weight: 600; 
    position: relative; 
    cursor: pointer; 
}
.chip.ghost { 
    background: #f9fafb; 
    border: 1px solid #e5e7eb; 
    color: #374151; 
    font-weight: 500; 
}
.chips { 
    display: flex; 
    flex-wrap: wrap; 
    gap: 8px; 
}
.label { 
    margin: 0 0 8px; 
    color: #6b7280; 
    font-weight: 700; 
    font-size: 13px; 
    text-transform: 
    uppercase; 
    letter-spacing: .04em;
}
.hint { 
    margin-left: 6px; 
    font-weight: 500; 
    color: #7c3aed; 
    font-size: 12px; 
}

/* Tooltip */
.tooltip { 
    position: absolute; 
    top: calc(100% + 8px); left: 0; 
    background: #111827; 
    color: #f9f9f9; 
    border-radius: 10px; 
    padding: 10px 12px; 
    max-height: 200px; 
    overflow-y: auto; 
    z-index: 10; 
}
.tooltip ul { 
    margin: 0; 
    padding: 0; 
    list-style: none; 
}
.tooltip li { 
    padding: 4px 0; 
    border-bottom: 1px solid rgba(255,255,255,.1); 
}
.tooltip li:last-child { 
    border-bottom: none; 
}

/* Responsive */
@media (max-width: 920px) {
  .top-row { 
    flex-direction: column; 
    align-items: flex-start; 
}
  .row-top { 
    flex-direction: column;
}
}
</style>
