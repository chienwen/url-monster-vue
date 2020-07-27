import * as types from './mutation-types'

export default {
  [types.SET_URL] (state, payload) {
    state.url = payload;
  },
  [types.SET_URL_COMP] (state, payload) {
    if (payload.action === 'all') {
      state.urlComponents = payload.data;
    }
  }
}
