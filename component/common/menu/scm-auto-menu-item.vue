<template>
  <scm-submenu
    :popper-class="subMenuPopperClass ? subMenuPopperClass : 'scm-auto-menu-item-popper'"
    v-if="menuItemData.list"
    :index="`sub-menu-${parentIndex}`">
    <template slot="title">
     <div @mouseenter="itemMouseenter(`${parentIndex}`, menuItemData)">
        {{ getCategoryName(menuItemData) }}
     </div>
    </template>
    <scm-auto-menu-item v-for="(menuChildrenItem, index) in menuItemData.list"
                        :key="`${parentIndex}-${index}`"
                        :menuItemData="menuChildrenItem"
                        :baseData="baseData"
                        :parent-index="`${parentIndex}-${index}`"></scm-auto-menu-item>
  </scm-submenu>
  <scm-menu-item v-else-if="menuItemData"
                 :index="menuItemData.productNum"
                 :value="menuItemData.productName">
    {{ menuItemData.productName }}
  </scm-menu-item>
</template>
<style scoped>
.menu-item-icon {
  padding: 0 10px;
  font-size: 16px;
}
</style>
<script>
import _ from 'lodash';
import ScmAutoMenuItem from './scm-auto-menu-item';

export default {
  name: 'ScmAutoMenuItem',
  props: {
    menuItemData: Object,
    parentIndex: String,
    subMenuPopperClass: String,
    baseData: Array,
  },
  data() {
    return {
      getData: [],
    };
  },
  methods: {
    getCategoryName(val) {
      return (
        val.productCatalogName1 ||
        val.productCatalogName2 ||
        val.productCatalogName3 ||
        val.productCatalogName4
      );
    },
    itemMouseenter(path, data) {
      const tmpData = data;
      if (data.list.length <= 0) {
        const pathList = path.split('-');
        this.getPathData(pathList, this.baseData, 0);
        tmpData.list = this.getData;
      }
    },
    deleteSubList(parentList) {
      parentList.map((item) => {
        const i = item;
        if (i.list) {
          i.list = [];
        }
        return i;
      });
      return parentList;
    },
    getPathData(pathList, obj, index) {
      const list = _.cloneDeep(_.get(obj, [pathList[index], 'list'], []));
      if (pathList.length - 1 > index) {
        const nexIndex = index + 1;
        this.getPathData(pathList, list, nexIndex);
      } else {
        this.getData = this.deleteSubList(list);
      }
    },
  },
  components: {
    ScmAutoMenuItem,
  },
};
</script>
