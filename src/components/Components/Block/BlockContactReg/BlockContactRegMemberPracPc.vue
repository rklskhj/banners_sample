<template>
  <div
    style="padding: 32px 0 100px; min-hight: 100vh"
    :style="pcMaxWidth"
    class="position-relative"
  >
    <!-- 비회원 일시 -->
    <div v-if="!isLogin" class="flex-between">
      <div>
        <div class="size-24 weight-500 p-main">비회원 1:1문의</div>
        <div class="flex-align">
          <i class="material-icons size-20 p-help">info</i>
          <div class="size-14 p-sub" style="margin-left: 6px">
            회원으로 이용하실 분은 로그인 해 주시기 바랍니다.
          </div>
        </div>
      </div>
      <div
        @click="$router.push('/signin')"
        class="flex-justify unselect radius-8 p-border-main p-main"
        style="width: 76px; height: 44px; align-items: center"
      >
        로그인
      </div>
    </div>
    <!-- 회원 일시 -->
    <div v-else class="size-24 weight-500 p-main">1:1 문의 작성</div>
    <div
      class="p-border-top-main p-border-bottom-main"
      style="margintop: 24px; padding: 24px 0"
    >
      <component
        v-for="form in formData"
        :key="form.name"
        :is="form.elType"
        v-bind="form"
        :value.sync="form.value"
        :options="form.options"
        :formType="formTypeCustomLabel"
        :boxCustomStyle="form.boxCustom"
        :checkCustomStyle="form.checkCustom"
        :containerCustomStyle="form.containerCustom"
        :labelCustomStyle="form.labelCustom"
        :dropdownCustomStyle="form.dropdownCustom"
        :dropListCustpmStyle="dropListCustomStyle"
        :dropItemCustomStyle="inputCustom"
        :inputCustomStyle="form.inputCustom"
        :buttonCustomStyle="buttonCustom"
        :iconCustomStyle="iconCustomStyle"
      ></component>
    </div>
    <div class="flex-align" style="margin-top: 80px; justify-content: center">
      <div
        :style="buttonCustomCancel"
        style="margin-right: 16px"
        class="unselect pc-style"
        @click="clickBack"
      >
        취소
      </div>
      <div :style="buttonCustom" class="unselect pc-style" @click="register">
        문의 작성
      </div>
    </div>
  </div>
</template>

<script>
import FormMixin from "@/components/Components/Mixins/FormMixin";
import BlockMixin from "@/components/Components/Mixins/BlockMixin";
import HeaderMixin from "@/components/Components/Mixins/HeaderMixin";
import FormCustomMixin from "@/components/Components/Mixins/FormCustomMixin";
import PageMixin from "@/components/Components/Mixins/PageMixin";

