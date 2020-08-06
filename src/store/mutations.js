import * as types from './mutation-types'

const CONST_MAX_LOG_AGE_SEC = 86400 * 90;

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
  },
  [types.SET_USAGE_STATISTIC_ALL] (state, payload) {
    const cleanedDict = {};
    const tsNow = Math.floor((new Date()).getTime() / 1000);
    Object.keys(payload).forEach((domain) => {
      const cleanedDomainDict = {};
      Object.keys(payload[domain]).forEach((key) => {
        const ts = payload[domain][key];
        if (tsNow - ts <= CONST_MAX_LOG_AGE_SEC) {
          cleanedDomainDict[key] = ts;
        }
      });
      if (Object.keys(cleanedDomainDict).length > 0) {
        cleanedDict[domain] = cleanedDomainDict;
      }
    });
    state.usageStatistic = payload;
    state.usageStatisticFixed = JSON.parse(JSON.stringify(payload));
  },
  [types.SET_USAGE_STATISTIC_ONE] (state, payload) {
    if (!state.usageStatistic[payload.domain]) {
      state.usageStatistic[payload.domain] = {};
    }
    state.usageStatistic[payload.domain][payload.use] = Math.floor((new Date()).getTime() / 1000);
  }
}
