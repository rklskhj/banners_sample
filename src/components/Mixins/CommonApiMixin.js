/*
master dev -> platform admin 
*/

import axios from 'axios'

const commonAxios = axios.create({
  headers: {
    common: {}
  }
});

export default {
  data() {
    return {
      request: {
        common: commonAxios
      }
    };
  },


  created() {
    this.request.common.defaults.headers.common['Authorization'] = '';
  }
}