export default {
  name: "BlockContactRegMemberPracPc",
  components: {},
  mixins: [FormMixin, BlockMixin, HeaderMixin, FormCustomMixin, PageMixin],
  props: {},
  data() {
    return {
      formData: [
        {
          name: "문의 유형",
          field: "title",
          label: "",
          value: "",
          format: "CDropdown",
          options: [
            {
              label: "문의 유형 1",
              value: "type1",
            },
            {
              label: "문의 유형 2",
              value: "type2",
            },
            {
              label: "문의 유형 3",
              value: "type3",
            },
          ],
          validate: {
            required: false,
            valid_required: false,
          },
          placeholder: "문의 유형 선택",
        },
        {
          name: "문의 제목",
          field: "title",
          label: "",
          value: "",
          format: "CInput_text",
          validate: {
            required: true,
            valid_required: false,
          },
          placeholder: "문의제목을 입력해주세요",
        },
        {
          name: "문의 내용",
          field: "content",
          label: "",
          value: "",
          format: "CInput_textarea",
          validate: {
            required: true,
            valid_required: false,
          },
          placeholder: "문의내용을 입력해주세요",
        },
        {
          name: "첨부파일",
          field: "file",
          label: "",
          value: "",
          format: "CFileUploader",
          validate: {
            required: false,
            valid_required: false,
          },
          placeholder: "",
        },
        {
          name: "이름",
          field: "name",
          label: "",
          value: "",
          format: "CInput_text",
          validate: {
            required: true,
            valid_required: false,
          },
          placeholder: "이름",
        },
        {
          name: "연락처",
          field: "name",
          label: "",
          value: "",
          format: "CInput_text",
          validate: {
            required: true,
            valid_required: false,
          },
          placeholder: "연락처",
        },
        {
          name: "이메일",
          field: "name",
          label: "",
          value: "",
          format: "CInput_text",
          validate: {
            required: true,
            valid_required: false,
          },
          placeholder: "이메일",
        },
        {
          name: "이용약관 및 개인정보처리방침 동의",
          items: [
            {
              link: "termsofservice_overlay",
              text: "이용약관",
              styles: {
                container: {
                  fontWeight: "bold",
                },
              },
              linkType: "overlay",
            },
            {
              text: " 및 ",
              styles: {
                container: {
                  padding: "0 4px",
                },
              },
            },
            {
              link: "termsofservice_overlay",
              text: "개인정보처리방침",
              styles: {
                container: {
                  fontWeight: "bold",
                },
              },
              linkType: "overlay",
            },
            {
              text: "에 동의하기",
            },
          ],
          label: "",
          value: false,
          format: "CgCheckboxArray",
          validate: {
            valid_required: true,
          },
        },
      ],
    };
  },
  created() {
    this.getForm();
  },

  methods: {
    getForm() {
      this.$axios.get("public/inquiry/personal/category").then((res) => {
        let categories = res.data;
        this.$axios.get("public/inquiry/personal/formdata").then((res2) => {
          let result = [];
          res2.data.forEach((item) => {
            if (item.field === "type_id") {
              item.options = categories;
            }

            if (
              !this.isLogin ||
              (this.isLogin &&
                ["name", "phone", "email"].indexOf(item.field) === -1 &&
                item.name.indexOf("개인정보") === -1)
            ) {
              result.push(item);
            }
          });
          result.forEach((item) => {
            if (item.field === "type_id") {
              item.containerCustom = {
                marginTop: "0px",
              };
            } else if (item.field === "content") {
              item.inputCustom = this.inputCustomTextarea;
              item.containerCustom = {
                marginTop: "14px",
              };
            } else {
              item.containerCustom = {
                marginTop: "14px",
              };
            }
          });
          this.formData = this.setForm(result);

          let dropdown = find(this.formData, "format", "CDropdown");
          let dropStyle = this.cloneItem(this.inputCustom);
          dropStyle.color = this.brandColor.primary.color;
          dropStyle.fontWeight = "500";
          dropStyle.border = this.brandBorder.main.border;
          dropdown.dropdownCustom = dropStyle;

          let title = find(this.formData, "field", "title");
          title.inputCustom = this.inputCustomStyles;

          if (!this.isLogin) {
            let name = find(this.formData, "field", "name");
            name.inputCustom = this.inputCustomStyles;

            let phone = find(this.formData, "field", "phone");
            phone.inputCustom = this.inputCustomStyles;

            let email = find(this.formData, "field", "email");
            email.inputCustom = this.inputCustomStyles;
          }
        });
      });
    },
    register() {
      let result = this.getParamData(this.formData);
      console.log(result, "result");
      if (result.enable) {
        let user_id = this.$store.getters.user.user_id;
        if (user_id) result.params.user_id = user_id;
        this.$axios
          .post("public/inquiry/personal", result.params)
          .then((res) => {
            if (res.status === 200) {
              this.toast("문의글이 작성되었습니다.");
              this.$router.replace("contact");
            }
          })
          .catch((err) => {
            if (!err.response.data.message)
              this.toast(err.response.data.detail);
            else this.toast(err.response.data.message);
          });
      }
    },
  },
  computed: {
    btnColor() {
      return {
        backgroundColor: "#9b9b9b",
      };
    },
    buttonCustomCancel() {
      let styles = this.cloneItem(this.buttonCustom);
      styles.backgroundColor = this.brandColor.help.color;
      return styles;
    },
    inputCustomStyles() {
      let styles = this.cloneItem(this.inputCustom);
      styles.border = this.brandBorder.main.border;
      return styles;
    },
    inputCustomTextarea() {
      let styles = this.cloneItem(this.inputCustom);
      styles.height = "160px";
      styles.border = this.brandBorder.main.border;
      return styles;
    },
    dropListCustomStyle() {
      return {
        top: "48px",
      };
    },
    dropItemCustomStyle() {
      return {
        backgroundColor: "#fff",
      };
    },
    iconCustomStyle() {
      return {
        fontSize: "22px",
        position: "absolute",
        right: "16px",
        color: this.brandColor.sub.color,
      };
    },
  },
  watch: {},
};
</script>

<style scoped>
.pc-style {
  width: 192px !important;
}
</style>