import * as types from './mutation-types';
import urlUtil from './url-utility';

export const fetchUrl = ({ commit }, payload) => {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, (tabs) => {
    const url = tabs[0].url;
    commit(types.SET_URL, url);
    commit(types.SET_URL_COMP, urlUtil.getUrlComponents(url));
  });
};

export const setUrlComponent = ({ commit, state }, payload) => {
  commit(types.SET_IS_PARSE_ERROR, false);
  const newComponents = [];
  state.urlComponents.forEach((comp) => {
    if (comp.key === payload.key) {
      if (payload.value !== undefined) {
        payload.value = urlUtil.fixComponentValue(comp.type, payload.value);
        const newComp = Object.assign({}, comp);
        newComp.value = payload.value;
        newComponents.push(newComp);
      }
    } else {
      newComponents.push(comp);
    }
  });
  const newUrl = urlUtil.getUrl(newComponents);
  commit(types.SET_URL, newUrl);
  const validatedComponents = urlUtil.getUrlComponents(newUrl);
  if (validatedComponents.length > 0) {
    commit(types.SET_URL_COMP, validatedComponents);
  } else {
    commit(types.SET_URL_COMP, newComponents);
    commit(types.SET_IS_PARSE_ERROR, true);
  }
};
