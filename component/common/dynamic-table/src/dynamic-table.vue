<script>
/**
 * 动态表格，可根据传入的columns设置进行表格列内容的渲染
 */
export default {
  name: 'DataTable',
  props: {
    columns: Array,
    // 查询结果数据
    tableData: {
      type: Array,
      default() {
        return [];
      },
    },
    // 是否显示pager组件
    isShowPager: {
      type: Boolean,
      default: true,
    },
    height: {
      type: String,
    },
    maxHeight: {
      type: String,
    },
    // 查询结果总数量
    total: null,
    // 当前显示页号
    pageNum: {
      type: Number,
      default: 1,
    },
    // 当前每页显示数据数量
    pageSize: {
      type: Number,
      default: 10,
    },
  },
  data() {
    return {
      pageSizes: [10, 20, 50, 100],
    };
  },
  created() {
    let targetInstance = window;
    if (window.top !== targetInstance) {
      targetInstance = window.top;
    }
    if (targetInstance.dynamicTablePageSizes
      && typeof targetInstance.dynamicTablePageSizes === 'string') {
      this.pageSizes = targetInstance.dynamicTablePageSizes.split(',');
    }
  },
  methods: {
    /**
     * 当前页号变更事件处理
     * @event
     * @param {Number} val 变更后的页号
     */
    onCurrentChange(val) {
      this.$emit('current-change', val);
    },
    /**
     * 当前表格数据显示数量变更事件处理
     * @event
     * @param {Number} val 变更后的表格数据显示数量
     */
    onSizeChange(val) {
      this.$emit('size-change', val);
    },
    /**
     * 选择项发生变化时事件处理
     * @event
     * @param {Array} val 当前的选择项
     */
    onSelectionChange(val) {
      this.$emit('selection-change', val);
    },
    /**
     * 渲染表格Column
     * @param {Object} props Column属性
     */
    renderColumn(props) {
      let ret = null;
      if (props.type && props.type !== '') {
        ret = (
          <ScmTableColumn
            type={props.type}
            label={props.label}
            index={props.index}
            fixed={props.fixed}
            width={props.width}
            min-width={props.minWidth}
            index={props.index}
            selectable={props.selectable}
            align={props.align}
            reserve-selection={props.reserveelection}>
          </ScmTableColumn>
        );
      } else {
        let scopedSlots = typeof props.render === 'function' ? {
          default: scope => props.render(scope),
        } : null;
        const { renderHeader } = props;
        if (typeof renderHeader === 'function') {
          const header = scope => props.renderHeader(scope);
          if (scopedSlots === null) {
            scopedSlots = {
              header,
            };
          } else {
            scopedSlots.header = header;
          }
        }
        ret = (
          <ScmTableColumn
            label={props.title}
            fixed={props.fixed}
            prop={props.key}
            formatter={props.formatter}
            min-width={props.minWidth}
            width={props.width}
            align={props.align}
            scopedSlots={scopedSlots}>
          </ScmTableColumn>
        );
      }
      return ret;
    },
  },
  /**
   * Vue实例渲染函数，生成组件模版
   */
  render() {
    const {
      columns,
      pageNum,
      pageSize,
      pageSizes,
      onCurrentChange,
      onSelectionChange,
      onSizeChange,
      renderColumn,
      tableData = [],
      total,
      isShowPager,
      $slots,
      height,
      maxHeight,
    } = this;
    const renderColumns = [];
    columns.forEach((column) => {
      const { children } = column;
      // Column的场合
      if (children === null || children === undefined) {
        renderColumns.push(renderColumn(column));
      // ColumnGroup的场合
      } else {
        const childColumnList = children.map(childColumn => renderColumn(childColumn));
        renderColumns.push((
          <ScmTableColumnGroup name={column.key} label={column.title}>
            { childColumnList }
          </ScmTableColumnGroup>
        ));
      }
    });
    return (
      <div class="scm-data-table">
        <ScmTable
          data={tableData}
          height={height}
          max-height={maxHeight}
          on-selection-change={onSelectionChange}>
          { $slots['batch-control'] ? (
            <template slot="control">
              { $slots['batch-control'] }
            </template>
          ) : null }
          { renderColumns }
        </ScmTable>
        {
          tableData.length > 0 && isShowPager ? (
            <ScmPagination
              total={total}
              current-page={pageNum}
              page-size={pageSize}
              page-sizes={pageSizes}
              on-current-change={onCurrentChange}
              on-size-change={onSizeChange}>
            </ScmPagination>
          ) : null
        }
      </div>
    );
  },
};
</script>
<style lang="scss" scoped>
.scm-data-table {
  .el-pagination {
    margin-top: 10px;
  }
}
</style>
