<template>
  <tr class="table">
    <td>{{ index }}</td>
    <!-- <td
      v-for="heading in headings"
      :key="heading.row"
      :class="{
        alignLeft: heading.key.indexOf('L0L1') != -1,
        alignRight: heading.key.indexOf('R0R1') != -1,
      }"
    >
      <scm-ellipsis :length="20" tooltip>
        {{ row[heading.key] }}
      </scm-ellipsis>
    </td> -->
    <td v-for="heading in headings"
        :key="heading.row"
        :class="{
        alignLeft: heading.key.indexOf('L0L1') != -1,
        alignRight: heading.key.indexOf('R0R1') != -1,
      }"> {{ row[heading.key] }}
    </td>
  </tr>
</template>

<script>
export default {
  name: 'tableRow',
  props: ['row', 'headings', 'num'],
  data() {
    return {
      showTooltip: false,
    };
  },
  computed: {
    index() {
      return this.num;
    },
  },
  methods: {
    // tdMouseOver(index) {
    //   this.showTooltip =
    //     this.$refs.content[index].offsetWidth <
    //     this.$refs.content[index].scrollWidth;
    // },
  },
};
</script>

<style lang="scss" scoped>
.table td {
  // max-width: 250px;
  // text-overflow: ellipsis;
  min-width: 40px;
  overflow: hidden;
  white-space: nowrap;
  padding: 5px 10px;
}
.table td:first-child {
  min-width: 10px;
}
.tooltop {
  cursor: pointer;
}
.alignLeft {
  text-align: left;
  text-align: -webkit-left;
  text-align: -moz-left;
  text-align: -o-left;
  text-align: -ms-left;
}
.alignRight {
  text-align: right;
  text-align: -webkit-right;
  text-align: -moz-right;
  text-align: -o-right;
  text-align: -ms-right;
}
</style>
