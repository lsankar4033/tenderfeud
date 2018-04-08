<template>
  <div>
    <button @click="vote(answer)" class="button">{{ answer.text }}</button>
      <div class="vote-container">
      <span class="num-votes">{{ answer.votes }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActivePollListItem',
  props: ['answer', 'vote'],
}
</script>

<style>
.num-votes {
  position: absolute;
  color: white;
  background: red;
  padding: 2px 5px;
  border-radius: 50%;
  transform: translate(-14px, -28px)
}
</style>

