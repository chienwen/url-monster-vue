<template>
  <div>
    <div v-if="isParseError" class="alert-error">
      Error: invalid URL format.
    </div>
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
    ...mapState(['urlComponents', 'isParseError'])
  },
  data () {
    return {}
  }
}
</script>

<style lang="scss" scoped>
$color-red: #e74c3c;
$color-red-light: #fadbd8;

.alert-error {
  margin-bottom: 6px;
  background-color: $color-red-light;
  color: $color-red;
  padding: 6px;
  border-radius: 4px;
}
</style>
