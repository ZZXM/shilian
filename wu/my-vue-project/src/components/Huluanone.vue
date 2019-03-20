<template>
  <div id="hu">
    <p>{{mess}}</p>
    <input v-model="mess">
  </div>

</template>

<script>
export default {
  name:"hu",
  data () {
    return {
      mess: 'Welcome to Your Chat App'
    }
  }
}
</script>


<style >

</style>
