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
    commit(types.SET_CURRENT_TAB_INFO, tabs[0]);
  });
};

export const setUrlComponent = ({ commit, state }, payload) => {
  commit(types.SET_IS_PARSE_ERROR, false);
  const newComponents = [];
  if (payload.key) {
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
  } else {
    state.urlComponents.forEach((comp) => {
      newComponents.push(comp);
    });
    newComponents.push(payload);
  }
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

export const resetUrl = ({ commit, state }) => {
  commit(types.SET_URL, state.currentTabUrl);
  commit(types.SET_URL_COMP, urlUtil.getUrlComponents(state.currentTabUrl));
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
