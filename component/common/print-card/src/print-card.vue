<template>
<div v-loading="isPrintingFirst"
  element-loading-text="拼命加载中"
  element-loading-spinner="el-icon-loading"
  element-loading-background="rgba(255, 255, 255, 0.92)">
  <div ref="printArea">
    <div class="printHeader">
      <!-- <img src="./logo.png"> -->
       <!-- eslint-disable-next-line max-len -->
      <img :src="logo"/>
    </div>
    <div class="print-page__content" :class="[isPrinting ? 'printing' : '']">
      <h4 class="printSectionTitle">{{data.title}}</h4>
      <h4 class="printSubTitle">{{data.subTitle}}</h4>
      <div class="infoWrap">
        <div class="infoItemWrap" v-for="(item, index) in data.info.list" :key="index">
          <p class="infoItemLabel"
            :style="{width: data.info.labelWidth}">{{item.label}}：</p>
          <p class="infoItemValue"
             v-if="!item.isImg"
            :style="{paddingLeft: data.info.labelWidth}">{{item.value}}</p>
          <div class="infoItemValue" v-else
            :style="{paddingLeft: data.info.labelWidth}">
            <img :src="item.value" :alt="item.imgTitle"
              :title="item.imgTitle" :style="{width: item.imgWidth}">
          </div>
        </div>
      </div>
      <div class="tableWrap">
        <!-- 表格样式写在style标签里打印不显示，需要把样式写在行内 -->
        <table class="table" border="0" cellpadding="0" cellspacing="0"
          style="border: 0; border-collapse: collapse;">
            <thead>
              <tr style="border-left: 1px solid #000;
              border-top: 1px solid #000; border-bottom: 1px solid #000; ">
                <th v-for="(titleItem, titleIndex) in data.table.setting"
                  :style="{width: titleItem.width}"
                  style="border-right: 1px solid #000;
                  border-top: 0; border-bottom: 0; border-left: 0;"
                  :key="titleIndex">
                  {{titleItem.title}}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(dataItem, dataIndex) in data.table.datas" :key="dataIndex"
                style="border-left: 1px solid #000; border-top: 0;
                border-right: 0; border-bottom: 1px solid #000; ">
                <td  v-for="(titleItem, titleIndex) in data.table.setting"
                  style="border-right: 1px solid #000;
                    border-top: 0; border-bottom: 0; border-left: 0;"
                  :key="titleIndex">
                  {{dataItem[titleItem.prop]}}
                </td>
              </tr>
            </tbody>
          </table>
      </div>
      <div class="messageWrap">
        <p>{{data.message}}</p>
      </div>
      <div class="signWrap">
        <div class="signItemWrap"
          :style="{marginRight: data.sign.labelWidth}"
          v-for="(item, index) in data.sign.list" :key="index">
          <p class="signItemLabel">{{item}}：</p>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import '@/style/app.scss';
import printJS from 'print-js';
import _ from 'lodash';
import styleAndImg from './styleAndImg.js';

