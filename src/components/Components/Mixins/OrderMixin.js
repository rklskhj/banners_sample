
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
        if (this.$route.path === '/order_delivery') {
          this.sortForDelivery();
        }
      // 배송비 부과를 위한 deliveryId(배송 부과용 id), deliveryUse(배송료 부과대상)
      this.setDeliveryId();
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
    sortForDelivery() {
      // 파트너 id 순으로 정렬 후, 배송조건 id 순으로 sorting (같은 id끼리 묶기)
      this.value.order_product = this.value.order_product.sort((a,b) => {
        return a.product.partner.id - b.product.partner.id
      }).sort(function(a,b) {
        return a.delivery_price.id - b.delivery_price.id
      })
    },
    setDeliveryId() {
      this.value.order_product.forEach(item=> {
        // cart 페이지가 아닌 경우, default false로 지정. cart 페이지에서는 true
        if (this.$route.path === '/cart') {
          item.deliveryUse = true;
        } else {
          item.deliveryUse = false;
        }
      })
      
      
      for(let i=0; i<this.value.order_product.length; i++) {
        let item = this.value.order_product[i];
        item.deliveryUse = true;
        item.deliveryId = this.uuidv4();
        // 배송비 부과방법(0: 배송비조건별, 1: 상품별) 상품별이면 개별 부과하므로 continue
        if(item.delivery_price.tax_method===1) {
          continue;
        }
        let j = 0;
        for(j=i+1; j<this.value.order_product.length; j++) {
          let dest = this.value.order_product[j];
          // 파트너 id와 배송조건 번호가 같을 경우
          if( item.product.partner.id === dest.product.partner.id &&
            item.delivery_price.id === dest.delivery_price.id) {
            dest.deliveryId = item.deliveryId;
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
            
            if(stock&&stock.option_type===0) {
              total_product_price += stock.total_price * parseInt(option.quantity);
            }
            else total_product_price += stock.price * parseInt(option.quantity);
            // if ((option.soldout === false && !option.enable_stock) || (option.enable_stock && option.stock > 0)) {
            //   // console.log(stock, 'stock')

            // }
          }
          item.op_product_price = total_product_price;
        }
        // 자체상품 
        else {
          total_product_price = item.product_price * item.quantity;
          item.op_product_price = total_product_price;
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
            if(!option.option) return total_discount_price
            if (option.option&&option.option.option_type===0) {
              total_discount_price += (item.discount_price * option.quantity)
            }
            // if ((option.soldout === false && !option.enable_stock) || (option.enable_stock && option.stock > 0)) {
            // }
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
    calcDeliverySetting(item, dp, attr) {
      let total = this.value.order_product.filter(i => i.deliveryId === item.deliveryId).reduce((a,c) => a + c[attr], 0);
      const dp_setting = dp.delivery_price_setting;
      for(let j=0; j<dp_setting.length; j++) {
        if(parseInt(dp_setting[j].min) <= total && total < parseInt(dp_setting[j].max)) {
          item.op_delivery_price = parseInt(dp_setting[j].price);
        }
        // 마지막 조건일 경우 예외처리
        else if(j === dp_setting.length-1) {
          if(parseInt(dp_setting[j].min) <= total)  {
            item.op_delivery_price = parseInt(dp_setting[j].price);
          }
        }
      }
    },
    calcOrderProductDeliveryPrice() {
      this.value.order_product.filter(i => i.deliveryUse).forEach(item => {
        const dp = item.delivery_price;
        // 고정 배송비
        if(dp.delivery_type === 0) {
          item.op_delivery_price = dp.fix_price;
        }
        // 배송비 무료
        else if(dp.delivery_type === 1) {
          item.op_delivery_price = 0;
        }
        // 금액별
        else if(dp.delivery_type === 2) {
          this.calcDeliverySetting(item, dp, 'op_order_price');
        }
        // 수량별
        else if(dp.delivery_type === 3) {
          this.calcDeliverySetting(item, dp, 'op_quantity');
        }
      });

      this.value.order_product.filter(i => !i.deliveryUse).forEach(item => {
        item.op_delivery_price = 0
      })


      // // 주문상품 array
      // let orderproducts = this.value.order_product;
      
      // for(let idx=0; idx<orderproducts.length; idx++) {
      //   let item = orderproducts[idx];
      //   let value = 0;
      //   if(item.rowspan===0) {
      //     value = 0;
      //   }
      //   else {        
      //     // 배송비 계산
      //     let dp = item.delivery_price;
          
      //     switch(dp.delivery_type) {
      //       // 고정 배송비
      //       case 0:
      //         value = dp.fix_price;
      //         break;
      //       // 배송비 무료
      //       case 1:
      //         break;
      //       // 금액별
      //       case 2:
      //         value = this.calcConditionalDeliveryPrice(orderproducts, item, 'op_order_price');
      //         break;
      //       // 수량별
      //       case 3:
      //         value = this.calcConditionalDeliveryPrice(orderproducts, item, 'op_quantity');
      //         break;
      //     }
          
      //   }
        
        
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
      //   if (!value) item.op_delivery_price = 0;
      //   else item.op_delivery_price = value;
      // }
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

      let order_product = this.$route.path === '/cart' ?
        this.value.order_product.filter(i=> i.selected).reduce((acc, cur) => {
          if (acc.findIndex(item => item.deliveryId === cur.deliveryId) === -1) {
            acc.push(cur)
          }
          return acc;
        }, []) : this.value.order_product;
      order_product.forEach(item => {
        let delivery_price = item.delivery_price
        if (delivery_price.tax_method === 1) {
          total_delivery_cost += item.op_delivery_price;
        } else {
          if (delivery_price.delivery_type === 0) {
            total_delivery_cost += item.op_delivery_price;
          } else if (delivery_price.delivery_type === 1) {
            total_delivery_cost += 0;
          } else if (delivery_price.delivery_type === 2) {
            total_delivery_cost += this.calcConditionalDeliveryPrice(this.value.order_product, item, 'op_order_price');
          } else if (delivery_price.delivery_type === 3) {
            total_delivery_cost += this.calcConditionalDeliveryPrice(this.value.order_product, item, 'op_quantity');
          }
        }
      })
      
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
    isDiscount(price) {
      if (price.is_discount) {
        if (price.discount_period_type === false) {
          if (price.discount_start !== null && price.discount_end !== null) {
            let currentDate = this.dayjs().format('YYYY-MM-DD HH:mm');
            if (currentDate < price.discount_start || currentDate > price.discount_end) {
              return false;
            } else {
              return true;
            }
          } else if (price.discount_start !== null && price.discount_end === null) {
            let currentDate = this.dayjs().format('YYYY-MM-DD HH:mm');
            if (currentDate < price.discount_start) {
              return false;
            } else {
              return true;
            }
          } else if (price.discount_start === null && price.discount_end !== null) {
            let currentDate = this.dayjs().format('YYYY-MM-DD HH:mm');
            if (currentDate > price.discount_end) {
              return false;
            } else {
              return true;
            }
          } else {
            return true;
          }
        } else {
          return true;
        }
      } else {
        return false;
      }
    },
    calcProductPrice(item) {
      // 상품금액 계산
      
      let total_product_price = 0;
      // 상품 옵션
      if(item.order_product_option.length>0) {
        item.order_product_option.forEach(option=> {
          let stock = find(item.selectorStocks, 'id', option.option_id);
          if(stock&&stock.option_type===0) {
            if (this.isDiscount(item.price)) {
              total_product_price += (item.price.sale_price + stock.price) * parseInt(option.quantity);
            } else {
              total_product_price += (item.price.price + stock.price) * parseInt(option.quantity);
            }
          }
          else total_product_price += stock.price * parseInt(option.quantity);
        })
        item.product_price = total_product_price;
      }
      // 자체상품 
      else {
        total_product_price = item.total_price * item.quantity;
        item.product_price = total_product_price;
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
      if (stock) return `${stock.name}`;
    },
    optionSoldoutStatus(selectorStocks, option_id) {
      if(!selectorStocks) return;
      let stock = find(selectorStocks, 'id', option_id);
      //console.log(stock)
      if (stock) return stock.soldout || (stock.enable_stock && stock.stock === 0);
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
      return {
        100: '입금대기',
        101: '결제완료',
        102: '주문확정',
        200: '상품준비중',
        300: '배송대기',
        301: '배송중',
        302: '배송완료',
        400: '구매확정',
        500: '취소요청(승인대기)',
        501: '취소승인(환불대기)',
        502: '취소보류',
        503: '취소완료(입금전 주문취소)',
        504: '취소완료(환불 완료)',
        505: '취소요청철회',
        600: '교환요청(승인대기)',
        601: '교환처리중(수거진행)',
        602: '교환검사중',
        603: '교환검사완료(교환대기)',
        604: '교환검사완료(교환보류)',
        605: '교환상품준비중',
        606: '교환상품배송대기',
        607: '교환배송중',
        608: '교환배송완료',
        609: '교환구매확정',
        610: '교환요청철회',
        700: '반품요청(승인대기)',
        701: '반품처리중(수거진행)',
        702: '반품검사중',
        703: '반품검사완료(환불대기)',
        704: '반품검사완료(환불보류)',
        705: '반품완료(환불완료)',
        706: '반품요청철회',
      }[status]
    }
    },
    computed: {
    
    },
    watch: {
    
    }
}
