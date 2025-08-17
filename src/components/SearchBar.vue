<template>
  <div class="search-bar">
    <input
      type="text"
      v-model="query"
      @input="onSearch"
      placeholder="Cari negara..."
      class="search-input"
    />
    <button @click="clearSearch" class="clear-btn">×</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: '',
    };
  },
  methods: {
    onSearch() {
      this.$emit('search', this.query);
    },
    clearSearch() {
      this.query = '';
      this.onSearch();
    },
  },
};
</script>

<style>
.search-bar {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 20px;
  padding: 5px 10px;
  background-color: #f9f9f9;
}
.search-input {
  flex-grow: 1;
  border: none;
  outline: none;
  padding: 5px;
  border-radius: 15px;
}
.clear-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
}
</style>

