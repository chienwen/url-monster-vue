import * as types from './mutation-types'

export default {
  [types.SET_URL] (state, payload) {
    state.url = payload
  }
}
