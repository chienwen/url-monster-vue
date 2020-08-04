<template>
  <div class="url-monster-popup">
     <ParsedUrl />
  </div>
</template>

<script>

import ParsedUrl from '@/components/ParsedUrl.vue';
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';

export default {
  data () {
    return {};
  },
  components: {
    ParsedUrl
  },
  methods: {
    ...mapActions(['fetchUrl', 'initGATracking'])
  },
  created () {
    this.fetchUrl();
    this.initGATracking();
  }
}
</script>

<style lang="scss" scoped>
.url-monster-popup {
  width: 400px;
}
</style>
