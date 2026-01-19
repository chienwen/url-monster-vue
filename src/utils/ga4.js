const GA4_MEASUREMENT_ID = 'G-X6YF6S9GM9';
const GA4_API_SECRET = process.env.GA4_API_SECRET || '';
const GA4_ENDPOINT = `https://www.google-analytics.com/mp/collect?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${GA4_API_SECRET}`;

let clientId = null;

const getClientId = async () => {
  if (clientId) return clientId;

  const result = await chrome.storage.local.get('ga_client_id');
  if (result.ga_client_id) {
    clientId = result.ga_client_id;
  } else {
    clientId = `${Date.now()}.${Math.random().toString(36).substring(2)}`;
    await chrome.storage.local.set({ ga_client_id: clientId });
  }
  return clientId;
};

export const trackEvent = async (eventName, eventParams = {}) => {
  try {
    const cid = await getClientId();

    const payload = {
      client_id: cid,
      events: [{
        name: eventName,
        params: {
          ...eventParams,
          engagement_time_msec: '100'
        }
      }]
    };

    await fetch(GA4_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  } catch (error) {
    console.error('GA4 tracking error:', error);
  }
};

export const trackPageView = async (pagePath, pageTitle = '') => {
  await trackEvent('page_view', {
    page_location: pagePath,
    page_title: pageTitle
  });
};

export const trackError = async (errorType, errorContext = '') => {
  await trackEvent('error', {
    error_type: errorType,
    error_context: errorContext
  });
};
