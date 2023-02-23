import { formValidate, isValid } from '@/utils/helper/form-helper'
import { rgbaToHex,
  dateFormat,
  parseSize,
  camelize,
  camelToDash,
  removeStringSpace,
  currency,
  currencyWon,
  currencyNum,
  currencyKor,
  thousand } from '@/utils/helper/format-helper'
import { cloneItem,
  objectValue,
  isEmptyObj,
  urlAppendFilter,
  colorToString } from '@/utils/helper/object-helper'

import SocialSharing from  'vue-social-sharing'

const lpPlugin = {
  install(Vue, options) {
    Vue.prototype.formValidate = formValidate;
    Vue.prototype.isValid = isValid;
    Vue.prototype.rgbaToHex = rgbaToHex;
    Vue.prototype.dateFormat = dateFormat;
    Vue.prototype.parseSize = parseSize;
    Vue.prototype.camelize = camelize;
    Vue.prototype.camelToDash = camelToDash;
    Vue.prototype.removeStringSpace = removeStringSpace;
    Vue.prototype.currency = currency;
    Vue.prototype.currencyWon = currencyWon;
    Vue.prototype.currencyNum = currencyNum;
    Vue.prototype.currencyKor = currencyKor;
    Vue.prototype.thousand = thousand;
    Vue.prototype.cloneItem = cloneItem;
    Vue.prototype.objectValue = objectValue;
    Vue.prototype.isEmptyObj = isEmptyObj;
    Vue.prototype.urlAppendFilter = urlAppendFilter;
    Vue.prototype.colorToString = colorToString;


    Vue.use(SocialSharing);

  }
};

export default lpPlugin;
