
export default {
    components: {

    },
    mixins: [

    ],
    props: {
    name: {
      type: String,
      required: false,
    },
    label: {
      type: String,
      required: false,
    },
    value: {
      required: false,
    },
    gutter: {
      type: Number,
      required: false,
    },
    options: {
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
    },
    formType: {
      type: Object,
      default: function() {
        return {
          input: 'round',         // round, underline
          button: 'round',
          box: 'round',
          list: 'horizontal',     // 라디오 버튼 등 가로/세로 정렬(vertical, horizontal)
          label: true,
          align: 'block',        // 가로 정렬(block, center, space-between, flex-start, flex-end)
          inputIcon: false,
          dropdown: 'list',      // list, modal
          vErrorNotShown: false  // 에러메시지 비노출 여부
        }
      },
      required: false,
    },
    validate: {
      type: Object,
      required: false,
    },
    placeholder: {
      type: String,
      required: false,
    },
    boxCustomStyle: {
      type: Object,
      required: false,
    },
    inputDateStyle: {
      type: Object,
      required: false,
    },
    inputTimeStyle: {
      type: Object,
      required: false,
    },
    imgUploaderStyle: {
      type: Object,
      required: false,
    },
    inputCustomStyle: {
      type: Object,
      required: false,
    },
    labelCustomStyle: {
      type: Object,
      required: false,
    },

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
      setForm(formData) {
      formData.forEach(item => {
        item.elType = this.formatChanger(item.format);

        // valid required true일때 * 추가
        if(item.label && item.validate.valid_required && item.label.indexOf('*') === -1) {
          item.label = '*' + item.label;
        }

        // CRadiobuttonGroup일때, options에 value 추가
        if(['CRadiobuttonGroup', 'CCheckboxGroup'].indexOf(item.format)>-1) {
          item.options.forEach(item=>{
            if(item.id)
              item.value = item.id;
          });
        }

        if(item.elType) {
          item.type = item.elType.replace('c-input-','');
        }
        else {
          console.log('setform else')
          if(item.format && item.format==='CVerifyBtn') {
            item.type = 'verify';
          } else if (item.format && item.format==='CVerifyBtnNice') {
            item.elType = 'CVerifyBtnNice'
            item.type = 'verify_nice'
          }
        }
        if(item.type === 'checkboxArray')  {
          item.value = false;
        }
        else if(item.value === undefined) {
          if(item.type === 'checkbox-group' || item.type === 'tag') {
            item.value = [];
          } else {
            item.value = '';
          }
        }
      });
      return formData;
    },
    formatChanger(format) {
      switch(format) {
        case 'CInput_text':
          return 'c-input-text';
        case 'CInput_number':
          return 'c-input-number';
        case 'CInput_password':
          return 'c-input-password';

        case 'CRegion':
          return 'c-input-region';
        case 'CInput_email':
          return 'c-input-email'

        case 'CInput_phone':
          return 'c-input-phone';

        case 'CAddress':
          return 'c-input-address';

        case 'CBankAccount':
          return 'c-input-bank-account';

        case 'CCasCadingDropDown':
          return 'c-input-cascadingDropdown';
          
        case 'CCompanyOperating':
          return 'c-input-company-operating'

        case 'CInput_checkbox':
          return 'c-input-checkbox';

        case 'CgCheckboxTextarea':
          return 'c-input-checkbox-textarea';

        case 'CgCheckboxArray':
          return 'c-input-checkboxArray';

        case 'CCheckboxGroup':
          return 'c-input-checkbox-group';

        case 'CDate':
          return 'c-input-date';

        case 'CDateTime':
          return 'c-input-datetime';

        case 'CDiscount':
          return 'c-input-discount';

        case 'CDropdown':
          return 'c-input-dropdown';

        case 'CFileUploader':
          return 'c-input-fileUploader';

        case 'CImgUploader':
          return 'c-input-imgUploader';
          
        case 'CImgUploaderSingle':
          return 'c-input-imgUploader-single';

        case 'CFileUploaderSingle':
          return 'c-input-fileUploader-single';

        case 'CImgUploaderArray':
          return 'c-input-imgUploaderArray';

        case 'CRadiobuttonGroup':
          return 'c-input-radiobuttonGroup';

        case 'CRadioFullButtonGroup':
          return 'c-input-radio-full-buttonGroup';

        case 'CRating':
          return 'c-input-rating';
          
        case 'CRegion':
          return 'c-input-region';

        case 'CRegionForm':
          return 'c-input-regionForm';
          
        case 'cRegionModal':
          return 'c-input-regionModal';

        case 'CRange':
          return 'c-input-range';
          
        case 'CRangeDual':
          return 'c-input-rangeDual';

        case 'CInput_textarea':
          return 'c-input-textarea';

        case 'CInputEditor':
          return 'c-input-editor';

        case 'CTime':
          return 'c-input-time';

        case 'CInputTag':
          return 'c-input-tag';
          
        case 'CVerifyBtn':
          return 'c-input-verify';
        
      }
    },
    getParamData(formData) {
      let password_new = find(formData, 'field', 'password');
      let password_re = find(formData, 'field', 'password_re');

      if (password_new !== undefined &&
          password_new.validate.required && 
          password_new.validate.valid_required &&
          password_re !== undefined &&
          password_re.validate.required && 
          password_re.validate.valid_required 
        ) {
        if (password_new.value !== undefined && password_re.value !== undefined &&
          password_new.value !== password_re.value) {
          this.toast("비밀번호가 일치하지 않습니다.");
          return;
        }
      }

      let enable = true;
      let params = {};
      params.params = [];

      formData.some(item=>{
        // 유효성 체크
        let res = this.formValidate(item, this.toast);

        let value = '';
        if (res === '_!valid_false') {
          enable= false;
          return true;    // 유효성 체크 false / Break;
        }
        else {
          value = res;
        }

        // 맞춤 디비일 경우
        if( item.is_param ) {
          let param = {
            param_id: item.id,
            param_type: item.param_type,
            value: value
          };
          params.params.push(param);
        }
        // 맞춤 아닐 경우
        else {
          params[item.field] = value;
        }
      })

      return { 'enable': enable, 'params': params }
    },
    setCounselForm(formData) {
      let enable = true;
      let result = [];

      formData.some(item=>{
        // 유효성 체크
        let res = this.formValidate(item, this.toast);

        let value = '';
        if (res === '_!valid_false') {
          enable= false;
          return true;    // 유효성 체크 false / Break;
        }
        else {
          value = res;
        }
        
        // answer 데이터 만들기
        let answer = item.value;
        if (item.elType === 'c-input-checkbox-group') {
          answer = ''
          for (let k=0; k<item.value.length; k++) {
            if (k<item.value.length-1) {
              answer += `${item.value[k]}, `
            }
            else if (k===item.value.length-1) {
              answer += `${item.value[k]}`
            }
          }
        }
        else if (item.elType === 'c-input-regionForm') {
          answer = `${item.value.sido.label} ${item.value.sigungu.label}`
        }
        result.push({
          answer: answer,
          question: item.name
        })
      })

      return { 'enable': enable, 'result': result };
    },
    setStepForm(step) {
      let enable = true;
      let steps = [];
      let valid = true;
      
      step.forEach(formdata => {
        let newArray = [];
        formdata.forms.forEach(item => {
          // 유효성 체크
          if (this.formValidate(item, this.toast) === '_!valid_false') {
            valid = false;
          }
          
          newArray.push({
            answer: item.value,
            question: item.name,
          });
          
          if(item.options) {
            
            let option = item.options.filter(opt=>{ return opt.value === item.value});
            if(option.length>0) {
              option = option[0];
              if(option.forms && option.forms.length>0) {
                option.forms.forEach(form => {
                  // 유효성 체크
                  if (this.formValidate(form, this.toast) === '_!valid_false') {
                    valid = false;
                  }
                  if(form.value!==undefined) {
                    newArray.push({
                      answer: form.value,
                      question: form.name
                    });
                  }
                });
              }
            }
          }
        });
        steps.push({
          title: formdata.title,
          forms: newArray
        })
      })
      
      return valid ? steps : [];
    },
    // 추가할 폼 데이터
    addFormData(data) {
      data.forEach(d => {
        let field =  find(this.formData, 'field', d.field);
        if(!field) this.formData = this.formData.concat(this.setForm(data));
      })
    }
    },
    computed: {
    containerStyle() {
      let deco = {};
      
      // flex일 경우
      if (this.formType && this.formType.align!==undefined && this.formType.align!=='block') {
        deco.display = 'flex';
        deco.justifyContent = this.formType.align;
      }

      let gutter = this.gutter !== undefined ? this.gutter : 24;
      deco.marginTop = gutter + 'px';

      return deco;
    },
    labelStyle() {
      if(this.labelCustomStyle) {
        return this.labelCustomStyle;
      }

      let deco = {};
      deco = {
        margin: '20px 0 6px 0',
        fontSize: '14px',
        color: this.getColor('보조 내용 색상')
      };
      if (this.formType.align!=='block') deco.margin = 0;
      return deco;
    },
    inputStyle() {
      if(this.inputCustomStyle)
        return this.inputCustomStyle;
      if(this.inputDateStyle)
        return this.inputDateStyle;
      if(this.inputTimeStyle)
        return this.inputTimeStyle;

      let deco = {
        border: 0,
        padding: '12px',
        fontSize: '14px'
      };

      switch (this.formType && this.formType.input) {
        case 'round':
        deco.borderRadius = this.radius.borderRadius;
        deco.border = `1px solid ${this.getColor('기본 테두리선 색상')}`;
        break;
        case 'underline':
        deco.borderBottom = `1px solid ${this.getColor('기본 테두리선 색상')}`;
        break;
      }

      return deco;
    },
    buttonStyle() {
      if(this.addressButtonCustomStyle) return this.addressButtonCustomStyle; // 주소 검색 버튼

      if(this.buttonCustomStyle) return this.buttonCustomStyle;
  
      let deco = {
        border: 0,
        padding: '10px 20px',
        fontSize: '14px',
        color: this.brandColor.main,
      };

      switch (this.formType && this.formType.button) {
        case 'round':
          deco.borderRadius = this.radius.borderRadius;
          deco.border = `1px solid ${this.getColor('기본 테두리선 색상')}`;
          deco.backgroundColor = this.getColor('보조 테두리선 색상');
          break;
        case 'underline':
          deco.borderBottom = `1px solid ${this.getColor('기본 테두리선 색상')}`;
          deco.backgroundColor = this.getColor('기본 테두리선 색상');
          break;
      }
      
       if(this.inputCustom) {
      deco.border = `1px solid ${this.getColor('기본 테두리선 색상')}`;
    }

      return deco;
    },
    boxStyle() {

       
      let deco = {
        border: 0,
        width: '14px',
        height: '14px',
      };

      switch (this.formType && this.formType.box) {
        case 'round':
          deco.borderRadius = '50px';
          deco.border = `1px solid ${this.getColor('기본 테두리선 색상')}`;
          break;
      }
      
    if(this.inputCustom) {
      deco.border = `1px solid ${this.getColor('기본 테두리선 색상')}`;
    }

      return deco;
    },
    checkStyle() {
      let deco = {
        fontSize: '16px',
        backgroundColor: 'white',
        borderRadius:'4px',
        color: 'red'
      };

      return deco;
    },
    listStyle() {
      let deco = {};

      switch (this.formType && this.formType.list) {
        case 'horizontal':
          deco.display = 'flex';
          break;
        case 'vertical':
          deco.display = 'block';
      }

      return deco;
    },
    dropdownStyle() {
      let deco = {
        padding: '8px 16px',
        fontSize: '14px'
      };

      switch (this.formType && this.formType.input) {
        case 'round':
          deco.borderRadius = this.radius.borderRadius;
          deco.border = `1px solid ${this.getColor('기본 테두리선 색상')}`;
          break;
        case 'underline':
          deco.borderRadius = 0;
          deco.borderBottom = `1px solid ${this.getColor('기본 테두리선 색상')}`;
          break;
      }

      return deco;
    },
    deleteIconStyle() {
      return {
        backgroundColor: 'rgb(221, 221, 221)',
        color: 'white',
        borderRadius: '14px',
        fontSize: '14px',
        right: '12px',
        top: '10px',
        padding: '2px',
        position: 'absolute'
      };
    }
    },
    watch: {
    
    }
}
