<template>
    <div>
      <label v-if="label">{{ label }}</label>￥ 
      <input ref="input"
        v-bind:value="value"
        v-on:input="updateValue($event.target.value)"
        v-on:focus="selectAll"
        v-on:blur="formatValue"
      >
    </div>


</template>

<script>
export default {
  name: 'Text',
  props: {
    value: {
        type: Number,
        default: 0
    },
    label: {
        type: String,
        default: ''
    }
},
  data () {
    return {
    }
  },
  methods: {
        updateValue: function(value) {
            var result = currencyValidator.parse(value, this.value)
            if (result.warning) {
                this.$refs.input.value = result.value
            }
            this.$emit('input', result.value)
        },
        formatValue: function() {
            this.$refs.input.value = currencyValidator.format(this.value)
        },
        selectAll: function(event) {
            setTimeout(function() {
                event.target.select()
            }, 0)
        }
    }
}
</script>


<style >

</style>
