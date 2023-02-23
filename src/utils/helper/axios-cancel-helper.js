import axios from 'axios';

const cancelTokenSources = new Map();  // Define the cancel queue

axios.interceptors.request.use(config => { // Request the interceptor to join the request to the cancel queue
  if (!config.hasOwnProperty('cancelToken')) { // Exclude requests that don't require cancel
    const source = axios.CancelToken.source();

    cancelTokenSources.set(source.token, source.cancel); // join the cancel queue
    config.cancelToken = source.token;
  }

  return config;
}, error => Promise.reject(error));

axios.interceptors.response.use(res => { // Remove from the cancel queue in the response interceptor
  if (res.config.cancelToken) {
    cancelTokenSources.delete(res.config.cancelToken);
  }

  return res;
}, error => {
  if (axios.isCancel(error)) {
    cancelTokenSources.delete(error.message)
  }
  return Promise.reject(error)
});

export default cancelTokenSources;