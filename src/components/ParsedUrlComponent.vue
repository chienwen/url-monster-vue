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
        <label v-if="comp.type === 'query'">
          <input type="checkbox" v-model="isRawQueryValue" @click="onRawClick(); trackUsage();">raw
        </label>
        <a
          v-if="!comp.isRequired"
          class="cta"
          @click="changeCompValue(undefined)"
          title="delete this component"
        >del</a>
        <a
          v-if="comp.type === 'query'"
          class="cta"
          @click="copyToClipboard(comp.queryId + '=' + comp.value); trackUsage();"
          title="copy key-value pair to clipboard"
        >cKV</a>
        <a
          class="cta"
          @click="copyToClipboard(comp.value); trackUsage();"
          title="copy value to clipboard"
        >cV</a>
      </span>
    </div>
    <div class="url-monster-comp-value">
      <input
        type="text"
        :value="getValue"
        @input="changeCompValue($event.target.value)"
        @focus="onFocus($event.target); trackUsage();"
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
    ...mapActions(['setUrlComponent', 'copyToClipboard', 'addUsageRecord']),
    changeCompValue (val) {
      if (val && this.comp.type === 'query' && !this.isRawQueryValue) {
        val = encodeURIComponent(val);
      }
      this.setUrlComponent({
        key: this.comp.key,
        value: val
      });
    },
    onFocus (target) {
      target.select();
      this.isFocusing = true;
    },
    onRawClick () {
      if (this.isRawQueryValue) {
        // raw from un-clicked to clicked
        // try to encode if already decoded
        if (this.comp.value === decodeURIComponent(this.comp.value)) {
          this.changeCompValue(encodeURIComponent(this.comp.value));
        }
      }
    },
    trackUsage () {
      this.addUsageRecord(this.comp.type === 'query' ? 'query:' + this.comp.queryId : this.comp.type);
    }
  },
  computed: {
    isActive () {
      return this.isHovering || this.isFocusing;
    },
    getValue () {
      let value = this.comp.value;
      if (this.comp.type === 'query' && !this.isRawQueryValue) {
        value = decodeURIComponent(value);
      }
      return value;
    }
  },
  data () {
    return {
      isHovering: false,
      isFocusing: false,
      isRawQueryValue: false
    }
  }
}
</script>

<style lang="scss" scoped>
$color-red: #e74c3c;
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
  margin: 0 -2px;
}
.url-monster-comp.is-active {
  background-color: $color-yellow-light;
}
.actions {
  text-align: right;
}
.actions .cta {
  color: $color-blue;
  cursor: pointer;
}
.actions .cta:hover {
  text-decoration: underline;
}
.actions .cta:active {
  color: $color-red;
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
