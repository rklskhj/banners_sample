<template>
  <div class="position-relative unselect">
    <!-- 1depth -->
    <div v-for="(item,idx) in menu" :key="'menu1-'+idx">
      <div class="flex-between" :style="menuItem(1)" @click="clickItem(item,1)">
        <div>{{ item.name }}</div>
        <i v-if="item.child && item.child.length>0"
            class="material-icons">{{ item.visible ? 'arrow_drop_up' : 'arrow_drop_down' }}</i>
      </div>

      <!-- 2depth -->
      <div v-if="item.visible && item.child && item.child.length>0">
        <div v-for="(child,idx2) in item.child" :key="'menu2-'+idx2">
          <div class="flex-between" :style="menuItem(2)" @click="clickItem(child,2)">
            <div>{{ child.name }}</div>
            <i v-if="child.child && child.child.length>0"
                class="material-icons">{{ child.visible ? 'arrow_drop_up' : 'arrow_drop_down' }}</i>
          </div>

          <!-- 3depth -->
          <div v-if="child.visible && child.child && child.child.length>0">
            <div :style="menuItem(3)" v-for="(grandchild,idx3) in child.child" :key="'menu3-'+idx3" @click="clickItem(grandchild,3)">
              <div>{{ grandchild.name }}</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "MenuAccordion",

    props: {
      menu: {
        type: Array,
        required: true
      }
    },
    methods: {
      menuItem(depth) {
        let deco = {
          padding: '16px',
          borderBottom: '1px solid ' + this.getColor('기본 테두리선 색상')
        }

        if(depth === 2) {
          deco.backgroundColor = '#f9f9f9';
          deco.paddingLeft = '24px';
        }
        if(depth === 3) {
          deco.backgroundColor = '#f0f0f0';
          deco.paddingLeft = '32px';
        }
        return deco;
      },
      clickItem(item,depth) {
        if(item.child && item.child.length>0) {
          item.visible = !item.visible
        } else {
          this.$router.push(`product?category=${item.id}&depth=${depth}`);
        }
      }
    }
  }
</script>
