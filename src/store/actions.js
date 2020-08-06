import * as types from './mutation-types';
import urlUtil from './url-utility';
const CHROME_STORAGE_MODE = 'local';
const CHROME_STORAGE_USAGE_STATISTIC_VERSION = 0;
const GA_TRACKING_ID = 'UA-110084363-6';

export const setFullUrl = ({ commit, state }, url) => {
  url = url.trim();
  const comps = urlUtil.getUrlComponents(url, state.usageStatisticFixed);
  commit(types.SET_URL_COMP, comps);
  commit(types.SET_URL, url);
  const isParseError = url && comps.length === 0;
  commit(types.SET_IS_PARSE_ERROR, isParseError);
  if (isParseError) {
    dispatch('trackGA', ['p_error', 'parse', 'furl']);
  }
};

export const fetchUrl = ({ commit, state, dispatch }, payload) => {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, (tabs) => {
    const url = tabs[0].url;
    commit(types.SET_CURRENT_TAB_INFO, tabs[0]);
    chrome.storage[CHROME_STORAGE_MODE].get('usageStatistic', res => {
      if (res.usageStatistic) {
        commit(types.SET_USAGE_STATISTIC_ALL, res.usageStatistic.d || {});
      }
      dispatch('setFullUrl', url);
    });
  });
};

export const setUrlComponent = ({ commit, state, dispatch }, payload) => {
  commit(types.SET_IS_PARSE_ERROR, false);
  const newComponents = [];
  let usageStatisticKey;
  if (payload.key) {
    state.urlComponents.forEach((comp) => {
      if (comp.key === payload.key) {
        if (payload.value !== undefined) {
          payload.value = urlUtil.fixComponentValue(comp.type, payload.value);
          const newComp = Object.assign({}, comp);
          newComp.value = payload.value;
          newComponents.push(newComp);
        }
        usageStatisticKey = comp.type === 'query' ? 'query:' + comp.queryId : comp.type;
      } else {
        newComponents.push(comp);
      }
    });
  } else {
    state.urlComponents.forEach((comp) => {
      newComponents.push(comp);
    });
    newComponents.push(payload);
    usageStatisticKey = payload.type === 'query' ? 'query:' + payload.queryId : payload.type;
  }
  if (usageStatisticKey) {
    dispatch('addUsageRecord', usageStatisticKey);
  }
  const newUrl = urlUtil.getUrl(newComponents);
  commit(types.SET_URL, newUrl);
  const validatedComponents = urlUtil.getUrlComponents(newUrl, state.usageStatisticFixed);
  if (validatedComponents.length > 0) {
    commit(types.SET_URL_COMP, validatedComponents);
  } else {
    commit(types.SET_URL_COMP, newComponents);
    commit(types.SET_IS_PARSE_ERROR, true);
    dispatch('trackGA', ['p_error', 'parse', 'comp']);
  }
};

export const resetUrl = ({ commit, state }) => {
  commit(types.SET_URL, state.currentTabUrl);
  commit(types.SET_URL_COMP, urlUtil.getUrlComponents(state.currentTabUrl, state.usageStatisticFixed));
  commit(types.SET_IS_PARSE_ERROR, false);
};

export const submitURL = ({ state }, isOpeningNewTab) => {
  if (isOpeningNewTab) {
    chrome.tabs.create({ url: state.url });
  } else {
    chrome.tabs.update(state.currentTabId, { url: state.url });
  }
  window.close();
};

export const copyToClipboard = (noUsed, text) => {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
};

export const compareUrl = ({ state }) => {
  chrome.tabs.create({ url: 'http://lilicoco.chienwen.net/app/urlMonster.html#u1=' + encodeURIComponent(state.url) });
};

export const addUsageRecord = ({ commit, state }, payload) => {
  let domain;
  state.urlComponents.forEach((comp) => {
    if (comp.key === 'host') {
      const domainTokens = comp.value.split('.');
      domain = domainTokens.splice(domainTokens.length - 2).join('.');
    }
  });
  if (domain) {
    commit(types.SET_USAGE_STATISTIC_ONE, {
      domain,
      use: payload
    });
    chrome.storage[CHROME_STORAGE_MODE].set({
      usageStatistic: {
        v: CHROME_STORAGE_USAGE_STATISTIC_VERSION,
        d: state.usageStatistic
      }
    });
  }
};

export const trackGA = (noUsed, payload) => {
  if (window._gaq) {
    // window._gaq.push(['_trackEvent', category, action, opt_label, opt_value, opt_noninteraction]);
    window._gaq.push(['_trackEvent'].concat(payload));
  }
};

export const initGATracking = ({ state, dispatch }, payload) => {
  payload = payload || 0;
  if (window._gaq) {
    window._gaq.push(['_setAccount', GA_TRACKING_ID]);
    let domain;
    state.urlComponents.forEach((comp) => {
      if (comp.key === 'host') {
        const domainTokens = comp.value.split('.');
        domain = domainTokens.splice(domainTokens.length - 2).join('.');
      }
    });
    window._gaq.push(['_trackPageview', '/popup' + (domain ? '/d/' + domain : '/e')]);
  } else if (payload < 20) {
    setTimeout(() => {
      dispatch('initGATracking', payload + 1);
    }, 500);
  }
};
