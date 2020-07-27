import * as types from './mutation-types';
import urlUtil from './url-utility';

export const fetchUrl = ({ commit }, payload) => {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, (tabs) => {
    const url = tabs[0].url;
    commit(types.SET_URL, url);
    commit(types.SET_URL_COMP, {
      action: 'all',
      data: urlUtil.getUrlComponents(url)
    });
  });
};
