<template>
  <div>
    <ParsedUrlComponent
      v-for="comp in urlComponents"
      :key="comp.key"
      :comp="comp"
    />
  </div>
</template>

<script>

import ParsedUrlComponent from '@/components/ParsedUrlComponent.vue';
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';

export default {
  components: {
    ParsedUrlComponent
  },
  computed: {
    ...mapState(['urlComponents'])
  },
  data () {
    return {}
  }
}
</script>

<style lang="scss" scoped>
</style>
