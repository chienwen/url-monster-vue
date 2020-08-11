const DEFAULT_QUERY_DELIMITER = '&';
const isTypeRequired = {
  scheme: true,
  host: true,
  path: true
};
const baseScore = {
  scheme: 15,
  user: 25,
  password: 24,
  host: 35,
  port: 30,
  path: 40,
  query: 50,
  fragment: 30
};
const SCORE_FACTOR = 86400 * 7;
export default {
  fixComponentValue: (type, value) => {
    if (isTypeRequired[type]) {
      value = value.trim();
    }
    if (type === 'path' && value === '') {
      value = '/';
    }
    return value;
  },
  getUrlComponents: (url, usageStatistic) => {
    const comps = [];
    const match = url.match(/^([^:]+):\/\/(([^@/:]+)(:([^@:/]+))?@)?([^/@:]+)(:([\d]+))?(\/[^?#]*)(\?([^?#]+))?(#(.*))?/);
    // const match = url.match(/^([^:]+):\/\/(([^@\/:]+)(:([^@:\/]+))?@)?([^\/@:]+)(:([\d]+))?(\/[^?]*)?(\?([^?#]+))?(#(.*))?/);
    /*
     * 0: "https://user:password@www.chienwen.net:234/path/a?a=1&b=2#fragment"
     * 1: "https"
     * 2: "user:password@"
     * 3: "user"
     * 4: ":password"
     * 5: "password"
     * 6: "www.chienwen.net"
     * 7: ":234"
     * 8: "234"
     * 9: "/path/a"
     * 10: "?a=1&b=2"
     * 11: "a=1&b=2"
     * 12: "#fragment"
     * 13: "fragment"
     */
    const regMappingExceptQuery = {
      1: 'scheme',
      3: 'user',
      5: 'password',
      6: 'host',
      8: 'port',
      9: 'path',
      13: 'fragment'
    };
    let domain;
    if (match) {
      Object.keys(regMappingExceptQuery).forEach((idx) => {
        if (match[idx] !== undefined) {
          const type = regMappingExceptQuery[idx];
          comps.push({
            key: type,
            type: type,
            value: match[idx],
            isRequired: !!isTypeRequired[type],
            score: baseScore[type]
          });
          if (type === 'host') {
            const domainTokens = match[idx].split('.');
            domain = domainTokens.splice(domainTokens.length - 2).join('.');
          }
        }
      });
      // query
      if (match[11]) {
        const uniqueQueryKeySeq = {};
        match[11].split(/[&;]/).forEach((queryPair) => {
          const tokens = queryPair.split('=');
          if (tokens.length >= 1) {
            const queryId = tokens[0];
            let querySeq = '';
            if (uniqueQueryKeySeq[queryId]) {
              querySeq = '-' + uniqueQueryKeySeq[queryId];
              uniqueQueryKeySeq[queryId] += 1;
            } else {
              uniqueQueryKeySeq[queryId] = 1;
            }
            comps.push({
              key: 'query-' + queryId + querySeq,
              type: 'query',
              queryId,
              value: tokens.splice(1).join('='),
              score: baseScore.query
            });
          }
        });
      }
      // add score
      if (usageStatistic[domain]) {
        const tsDict = usageStatistic[domain];
        comps.forEach((comp) => {
          const usageStatisticKey = comp.type === 'query' ? 'query:' + comp.queryId : comp.type;
          if (tsDict[usageStatisticKey]) {
            const sec = Math.floor((new Date()).getTime() / 1000) - tsDict[usageStatisticKey];
            comp.score += (Math.atan((-sec + SCORE_FACTOR) / SCORE_FACTOR) + Math.PI / 2) / 3 / Math.PI * 4000 * 10000;
          }
        });
      }
    }
    comps.sort((a, b) => b.score - a.score);
    return comps;
  },
  getUrl: (urlComponents) => {
    const dictExceptQuery = {};
    const queries = [];
    urlComponents.forEach((comp) => {
      if (comp.type === 'query') {
        queries.push(comp.queryId + '=' + comp.value);
      } else {
        dictExceptQuery[comp.type] = comp.value;
      }
    });
    let url = dictExceptQuery.scheme + '://';
    if (dictExceptQuery.user) {
      url += dictExceptQuery.user;
      if (dictExceptQuery.password) {
        url += ':' + dictExceptQuery.password;
      }
      url += '@';
    }
    url += dictExceptQuery.host;
    if (dictExceptQuery.port) {
      url += ':' + dictExceptQuery.port;
    }
    if (dictExceptQuery.path) {
      url += dictExceptQuery.path;
    }
    if (queries.length > 0) {
      url += '?' + queries.join(DEFAULT_QUERY_DELIMITER);
    }
    if (dictExceptQuery.fragment) {
      url += '#' + dictExceptQuery.fragment;
    }
    return url;
  },
  decodeURIComponent: (str) => {
    return decodeURIComponent(str.replace(/\+/g, '%20'));
  }
};
