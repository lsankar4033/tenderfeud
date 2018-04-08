<template>
  <div>
    <span>Hello</span>
    <button @click="increment">click me</button>
    {{ tenTimes }}
    <div class="spacer"></div>
  </div>
</template>

<script>
export default {
  name: 'Test',
  data() {
    return {
      foo: 100
    }
  },
  computed: {
    tenTimes() {
      return this.foo * 10
    }
  },
  methods: {
    increment() {
      this.foo++
    },
    asdf() {

    },
  },
}
</script>

<style>
.spacer {
  margin-bottom: 300px
}
</style>
