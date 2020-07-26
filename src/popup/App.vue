<template>
  <div>
    <p>
      <ParsedUrl />
      {{ url }}
    </p>
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
    ...mapActions(['fetchUrl'])
  },
  computed: {
    ...mapState(['url'])
  },
  created () {
    this.fetchUrl();
  }
}
</script>

<style lang="scss" scoped>
p {
  font-size: 20px;
}
</style>
