<template>
  <div>
    <div>
      <span>{{comp.type}}</span>
      <span v-if="comp.queryId">{{comp.queryId}}</span>
      <span class="actions">
        <a @click="changeCompValue('')">empty</a>
        <a @click="changeCompValue(undefined)">delete</a>
      </span>
    </div>
    <div>
      <input
        type="text"
        :value="comp.value"
        @input="changeCompValue($event.target.value)"
      >
    </div>
  </div>
</template>

<script>

export default {
  props: {
    comp: {
      type: Object,
      required: true
    }
  },
  methods: {
    changeCompValue (val) {
      console.log('new val', val);
    }
  },
  data () {
    return {}
  }
}
</script>

<style lang="scss" scoped>
</style>
