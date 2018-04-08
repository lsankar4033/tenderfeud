<template>
  <div :class="{ highlight: highlight }">
    <div class="control">
      <div class="tags">
        <span class="tag is-medium set-width">{{ answer.text}} </span>
        <span class="tag is-primary">{{ answer.votes }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InactivePollListItem',
  props: ['answer', 'highlight']
}
</script>

<style>
/* .highlight {
  border: 1px solid green;
} */
.control {
  padding: 5px;
}
.set-width {
  width: 100px;
  overflow: hidden;
}
</style>

