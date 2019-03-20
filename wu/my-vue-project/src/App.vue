<template>
  <div id="app">
    <img src="./assets/logo.png">
    <!--<Test></Test>
    <hello></hello>-->
    <Example></Example>
    <Huluanone></Huluanone>
    <!--<Cascader></Cascader>-->
    <MultipleChoice></MultipleChoice>
  </div>
</template>

<script>
import Test from './components/Test'
import Hello from './components/Hello'
import Example from './components/Example'
// import Cascader from './components/Cascader'
import Huluanone from './components/Huluanone'
import MultipleChoice from './components/MultipleChoice'

export default {
  components: {
    // Hello, 
    // Test
     Example,
     Huluanone,
     MultipleChoice,
    //  Cascader

  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
