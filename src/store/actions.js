import * as types from './mutation-types';

export const fetchUrl = ({ commit }, payload) => {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, (tabs) => {
    commit(types.SET_URL, tabs[0].url);
  });
};