export default {
  name: 'ScmBankSelect',
  props: {
    printData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      isPrinting: false,
      isPrintingFirst: false,
      logo: styleAndImg.logo,
      data: {
        title: '',
        subTitle: '',
        info: {
          labelWidth: '',
          list: [],
        },
        table: {
          setting: [],
          datas: [],
        },
        message: '',
        sign: {
          labelWidth: '',
          list: [],
        },
      },
    };
  },
  watch: {
    // 主要进行求和计算；
    printData: {
      handler(newVal) {
        this.data = _.cloneDeep(newVal);
        if (this.data.table && this.data.table.setting.length > 0) {
          const sumList = [];
          const titleList = this.data.table.setting;
          const dataList = this.data.table.datas;
          titleList.forEach((titleItem) => {
            const titleI = titleItem;
            if (titleI.sum) {
              const obj = {
                prop: titleI.prop,
                sum: 0,
              };
              dataList.forEach((dataItem) => {
                const dataI = dataItem;
                obj.sum += Number(dataI[titleI.prop]);
              });
              sumList.push(obj);
            }
          });
          if (sumList.length > 0) {
            const sumObj = {};
            sumObj[titleList[0].prop] = '合计';
            sumList.forEach((sumItem) => {
              const sumI = sumItem;
              sumObj[sumI.prop] = sumI.sum;
            });
            this.data.table.datas.push(sumObj);
          }
        }
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
  },
  mounted() {
  },
  methods: {
    getStyle() {
      return styleAndImg.style;
    },
    onPrint() {
      this.isPrintingFirst = true;
      setTimeout(() => {
        this.isPrinting = true;
        this.$nextTick(() => {
          const obj = this.$refs.printArea;
          console.log(obj);
          // const newWindow = window.open('打印窗口', '_blank');
          let outputHTML = '';
          const cssList = Array.from(document.querySelectorAll('link[href*=css][rel=stylesheet]')).map(item => item.href);

          // let styleString = '';
          // _.forEach(document.getElementsByTagName('style'), (item) => {
          //   let style = item.textContent;
          //   // IE的场合
          //   if (!Number.isNaN(Number(document.documentMode))) {
          //     style = item.styleSheet.cssText;
          //   }
          //   // outputHTML += `<style type="text/css">${style}</style>`;
          //   styleString += style;
          // });
          console.log(cssList);
          outputHTML += obj.innerHTML;
          printJS({
            font: !Number.isNaN(Number(document.documentMode)) ? 'Microsoft YaHei' : 'PingFang SC',
            font_size: '10pt',
            printable: outputHTML,
            type: 'raw-html',
            css: cssList,
            // scanStyles: false,
            // onPrintDialogClose: () => {
            //   },
            style: this.getStyle(),
          });
          setTimeout(() => {
            this.isPrinting = false;
            this.isPrintingFirst = false;
          }, 1000);
        });
      }, 100);
    },
  },
};
</script>

<style lang="scss" >
// 修改样式的时候需要同步修改styleAndImg.js文件中的style属性，
.printing th {
  color: #000 !important;
}

.printSectionTitle {
  margin: 0;
  margin-top: 10px;
  font-size: 28px;
  text-align: center;
  font-weight: 500;
}
.printSubTitle {
  margin: 0;
  margin-top: 4px;
  font-size: 22px;
  text-align: center;
  font-weight: 500;
}
.infoWrap {
  margin-top: 20px;
  .infoItemWrap {
    position: relative;
    display: inline-block;
    width: 30%;
    margin-right: 3%;
    vertical-align: top;
    margin-bottom: 15px;
    font-size: 12px;
    .infoItemLabel {
      position: absolute;
      margin: 0;
      width: 100px;
    }
    .infoItemValue {
      box-sizing: border-box;
      margin: 0;
      padding-left: 100px;
      word-break: break-all;
      img {
        width: 100%;
      }
    }
  }
}
.tableWrap {
  .table {
    width: 100%;
    border: 0;
    thead {
      tr {
        th {
          font-size: 12px;
          background: #94b9cd;
          color: #fff;
          word-break: break-all;
          padding: 9px 5px;
          font {
            vertical-align: initial !important;
          }
        }
      }
    }
    tbody {
      tr {
        td {
          font-size: 12px;
          text-align: center;
          word-break: break-all;
          padding: 9px 5px;
          font {
            vertical-align: initial !important;
          }
        }
      }
    }
  }
}
.messageWrap {
  margin-top: 10px;
  p {
    margin: 0;
    font-size: 12px;
  }
}
.signWrap {
  margin-top: 50px;
  padding-bottom: 30px;
  .signItemWrap {
    display: inline-block;
    vertical-align: top;
    margin-bottom: 40px;
    margin-right: 100px;
    font-size: 12px;
    .signItemLabel {
      display: inline;
      margin: 0;
    }
  }
}
</style>


<style lang="scss" scoped>
</style>
