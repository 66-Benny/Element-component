<template>
  <scm-submenu
    popper-class="search-help-menu"
    v-if="menuItemData.list && menuItemData.list.length > 0 && !menuItemData.productCatalogName3"
    :index="`sub-menu-${parentIndex}`">
    <template slot="title">
      {{ getCategoryName(menuItemData) }}
    </template>
    <scm-auto-menu-item v-for="(menuChildrenItem, index) in menuItemData.list"
                        :key="`${parentIndex}-${index}`"
                        :menuItemData="menuChildrenItem"
                        @click.native="spreadCode(menuChildrenItem)"
                        :parent-index="`${parentIndex}-${index}`"></scm-auto-menu-item>
  </scm-submenu>
  <scm-menu-item v-else-if="menuItemData.productCatalogName3 && menuItemData"
                 :index="menuItemData.productCatalogCode3"
                 :value="menuItemData">
    {{ menuItemData.productCatalogName3 }}
  </scm-menu-item>
</template>
<style scoped>
.menu-item-icon {
  padding: 0 10px;
  font-size: 16px;
}
</style>
<script>
import ScmAutoMenuItem from './scm-auto-menu-item';

export default {
  name: 'ScmAutoMenuItem',
  props: {
    menuItemData: Object,
    parentIndex: String,
  },
  methods: {
    getCategoryName(val) {
      return (
        val.productCatalogName1 ||
        val.productCatalogName2
      );
    },
    spreadCode(val) {
      this.$emit('getCode', val);
    },
  },
  components: {
    ScmAutoMenuItem,
  },
};
</script>
