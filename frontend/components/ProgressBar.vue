<template>
  <div>
    <template v-if="endBlock > currentBlock">
      <span v-for="(block, idx) in blocks" :key="block.number">
        <div :class="{ block: true, mined: block.number < currentBlock }">
          <span> {{ idx + 1 }} </span>
        </div>
      </span>
    </template>
    <template v-else>
      Poll Complete
    </template>
  </div>
</template>

<script>
export default {
  name: 'ProgressBar',
  props: ['startBlock', 'endBlock'],
  computed: {
    currentBlock() {
      return this.$store.state.currentBlock
    },
    blocks() {
      return this.$store.state.blocks
    },
    // doesn't work
    blockArray() {
      let result = []
      for(let i = 0; i < this.$store.state.currentBlock; i++) {
        result.push(i)
      }
      return result
    },
  },
}
</script>

<style>
.flex-container {
  align-items: flex-start;
}
.block {
  display: inline-block;
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
</style>
