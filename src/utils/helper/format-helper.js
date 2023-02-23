import tinycolor from 'tinycolor2'
import dayjs from 'dayjs'
import numeral from 'numeral'

function rgbaToHex(rgba) {
  if (rgba.a === 1)
    return tinycolor(rgba).toHexString().toUpperCase();
  return tinycolor(rgba).toHex8String().toUpperCase();
}

function dateFormat(dateString, format) {
  let date = dayjs(dateString);
  return date.format(format);
}

/**
 * '32x16' string to object.
 * @param {string} sizeString  - A string formatted as '32x16'
 * @returns {Object} - { width: int, height: int }
 */
function parseSize(sizeString) {
  const arr = sizeString.split('x');
  let size = {
    width: parseInt(arr[0]),
    height: parseInt(arr[1])
  };
  return size;
}

/**
 * 't0-e-text' string to camel case string.
 * @param {string} str  - A string as 't0-e-text'
 * @returns {string} - 't0EText'
 */

function camelize(str) {
  return str.replace(/\W+(.)/g, function(match, chr)
  {
    return chr.toUpperCase();
  });
}

function camelToDash(str) {
  return str.replace(/(^[A-Z])/, ([first]) => first.toLowerCase())
    .replace(/([A-Z])/g, ([letter]) => `-${letter.toLowerCase()}`)
}

// 문자열 모든 공백 제거
function removeStringSpace(str) {
  return str.replace(/(\s*)/g,'');
}

function currency(num) {
  return currencyNum(num) + '원';
}

function currencyWon(num) {
  num = parseInt(num);
  return '₩' + numeral(num).format('0,0');
}

function currencyNum(num) {
  num = parseInt(num);
  return numeral(num).format('0,0');
}

function currencyKor(value, unit) {
  if(!unit)
    unit = '원';
  let val = parseInt(value);
  if(val === 0)
    return `0${unit}`;

  let txt = '';
  let max_unit = 1000000000000;

  let unitTextArray = ['조 ','억 ','만 '];
  let utIdx = 0;
  while(max_unit >= 10000) {
    let divideVal = Math.floor(val / max_unit);
    if(divideVal>=1) {
      txt += numeral(divideVal).format('0,0') + unitTextArray[utIdx];
      val = val - divideVal*max_unit;
    }
    utIdx++;
    max_unit /= 10000;
  }
  if(val>0 || val === '') {
    txt += numeral(val).format('0,0');

  } else if (val === 0) {
    let txtArray = txt.split('');
    txtArray.pop();
    txt = txtArray.join('');
  }
  return `${txt}${unit ? unit : ''}`;
}

function thousand(num) {
  num = parseInt(num);
  if(num > 1000)
    return numeral(num).format('0.0a');
  else
    return numeral(num).format('0a');
}

function numToTime(num) {
  num = parseInt(num);
  return numeral(num).format('00:00:00');
}

export {
  rgbaToHex,
  dateFormat,
  parseSize,
  camelize,
  camelToDash,
  removeStringSpace,
  currency,
  currencyWon,
  currencyNum,
  currencyKor,
  thousand,
  numToTime
}
