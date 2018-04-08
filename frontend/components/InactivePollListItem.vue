<template>
  <div :class="{ highlight: highlight }">
    <span>{{ answer.text}}</span>
    <span>{{ answer.votes }}</span>
  </div>
</template>

<script>
export default {
  name: 'InactivePollListItem',
  props: ['answer', 'highlight']
}
</script>

<style>
.highlight {
  border: 1px solid green;
}
</style>

