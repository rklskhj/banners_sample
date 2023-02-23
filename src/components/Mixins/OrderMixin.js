
export default {
  components: {

  },
  mixins: [

  ],
  props: {

  },
  data() {
  return {
    
  }
},
  created() {
   
  },
mounted() {

  },

  methods: {
    initialize() {
    // 동일 배송조건 sorting
    this.sortDeliveryId();
    // 테이블 rowspan 계산
    this.calcRowSpan();
    // 옵션에 selectorStocks 삽입
    this.addSelectorStocks();
    // 각 주문상품 총수량 계산
    this.calcOrderProductQuantity();
    // 각 주문상품 총 할인금액 계산
    this.calcOrderProductDiscountPrice();
    // 각 주문상품 총 상품금액 계산
    this.calcOrderProductPrice();
    // 각 주문상품 총 주문금액 계산
    this.calcOrderProductOrderPrice();
    // 각 주문상품 조건별 배송비 계산
    this.calcOrderProductDeliveryPrice();
    // 주문 합계 계산
    this.calcTotal();
  },
  sortDeliveryId() {
    // 배송조건id 순으로 sorting (같은 id끼리 묶기)
    this.value.order_product = this.value.order_product.sort(function(a,b) {
      return a.delivery_price.id - b.delivery_price.id
    })
  },
  calcRowSpan() {
    // rowspan default값 삽입
    this.value.order_product.forEach(item=> {
      item.rowspan = 0;
    })
    
    for(let i=0; i<this.value.order_product.length; i++) {
      this.value.order_product[i].rowspan = 1;
      // 배송비 부과방법(0: 배송비조건별, 1: 상품별)
      if(this.value.order_product[i].delivery_price.tax_method===1) {
        this.value.order_product[i].rowspan = 1;
        continue;
      }
      let j = 0;
      for(j=i+1; j<this.value.order_product.length; j++) {
        // 배송조건 번호가 같을 경우
        if(this.value.order_product[i].delivery_price.id === this.value.order_product[j].delivery_price.id) {
          this.value.order_product[i].rowspan += 1;
        }
        // 배송조건 번호가 다를 경우
        else {
          break;
        }
      }
      i = j-1;
    }
  },
  addSelectorStocks() {
    // 주문상품 array
    let orderproducts = this.value.order_product;
    
    // 각 order product 옵션에 selectorStocks 삽입
    for(let i=0; i<orderproducts.length; i++) {
      let options = orderproducts[i].order_product_option;
      let stocks = orderproducts[i].selectorStocks;
      
      for(let k=0; k<options.length; k++) {
        let item1 = options[k];
        item1.option = find(stocks, 'id', item1.option_id);
        console.log('item1',item1)
      }
    }
  },
  calcOrderProductQuantity() {
    // 각 주문상품 총수량 계산 (기본옵션의 총합)
    
    // 주문상품 array
    let orderproducts = this.value.order_product;
    
    // 각 order product의 수량 계산 (기본옵션의 총합)
    let new_orderproducts = [];
    orderproducts.forEach(item2 => {
      let options = item2.order_product_option;
      let op_total_quantity = 0;
      if (options.length===0) {
        op_total_quantity = item2.quantity;
      }
      else if (options.length>0) {
        let index = options.findIndex(option => option.option.option_type === 0);
        for(let j=0; j<options.length; j++) {
          if (options[j].option&&options[j].option.option_type===0) {
            op_total_quantity += options[j].quantity;
          } else if (options[j].option && options[j].option.option_type === 1) {
            if (index === -1) {
              op_total_quantity = item2.quantity + options[j].quantity;
            } else {
              op_total_quantity += options[j].quantity;
            }
          }
        }
      }
      item2.op_quantity = op_total_quantity;
      new_orderproducts.push(item2);
    })
    
    this.value.order_product = new_orderproducts;
  },
  calcOrderProductPrice() {
    // 각 주문상품 상품금액 계산
    
    // 주문상품 array
    let orderproducts = this.value.order_product;
    
    for(let i=0; i<orderproducts.length; i++) {
      let item = orderproducts[i];
      item.product_price = item.total_price;
      item.op_product_price = 0;
      let total_product_price = 0;
      // 상품 옵션
      if(item.order_product_option.length>0) {
        // let index = item.order_product_option.findIndex(option => option.option.option_type === 0);
        // if (index === -1) {
        //   total_product_price = item.product_price * item.quantity;
        // }

        for(let j=0; j<item.order_product_option.length; j++) {
          let option = item.order_product_option[j];
          let stock = find(item.selectorStocks, 'id', option.option_id);
          
          if ((option.soldout === false && !option.enable_stock) || (option.enable_stock && option.stock > 0)) {
            // console.log(stock, 'stock')

            if(stock&&stock.option_type===0) {
              total_product_price += stock.total_price * parseInt(option.quantity);
            }
            else total_product_price += stock.price * parseInt(option.quantity);
          }
        }
        if (item.op_discount_price > 0) {
          item.op_product_price = total_product_price;
        } else {
          item.op_product_price = total_product_price;
        }
      }
      // 자체상품 
      else {
        total_product_price = item.product_price * item.quantity;
        if (item.op_discount_price > 0) {
          item.op_product_price = total_product_price + item.op_discount_price;
        } else {
          item.op_product_price = total_product_price;
        }
      }
    }
  },
  calcOrderProductDiscountPrice() {
    
    // 주문상품 array
    let orderproducts = this.value.order_product;
    
    for(let i=0; i<orderproducts.length; i++) {
      let item = orderproducts[i];
    
      // 각 주문상품 할인금액 계산
      let total_discount_price = 0;
      let price = item.product.price;
      if(!price.is_discount) item.discount_price = 0;
      else {
        if(price.discount_type===0) {
          item.discount_price = Math.round(price.price * (price.discount_rate / 100))
        } else {
          item.discount_price = price.discount_price;
        }
      }
      if(item.order_product_option.length>0) {
        for(let j=0; j<item.order_product_option.length; j++) {
          let option = item.order_product_option[j];
          let stock = find(item.selectorStocks, 'id', option.option_id);
          if (stock) {
            option.soldout = stock.soldout;
          }
          if ((option.soldout === false && !option.enable_stock) || (option.enable_stock && option.stock > 0)) {
            if(!option.option) return total_discount_price
            if (option.option&&option.option.option_type===0) {
              total_discount_price += (item.discount_price * option.quantity)
            }
          }
        }
      }
      else {
        total_discount_price = item.discount_price * item.quantity;
      }
      //console.log(total_discount_price, 'total_discount_price')
      item.op_discount_price = total_discount_price;
    }
  },
  calcOrderProductOrderPrice() {
    // 주문상품 array
    let orderproducts = this.value.order_product;
    
    for(let i=0; i<orderproducts.length; i++) {
      let item = orderproducts[i];
      item.op_order_price = item.op_product_price - item.op_discount_price;        
    }
  },
  calcOrderProductDeliveryPrice() {
    // 주문상품 array
    let orderproducts = this.value.order_product;
    
    for(let idx=0; idx<orderproducts.length; idx++) {
      let item = orderproducts[idx];
      let value = 0;
      if(item.rowspan===0) {
        value = 0;
      }
      else {        
        // 배송비 계산
        let dp = item.delivery_price;
        
        switch(dp.delivery_type) {
          // 고정 배송비
          case 0:
            value = dp.fix_price;
            break;
          // 배송비 무료
          case 1:
            break;
          // 금액별
          case 2:
            value = this.calcConditionalDeliveryPrice(orderproducts, item, 'op_order_price');
            break;
          // 수량별
          case 3:
            value = this.calcConditionalDeliveryPrice(orderproducts, item, 'op_quantity');
            break;
        }
        
      }
      
      
      // 일괄 처리
      // if(dp.delivery_setting_method===0) {
        /*switch(dp.delivery_type) {
          // 고정 배송비
          case 0:
            value = dp.fix_price;
            break;
          // 배송비 무료
          case 1:
            break;
          // 금액별
          case 2:
            console.log('??????')
            value = this.calcConditionalDeliveryPrice(orderproducts, item, 'op_order_price');
            break;
          // 수량별
          case 3:
            console.log('!!!!!!!')
            value = this.calcConditionalDeliveryPrice(orderproducts, item, 'op_quantity');
            break;
        }*/
      // }
      // 배송방식 개별 처리
      /*else {
        
      }*/
      if (!value) item.op_delivery_price = 0;
      else item.op_delivery_price = value;
    }
  },
  calcConditionalDeliveryPrice(orderproducts, item, attr) {
    
    let target = this.cloneItem(item);
    // 현재 택배만 가능 (정적처리)
    let price_attr = '';
    if (target.delivery_price.delivery_price_setting[0].price!==undefined) price_attr = 'price';
    else if (target.delivery_price.delivery_price_setting[0].parcel_price!==undefined) price_attr = 'parcel_price';
    
    let sum = target[attr];
    for(let i=0; i<orderproducts.length; i++) {
      let op = orderproducts[i];
      // 동일 배송 조건일 경우, 합계 계산
      if (op.delivery_price.id===target.delivery_price.id && target.uid!==op.uid) {
        sum += op[attr];
      }
      // 개별 배송 조건일 경우
      else {
      }
    }
    let conditions_arr = target.delivery_price.delivery_price_setting;
    let sorted_arr = conditions_arr.sort((a,b) => {return a.min<b.min ? -1 : a.min>b.min ? 1 : 0});
    delete(sorted_arr[sorted_arr.length-1].max);
    
    let delivery_target = sorted_arr.filter(con => {
      
      if(con.max!==undefined) {
        return sum>=con.min && sum<con.max;
      }
      else {
        return sum>=con.min;
      }
    });
    
    return delivery_target[0][price_attr];
  },
  // 합계 계산
  calcTotal() {
    let total_comm_price = 0;
    let total_point = 0;
    let total_discount_price = 0;
    let total_product_price = 0;
    let total_delivery_cost = 0;
    let total_coupon_price = 0;
    
    for(let i=0; i<this.value.order_product.length; i++) {
      let op = this.value.order_product[i];
      let delivery_price = this.value.order_product[0].delivery_price
      //console.log(this.value.order_product, 'order_product_test')
      // 장바구니 페이지에서 선택되지 않은 주문상품 예외처리 ( 합계에 포함 x )
      if(this.value.order_product[i].selected===false) {
        continue;
      }
      
      total_comm_price += op.comm_price * op.op_quantity;
      total_point += op.point * op.op_quantity;
      total_discount_price += op.op_discount_price;
      total_product_price += op.op_product_price;
      
      if(op.op_coupon_price && op.op_coupon_price>0) total_coupon_price += op.op_coupon_price;
    }
    
    this.value.order.comm_price = total_comm_price;
    this.value.order.point = total_point === 0 ? '' : total_point;
    this.value.order.discount_price = total_discount_price;
    this.value.order.product_price = total_product_price;
    this.value.order.delivery_cost = total_delivery_cost;
    this.value.order.coupon_price = total_coupon_price;
    this.value.order.total_price = total_product_price + total_delivery_cost - total_discount_price - total_coupon_price;
    this.value.order.order_price = this.value.order.total_price;
    
  },
  // 할인금액
  calcDiscountPrice(item) {
    let total_discount_price = 0;
    let price = item.product.price;
    if(!price.is_discount) item.discount_price = 0;
    if(price.discount_type===0) {
      item.discount_price = Math.round(price.price * (price.discount_rate / 100))
    }
    if(item.order_product_option.length>0) {
      item.order_product_option.forEach(option => {
        if(!option.option) return total_discount_price
        if (option.option&&option.option.option_type===0) {
          total_discount_price += (item.discount_price * option.quantity)
        }
      })
    }
    else {
      return item.discount_price * item.quantity;
    }
    return total_discount_price;
  },
  calcProductPrice(item) {
    // 상품금액 계산
    
    let total_product_price = 0;
    // 상품 옵션
    if(item.order_product_option.length>0) {
      item.order_product_option.forEach(option=> {
        let stock = find(item.selectorStocks, 'id', option.option_id);
        if(stock&&stock.option_type===0) {
          total_product_price += (item.total_price + stock.price) * parseInt(option.quantity);
        }
        else total_product_price += stock.price * parseInt(option.quantity);
      })
      item.product_price = total_product_price;
    }
    // 자체상품 
    else {
      total_product_price = item.total_price * item.quantity;
    }
    item.op_price = total_product_price;
    return total_product_price;
  },
  calcDeliveryPrice(item, index) {
    // 배송비 계산
    let dp = item.delivery_price;
    let rowspan = item.rowspan;
    if(rowspan===0) return;
    let value = 0;
    // 배송비 설정 방법이 일괄인지 개별인지에 따른 로직 처리
    // 일괄 처리
    if(item.delivery_price.delivery_setting_method===0) {
      switch(dp.delivery_type) {
        // 고정 배송비
        case 0:
          value = dp.fix_price;
          break;
        // 배송비 무료
        case 1:
          break;
        // 금액별
        case 2:
          value = this.calcClassify(item, index, 'total_price', 'price');
          break;
        // 수량별
        case 3:
          value = this.calcClassify(item, index, 'quantity', 'price');
          break;
      }
      return value;
    }
    // 개별 처리
    else {
      switch(dp.delivery_type) {
        // 고정 배송비
        case 0:
          let dp_setting = item.delivery_price.delivery_price_setting;
          break;
        // 배송비 무료
        case 1:
          break;
        // 금액별
        case 2:
          value = this.calcClassify(item, index, 'total_price', item.delivery_method + '_price')
          break;
        // 수량별
        case 3:
          value = this.calcClassify(item, index, 'quantity', item.delivery_method + '_price')
          break;
      }
    }
    item.delivery_cost = value;
      return value;
  },
  calcClassify(item, index, attr, price_attr) {
    // 분류별 계산
    // (주문상품, 인덱스, attr='수량, 금액', price_attr='parcel_price or cargo_price ... etc')
      let dp = item.delivery_price;
      let dp_setting = item.delivery_price.delivery_price_setting;
      let maxlength = index + item.rowspan;
      // 배송비조건별
      if(dp.tax_method===0) {
        let total = 0;
        for(let i=index; i<maxlength; i++) {
          total += parseInt(this.value.order_product[i][attr]);

        }
        for(let j=0; j<dp_setting.length; j++) {
          if(parseInt(dp_setting[j].min) <= total && total < parseInt(dp_setting[j].max)) {
            return parseInt(dp_setting[j][price_attr]);
          }
          // 마지막 조건일 경우 예외처리
          else if(j === dp_setting.length-1) {
            if(parseInt(dp_setting[j].min) <= total) return parseInt(dp_setting[j][price_attr]);
          }
        }
      }
      // 상품별
      else {
        let total = parseInt(this.value.order_product[index][attr]);
        for(let x=0; x<dp_setting.length; x++) {
          if(parseInt(dp_setting[x].min) <= total && total < parseInt(dp_setting[x].max)) {
            return parseInt(dp_setting[x][price_attr]);
          }
          // 마지막 조건일 경우 예외처리
          else if(x === dp_setting.length-1) {
            if(parseInt(dp_setting[x].min) <= total) return parseInt(dp_setting[x][price_attr]);
          }
        }
      }
  },
  totalDeliveryPrice() {
    let list = this.cloneItem(this.value.order_product);
    let order_product = [];
    for(let x=0; x<list.length; x++) {
      if(list[x].selected) {
        order_product.push(list[x]);
      }
    }
    // 배송조건id 순으로 SORTING
      order_product = order_product.sort(function(a,b) {
        return a.delivery_price.id - b.delivery_price.id
      })
      order_product.forEach(item=> {
        item.rowspan = 0;
      })
      for(let i=0; i<order_product.length; i++) {
        order_product[i].rowspan = 1;
        // 배송비 부과방법(0: 배송비조건별, 1: 상품별)
        if(order_product[i].delivery_price.tax_method===1) {
          order_product[i].rowspan = 1;
          continue;
        }
        let j = 0;
        for(j=i+1; j<order_product.length; j++) {
          // 배송조건 번호가 같을 경우
          if(order_product[i].delivery_price.id === order_product[j].delivery_price.id) {
            order_product[i].rowspan += 1;
          }
          // 배송조건 번호가 다를 경우
          else {
            break;
          }
        }
        i = j-1;
      }
    
      let total = 0;
      for(let i=0; i<order_product.length; i++) {
        if(order_product[i].rowspan>=1) {
          total += this.calcDeliveryPrice(order_product[i], i)
        }
      }
      return total;
  },
  totalQuantity(op) {
    // 총 수량 (기본옵션 수량 총 합계) 
    let result = 0;
    // 상품 옵션 있는 경우
    if(op.order_product_option.length>0) {
      let opts = op.order_product_option;
      let stocks = op.selectorStocks;
      let optArr = [];
      opts.forEach(item => {
        item.option = find(stocks, 'id', item.option_id);
        optArr.push(item);
      })
      optArr.forEach(opItem => {
        // 상품속성옵션
        if (opItem.option&&opItem.option.option_type===0) {
          result += opItem.quantity;
        }
      })
    }
    // 자체 상품일 경우
    else {
      result = op.quantity;
    }
    return result;
  },
  convertDeliveryMethodName(op) {
      let name = '';
      switch (op.delivery_method) {
        case 'parcel':
          name = '택배';
          break;
        case 'post':
          name = '등기 / 소포';
          break;
        case 'cargo':
          name = '화물배송';
          break;
        case 'visit':
          name = '방문수령';
          break;
        case 'quick':
          name = '퀵배송';
          break;
      }
      if(name) name = `(${name})`;
      return name;
  },
  optionType(selectorStocks, option_id) {
    if(!selectorStocks) return;
    let stock = find(selectorStocks, 'id', option_id);
    if (stock) return stock.option_type;
  },
  optionName(selectorStocks, option_id) {
    if(!selectorStocks) return;
    let stock = find(selectorStocks, 'id', option_id);
    //console.log(stock)
    if (stock) return stock.price > 0 ? `${stock.name}: +${stock.price}원` : `${stock.name}: ${stock.price}원`;
  },
  optionPrice(selectorStocks, totalPrice, option_id) {
    if(!selectorStocks) return;
    let stock = find(selectorStocks, 'id', option_id);
    if (stock) {
      if (stock.option_type === 0) {
        return totalPrice + stock.price;
      } else {
        return stock.price;
      }
    }
  },
  optionFullName(option) {
    return `${option.option.name}: +${option.option.price}원 / ${option.quantity}개`;
  },
  orderStatus(status) {
    switch(status) {
      case 100: name = '입금대기'; break;
      case 101: name = '결제완료'; break;
      case 102: name = '주문확정'; break;
      case 200: name = '상품준비중'; break;
      case 300: name = '배송대기'; break;
      case 301: name = '배송중'; break;
      case 302: name = '배송완료'; break;
      case 400: name = '구매확정'; break;
      case 500: name = '취소요청(승인대기)'; break;
      case 501: name = '취소승인(환불대기)'; break;
      case 502: name = '취소보류'; break;
      case 503: name = '취소완료(입금전 주문취소)'; break;
      case 504: name = '취소완료(환불 완료)'; break;
      case 505: name = '취소요청철회'; break;
      case 600: name = '교환요청(승인대기)'; break;
      case 601: name = '교환처리중(수거진행)'; break;
      case 602: name = '교환검사중'; break;
      case 603: name = '교환검사완료(교환대기)'; break;
      case 604: name = '교환검사완료(교환보류)'; break;
      case 605: name = '교환상품준비중'; break;
      case 606: name = '교환상품배송대기'; break;
      case 607: name = '교환배송중'; break;
      case 608: name = '교환배송완료'; break;
      case 609: name = '교환구매확정'; break;
      case 610: name = '교환요청철회'; break;
      case 700: name = '반품요청(승인대기)'; break;
      case 701: name = '반품처리중(수거진행)'; break;
      case 702: name = '반품검사중'; break;
      case 703: name = '반품검사완료(환불대기)'; break;
      case 704: name = '반품검사완료(환불보류)'; break;
      case 705: name = '반품완료(환불완료)'; break;
      case 706: name = '반품요청철회'; break;
    }
    return name;
  }
  },
  computed: {
  
  },
  watch: {
  
  }
}
