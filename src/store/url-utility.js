const DEFAULT_QUERY_DELIMITER = '&';
const isTypeRequired = {
  scheme: true,
  host: true,
  path: true
};
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
  getUrlComponents: (url) => {
    const comps = [];
    const match = url.match(/^([^:]+):\/\/(([^@/:]+)(:([^@:/]+))?@)?([^/@:]+)(:([\d]+))?(\/[^?]*)(\?([^?#]+))?(#(.*))?/);
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
    if (match) {
      Object.keys(regMappingExceptQuery).forEach((idx) => {
        if (match[idx] !== undefined) {
          comps.push({
            key: regMappingExceptQuery[idx],
            type: regMappingExceptQuery[idx],
            value: match[idx],
            isRequired: !!isTypeRequired[regMappingExceptQuery[idx]]
          });
        }
      });
      // query
      if (match[11]) {
        let querySeqId = 0;
        match[11].split(/[&;]/).forEach((queryPair) => {
          const tokens = queryPair.split('=');
          if (tokens.length >= 2) {
            comps.push({
              key: 'query-' + querySeqId,
              type: 'query',
              queryId: tokens[0],
              value: tokens.splice(1).join('=')
            });
            querySeqId++;
          }
        });
      }
    }
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
  }
};
