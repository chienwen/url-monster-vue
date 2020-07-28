import * as types from './mutation-types'

export default {
  [types.SET_URL] (state, payload) {
    state.url = payload;
  },
  [types.SET_URL_COMP] (state, payload) {
    state.urlComponents = payload;
  },
  [types.SET_IS_PARSE_ERROR] (state, payload) {
    state.isParseError = payload;
  },
  [types.SET_CURRENT_TAB_INFO] (state, payload) {
    state.currentTabId = payload.id;
    state.currentTabUrl = payload.url;
  }
}
