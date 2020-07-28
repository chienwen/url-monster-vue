<template>
  <div
    class="url-monster-comp"
    :class="{'is-active': isActive}"
    @mouseover="isHovering = true"
    @mouseout="isHovering = false"
  >
    <div class="url-monster-comp-title">
      <span class="title">
        <span v-if="comp.queryId" class="main">{{comp.queryId}}</span>
        <span :class="{meta: comp.queryId, main: !comp.queryId}">{{comp.type}}</span>
      </span>
      <span class="actions">
        <a
          v-if="!comp.isRequired"
          class="cta"
          @click="changeCompValue(undefined)"
        >delete</a>
        <a class="cta">copy</a>
        <a class="cta">paste</a>
      </span>
    </div>
    <div class="url-monster-comp-value">
      <input
        type="text"
        :value="comp.value"
        @input="changeCompValue($event.target.value)"
        @focus="onFocus($event.target)"
        @blur="isFocusing = false"
        class="url-monster-value"
      >
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';

export default {
  props: {
    comp: {
      type: Object,
      required: true
    }
  },
  methods: {
    ...mapActions(['setUrlComponent']),
    changeCompValue (val) {
      this.setUrlComponent({
        key: this.comp.key,
        value: val
      });
    },
    onFocus (target) {
      target.select();
      this.isFocusing = true;
    }
  },
  computed: {
    isActive () {
      return this.isHovering || this.isFocusing;
    }
  },
  data () {
    return {
      isHovering: false,
      isFocusing: false
    }
  }
}
</script>

<style lang="scss" scoped>
$color-blue-lightest: #ebf5fb;
$color-blue-light: #aed6f1;
$color-blue: #2e86c1;
$color-yellow-light: #f9e79f;
$color-yellow: #f4d03f;
$color-white: #fff;

.url-monster-comp {
  margin-bottom: 4px;
  border-radius: 4px;
  padding: 2px;
}
.url-monster-comp.is-active {
  background-color: $color-yellow-light;
}
.actions .cta {
  color: $color-blue;
  cursor: pointer;
}
.url-monster-value {
  width: -webkit-fill-available;
  background-color: $color-blue-lightest;
}
.url-monster-comp.is-active .url-monster-value {
  background-color: $color-yellow;
}
.url-monster-comp-title {
  display: flex;
  justify-content: space-between;
}
.url-monster-comp-title .title,
.url-monster-comp-title .actions {
  display: inline-block;
}
.url-monster-comp-title .title .meta {
  background-color: $color-blue;
  color: $color-white;
  opacity: 0.5;
  border-radius: 2px;
}
.url-monster-comp-title .title .main {
  font-weight: 700;
}
</style>
