<template>
  <div>
    <template v-if="true">
      <!-- <span v-for="(block, idx) in blocks" :key="block.number">
        <div :class="{ block: true, mined: block.number < currentBlock }">
          <span> {{ idx + 1 }} </span>
        </div>
      </span> -->
      <div class="flex-container">
        <!-- <div v-for="block in blockArray" :key="block.num">
          <div :class="{block: true, mined: block.mined}"></div>
        </div> -->
        
      </div>
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
      return this.$store.state.blockChain.blockHeight
    },
    blocks() {
      return this.$store.state.blocks
    },
    // blockMined(block) {
    //   if (block.num > this.currentBlock) return true
    //   return false
    // },
    // doesn't work
    blockArray() {
      return []
      // let result = []
      // for(let i = this.startBlock; i < this.endBlock; i++) {
      //   const block = {
      //     num: i,
      //     mined: i > parseFloat(this.currentBlock) ? true : false
      //   }
      //   result.push(block)
      // }
      // return result
    },
  },
}
</script>

<style>
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
</style>
