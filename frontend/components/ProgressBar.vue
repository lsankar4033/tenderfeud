<template>
  <div class="outer">
    <template v-if="true">
      <div class="inner">
      <div v-if="blocksRemaining > 0">
        <span class="large">{{ blocksRemaining }}</span> blocks remaining
      </div>
      <div v-else>
        Poll complete
      </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'ProgressBar',
  props: ['startBlock', 'endBlock'],
  computed: {
    currentBlock() {
      return this.$store.state.blockChain.blockHeight
    },
    blocksRemaining() {
      const num = this.endBlock - this.currentBlock
      const result = num > 0 ? num : 0
      return result
    },
    percentage() {
      const total = this.endBlock - this.startBlock
      return `${100 - (this.blocksRemaining / total * 100)}%`
    },
    blocks() {
      return this.$store.state.blocks
    },
  },
}
</script>

<style scoped>
.flex-container {
  flex-wrap: wrap
}
.block {
  width: 14px;
  height: 14px;
  padding: 5px;
  margin: 2px;
  border: 1px solid black;
  /* background: black; */
  color: white;
  height: 100%
}
.mined {
  background: black;
}
.large {
  font-weight: 600;
  font-size: 14pt;
}
</style>
