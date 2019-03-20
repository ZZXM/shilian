<template>
    <div id="app">
        <currency label="Price" v-model="price"></currency>
        <currency label="Shipping" v-model="shipping"></currency>
        <currency label="Handling" v-model="handling"></currency>
        <currency label="Discount" v-model="discount"></currency>
        <p>Total: ${{ total }}</p>
    </div>

</template>

<script>
import Currency from './Currency'
export default {
  name: 'Text',
  data () {
    return {
        total: 0,
        price: 0,
        shipping: 0,
        handling: 0,
        discount: 0
    }
  },
  components: {
   Currency
  }
}
</script>


<style >

</style>
