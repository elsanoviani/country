<template>
  <div class="border p-4 rounded shadow">
    <img :src="country.flag" alt="flag" class="w-full h-32 object-cover rounded"/>
    <h2 class="font-bold mt-2">{{ country.name }}</h2>
    <p>Population: {{ country.population }}</p>
    <p>Region: {{ country.region }}</p>
    <p>Capital: {{ country.capital }}</p>
  </div>
</template>

<script>
export default {
  name: "CountryCard",
  props: { country: Object },
};
</script>
