<template>
  <div>
    {{ answer.text}}
    {{ answer.votes }}
  </div>
</template>

<script>
export default {
  name: 'InactivePollListItem',
  props: ['answer']
}
</script>

<style>

</style>

