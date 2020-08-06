<template>
  <div>
    <div class="actions expand-row">
      <button
        class="btn"
        :disabled="isParseError"
        @click="submitURL(false); trackCTAClick('apply')"
      >Apply</button>
      <button
        class="btn"
        :disabled="isParseError"
        @click="submitURL(true); trackCTAClick('apply')"
      >New Tab</button>
      <button
        class="btn"
        @click="copyToClipboard(url); trackCTAClick('copy')"
      >Copy</button>
      <button
        class="btn"
        @click="resetUrl(); trackCTAClick('reset')"
        :disabled="currentTabUrl === url"
      >Reset</button>
      <button
        class="btn"
        @click="compareUrl(); trackCTAClick('compare')"
        :disabled="isParseError"
      >Compare</button>
    </div>
    <div>
      <input
        class="input-full-url"
        type="text"
        v-model="editFullUrl"
        @focus="$event.target.select(); trackGA(['p_furl', 'focus'])"
      >
    </div>
    <div v-if="isParseError" class="alert-error">
      Error: invalid URL format.
    </div>
    <div class="expand-row">
      <input
        type="text"
        placeholder="filter"
        class="input-filter"
        v-model="filterValue"
        @input="onInputFilter"
        ref="inputFilter"
      >
      <button :disabled="!filterValue" @click="filterValue = ''">clear</button>
    </div>
    <div class="url-comp-container">
      <ParsedUrlComponent
        v-for="comp in urlComponents"
        v-if="shouldShowAfterFilter(comp)"
        :key="comp.key"
        :comp="comp"
      />
    </div>
    <div>
      <div>
        New
        <label>
          <input
            type="radio"
            name="new-comp"
            value="query"
            v-model="newAddingType"
            @click="onClickNewType($event.target.value)"
          >query
        </label>
        <label>
          <input
            type="radio"
            name="new-comp"
            value="fragment"
            v-model="newAddingType"
            :disabled="hasFragmentAlready"
            @click="onClickNewType($event.target.value)"
          >fragment
        </label>
        <label>
          <input
            type="checkbox"
            :disabled="newAddingType !== 'query'"
            @click="onClickRaw"
            v-model="isNewAddingQueryValueRaw"
          >raw
        </label>
      </div>
      <div class="new-input expand-row">
        <input
          type="text"
          placeholder="key or k=v"
          :disabled="newAddingType === 'fragment'"
          @paste="onPasteNewQueryKey"
          @input="onInputNewQueryKey"
          @focus="$event.target.select()"
          v-model="newAddingKey"
          ref="newAddingKey"
        >
        <input
          type="text"
          placeholder="value"
          class="new-value"
          @focus="$event.target.select()"
          @input="manipulateNewValue"
          @paste="manipulateNewValue"
          v-model="newAddingValue"
          ref="newAddingValue"
        >
        <button
          :disabled="!newAddingKey.trim()"
          @click="addNewComponent"
        >Add</button>
      </div>
    </div>
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
    ...mapState(['url', 'urlComponents', 'isParseError', 'currentTabUrl']),
    hasFragmentAlready () {
      for (let i = 0; i < this.urlComponents.length; i++) {
        if (this.urlComponents[i].type === 'fragment') {
          return true;
        }
      }
      return false;
    },
    editFullUrl: {
      set(fullUrl) {
        this.setFullUrl(fullUrl);
        if (this.isFirstInputFullUrl) {
          this.trackGA(['p_furl', 'input']);
          this.isFirstInputFullUrl = false;
        }
      },
      get() {
        return this.url;
      }
    }
  },
  methods: {
    ...mapActions(['setUrlComponent', 'submitURL', 'copyToClipboard', 'resetUrl', 'compareUrl', 'trackGA', 'setFullUrl']),
    trackCTAClick (label) {
      this.trackGA(['p_cta', 'click', label]);
    },
    shouldShowAfterFilter (comp) {
      if (this.filterValue) {
        let strToSearch;
        if (comp.type === 'query') {
          strToSearch = comp.queryId + '=' + comp.value;
        } else {
          strToSearch = comp.type + '=' + comp.value;
        }
        return !!strToSearch.match(new RegExp(this.filterValue));
      } else {
        return true;
      }
    },
    onClickNewType (type) {
      if (type === 'query') {
        this.newAddingKey = '';
        // this.$nextTick does not work here
        setTimeout(() => {
          this.$refs.newAddingKey.focus();
        }, 100);
      } else {
        this.newAddingKey = '#';
        this.$refs.newAddingValue.focus();
      }
      this.isNewAddingQueryValueRaw = false;
    },
    addNewComponent () {
      let value = this.newAddingValue;
      if (this.newAddingType === 'query' && !this.isNewAddingQueryValueRaw) {
        value = encodeURIComponent(value);
      }
      this.setUrlComponent({
        type: this.newAddingType,
        queryId: this.newAddingType === 'query' ? this.newAddingKey : undefined,
        value
      });
      if (this.newAddingType === 'fragment') {
        this.newAddingType = 'query';
        this.newAddingValue = '';
        this.newAddingKey = '';
      }
      this.trackGA(['p_new', 'click', 'sm_' + this.newAddingType, this.isNewAddingQueryValueRaw ? 1 : 0]);
    },
    splitNewQueryKey (text, cb) {
      const match = text.split('=');
      if (match.length === 2) {
        this.trackGA(['p_new', 'split', cb ? 'input' : 'paste']);
        setTimeout(() => {
          this.newAddingKey = match[0];
          this.newAddingValue = match[1];
          this.manipulateNewValue();
          if (cb) {
            cb();
          }
        }, 100);
      }
    },
    onPasteNewQueryKey (e) {
      if (this.newAddingType === 'query') {
        this.splitNewQueryKey(e.clipboardData.getData('text'));
      }
    },
    onInputNewQueryKey (e) {
      if (this.newAddingType === 'query' && e.data === '=') {
        this.splitNewQueryKey(this.newAddingKey, () => {
          this.$refs.newAddingValue.focus();
        });
      }
    },
    onClickRaw () {
      if (this.isNewAddingQueryValueRaw) {
        this.newAddingValue = decodeURIComponent(this.newAddingValue);
      } else {
        this.newAddingValue = encodeURIComponent(this.newAddingValue);
      }
    },
    onInputFilter () {
      if (this.isFirstInputFilter) {
        this.trackGA(['p_filter', 'input']);
        this.isFirstInputFilter = false;
      }
    },
    manipulateNewValue () {
      if (this.newAddingValue && this.newAddingType === 'query' && !this.isNewAddingQueryValueRaw) {
        this.newAddingValue = decodeURIComponent(this.newAddingValue);
      }
    }
  },
  data () {
    return {
      filterValue: '',
      newAddingType: 'query',
      newAddingKey: '',
      newAddingValue: '',
      isNewAddingQueryValueRaw: false,
      isFirstInputFilter: true,
      isFirstInputFullUrl: true
    }
  },
  mounted () {
    this.$refs.inputFilter.focus();
  }
}
</script>

<style lang="scss" scoped>
$color-red: #e74c3c;
$color-red-light: #fadbd8;
$color-blue-lightest: #ebf5fb;

.alert-error {
  margin-bottom: 6px;
  background-color: $color-red-light;
  color: $color-red;
  padding: 6px;
  border-radius: 4px;
}
.expand-row {
  display: flex;
  justify-content: space-between;
}
.new-value {
  flex-grow: 2;
}
.input-full-url {
  width: -webkit-fill-available;
  background-color: $color-blue-lightest;
}
.input-filter {
  width: -webkit-fill-available;
}
.actions .btn {
  width: -webkit-fill-available;
  white-space: nowrap;
}
.url-comp-container {
  max-height: 360px;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
