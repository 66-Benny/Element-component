## <div id="top">公共组件列表</div>
### <a href="#history">公共组件更新历史</a>

### 1. sup-select(供应商信息)

#### 介绍
通过检索信息查询对应“供应商”的基本信息（一个供应商只会查出一条数据）。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| addrCode | 省码 | string | — | — |
| nullValue | 返回空值的显示与隐藏 | Boolean | — | false |
| purchaseType | 是否是采购类型 | string | 'Y':采购类型; 'N':非采购类型 | — |
| loginUserId | 登录用户ID | string | — | — |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| select | 当用户手动点击数据行时触发的事件 | obj |

#### obj Structure
| 参数      | 说明          | 类型      | 所属类    |
|---------- |-------------- |---------- |---------- |
| lifnr | 供应商编码 | string | — |
| name | 供应商名称 | string | — |
| address | 供应商地址 | string | — |

### 2. bg-select(预算维度)

#### 介绍
通过检索信息查询对应“预算项目”的基本信息。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| ziskj | 是否框架合同 | boolean | — | false |
| zcoid | 合同系统合同号 | string | — | false |
| addrCode | 省码 | string | — | — |
| nullValue | 是否可以返回空值 | boolean | — | false |
| plantCode | 工厂编码 | string | — | — |
| orderType | 是否为零购订单 | string | '1':零购订单; '2':非零购订单 | — |
| allWord | 初始化 预算责任部门 | Object | — | — |
| budgetGroup | 组合查询 | string | — | — |
| budgetAccountLikeParam | 预算科目编码模糊查询条件 | string | — | — |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| select | 当用户手动点击数据行时触发的事件 | obj |

#### obj Structure
| 参数      | 说明          | 类型      | 归属
|---------- |-------------- |---------- |---- |
| projectYear | 预算项目年度 | string | group1 |
| startDate | 预算开始时间 | string | group1 |
| endDate | 预算结束时间 | string | group1 |
| projectNum | 预算项目编号 | string | group1 |
| projectName | 预算项目名称 | string | group1 |
| reference13 | 业务活动名称 | string | group1 |
| activityCode | 业务活动编码 | string | group1 |
| reference12 | 预算部门名称 | string | group1 |
| reference14 | 业务活动名称 | string | group1 |
| reference12 | 预算责任部门 | string | group1 |
| projectNum | 预算项目编号 | string | group2 |
| projectName | 预算项目名称 | string | group2 |
| companyName | 预算组合名称 | string | group2 |
| environmentName | 投资主体 | string | group2 |
| year | 预算信息年度 | string | group2 |
| availableAmount | 预算可用金额 | string | group2 |

### 3. user-select(用户信息查看)

#### 介绍
通过检索信息查询对应“人员”的基本信息。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| addrCode | 省码 | string | — | — |
| cityCode | 市码 | string | — | — |
| roleIds | 角色id | Array | — | — |
| provinceComFlag | 是否匹配省公司下所用公司 | string | 'Y':获取省公司下所有公司; 'N':仅仅查询省公司; ''：只查询组织Id | — |
| cityComFlag | 是否匹配省公司及市公司 | string | 1：查询省公司及市公司，2：仅查询市公司 | '1' |
| nullValue | 是否可以返回空值 | boolean | — | false |
| owroleIds | id | Array | — | — |
| owroleIds2 | id | Array | — | — |
| orgId | 组织ID | string | — | — |
| userType | 员工类别Code | string | '0':内部员工; '1':供应商一级账号; '2':供应商二级账号; '3':内部专家; '4':外部专家; '5':代理机构; '6':检测机构 | — |
| userId | 用户id(系统账号) | string | — | — |
| userStatus | 用户状态 | string | '1':有权; '2':(无效,无权) | — |
| orgFlag | 部门id查询方式 | string | 1或者'':查当前id; 2:查询当前id及下一层id； 3：仅查询下一层id | — |
| inputViorgName | 部门全称 | string | — | — |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| select | 当用户手动点击数据行时触发的事件 | obj |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| orgAddrName | 省公司 | string | — |
| employeeBasicNameCn | 用户名 | string | — |
| orgName | 部门全称 | string | — |
| orgShortName | 部门简称 | string | — |
| userId | 登录名 | string | — |

### 4. project-select(查询工建项目)

#### 介绍
通过检索信息查询对应“工建项目”的基本信息。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| addrCode | 省码 | string | — | — |
| nullValue | 是否可以返回空值 | boolean | — | false |
| plantCode | 工厂编码 | string | — | — |
| plantType | 业务主体 | string | '0':上市; '2':TD | — |
| orgId | OU组织编码 | string | — | — |
| inputProjectName | 工建项目名称 | string | — | — |
| inputProjectCode | 工建项目编号 | string | — | — |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| select | 当用户手动点击数据行时触发的事件 | obj |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| orgId | OU组织编码 | string | — |
| orgName | OU组织名称 | string | — |
| segment1 | 工建项目编号 | string | — |
| name | 工建项目名称 | string | — |
| projectManager | 项目经理 | string | — |
| offsetFlagLabel | 是否动产 | string | — |
| startDate | 项目开始日期 | string | — |
| completionDate | 项目结束日期 | string | — |

### 5. unit-select(计量单位信息)

#### 介绍
通过检索信息查询对应“计量单位”的基本信息。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| nullValue | 返回空值的显示与隐藏 | Boolean | — | false |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| select | 当用户手动点击数据行时触发的事件 | obj |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| code | 单位编号 | string | — |
| value | 单位名称 | string | — |

### 6. ou-select(OU组织)

#### 介绍
通过检索信息查询对应“OU组织”的基本信息。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| addrCode | 省码 | String | — | — |
| nullValue | 返回空值的显示与隐藏 | Boolean | — | false |
| plantType | 业务主体 | String | '0':上市; '1':铁通; '2':TD; ''：全部 | — |
| code | 工厂编码 | String | — | — |
| deptId | 部门id | String | — | — |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| select | 当用户手动点击数据行时触发的事件 | obj |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| erpMapId | OU组织编码 | string | — |
| erpMapName | OU组织名称 | string | — |
| code | 工厂代码 | string | — |
| name | 工厂名称 | string | — |
| addrCode | 省份编码 | string | — |
| addrName | 法人名称 | string | — |

### 7. store-house-select(仓库)

#### 介绍
通过检索信息查询对应“仓库”的基本信息。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| plantType | 业务主体 | string | 0:上市；1:铁通；2:TD | — |
| erpMapId | OU组织编码 | string | — | — |
| preLgortLikeList | 仓库编码前段模糊匹配 | Array | — | — |
| warehouseCode | 用户id，过滤权限用 | string | — | — |
| permissionFilter | 是否过滤权限 | string | 1：过滤，其他不过滤 | — |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| select | 当用户手动点击数据行时触发的事件 | obj |
| nullValue | 是否可以返回空值 | boolean | — | false |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| addrCode | 省份编码 | string | — |
| erpMapId | OU组织编码 | string | — |
| erpMapName | OU组织名称 | string | — |
| werks | 工厂编码 | string | — |
| name | 工厂名称 | string | — |
| lgort | 仓库编码 | string | — |
| lgobe | 仓库名称 | string | — |

### 8. ou-organize-select(库存组织)

#### 介绍
通过检索信息查询对应“库存组织”的基本信息。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| orgId | OU组织编码 | string | — | — |
| plantCode | 工厂编码 | string | — | — |
| addrCode | 省码 | string | — | — |
| nullValue | 是否可以返回空值 | boolean | — | false |
| invTypeList | 库存组织类型List | Array | — | [] |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| select | 当用户手动点击数据行时触发的事件 | obj |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| addrCode | 省码 | string | — |
| orgId | OU组织编码 | string | — |
| orgName | OU组织名称 | string | — |
| organizationId | 库存组织ID | string | — |
| organizationName | 库存组织名称 | string | — |
| organizationCode | 库存组织编号 | string | — |
| invType | 库存组织类型 | string | — |
| invTypeDescription | 库存组织类型描述 | string | — |
| environmentName | 环境名称 | string | — |

### 9. sup-detail-select(供应商详细信息)

#### 介绍
通过检索信息查询该供应商在不同条件下的详细信息（会查询出多条同一供应商在不同信息下的数据）。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| addrCode | 省码 | string | — | — |
| purchaseType | 是否是采购类型 | string | Y:采购类型,N:非采购类型 | — |
| loginUserId | 登录用户ID | string | — | — |
| ouCode | OU组织编码（仅在输入省码为ERP大集中的省份时有效） | string | — | — |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| select | 当用户手动点击数据行时触发的事件 | obj |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| lifnr | 供应商编码 | string | isERPCentralization = 1 |
| name | 供应商名称 | string | isERPCentralization = 1 |
| addrCode | 省码 | string | isERPCentralization = 1 |
| vatFlag | 纳税资质 | string | isERPCentralization = 1 |
| vendorSitCode | 供应商地址编码（非ERP大集中使用） | string | isERPCentralization = 1 |
| ouName | OU组织名称 | string | isERPCentralization = 1 |
| contactName | 联系人姓名 | string | isERPCentralization = 1 |
| contactPhone | 联系人电话 | string | isERPCentralization = 1 |
| contactFax | 联系人传真 | string | isERPCentralization = 1 |
| contactMail | 联系人邮箱 | string | isERPCentralization = 1 |
| bankAccountName | 供应商银行 | string | isERPCentralization = 1 |
| bankAccountNum | 供应商银行账号 | string | isERPCentralization = 1 |
| mainAccountFlag | 是否主账号 | string | isERPCentralization = 1 |
| validFlag | 银行账户是否有效 | string | isERPCentralization = 1 |
| lifnr | 供应商编码 | string | isERPCentralization = 2 |
| name | 供应商名称 | string | isERPCentralization = 2 |
| address | 供应商地址 | string | isERPCentralization = 2 |
| addrCode | 省码 | string | isERPCentralization = 2 |
| sourceCode | 数据来源 | string | isERPCentralization = 2 |
| innerFlag | 是否为关联方 | string | isERPCentralization = 2 |
| innerCode | 关联码 | string | isERPCentralization = 2 |
| vatFlag | 纳税资质 | string | isERPCentralization = 2 |
| ouCode | OU组织编码 | string | isERPCentralization = 2 |
| ouName | OU组织名称 | string | isERPCentralization = 2 |
| contactName | 联系人姓名 | string | isERPCentralization = 2 |
| contactCellphone | 联系人手机 | string | isERPCentralization = 2 |
| contactPhone | 联系人电话 | string | isERPCentralization = 2 |
| contactFax | 联系人传真 | string | isERPCentralization = 2 |
| contactMail | 联系人邮箱 | string | isERPCentralization = 2 |
| vendorAccountId | 银行账户主键ID | string | isERPCentralization = 2 |
| bankAccountName | 供应商银行 | string | isERPCentralization = 2 |
| bankAccountNum | 供应商银行账号 | string | isERPCentralization = 2 |
| mainAccountFlag | 是否主账号 | string | isERPCentralization = 2 |
| validFlag | 银行账户是否有效 | string | isERPCentralization = 2 |

### 10. procurement-select(采购项目信息（仅省采购）)

#### 介绍
通过检索信息查询对应“采购项目”的基本信息(查询的是二采的表）。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| nullValue | 返回空值的显示与隐藏 | Boolean | — | false |
| addrCode | 省码 | String | — | — |
| status | 状态 | String | '0':保存未提交; '1':审批中; '2':审批通过; 其他:驳回 | — |
| statusPrj | 采购项目状态 | String | '1':立项未启动; '2':项目终止; '3':项目流标; '4':项目关闭 | — |
| zfbprod | 是否过滤非标产品 | String | '1':不过滤; '2':过滤 | — |
| isShowPurType | 采购类型搜索字段显示与隐藏 | Boolean | — | false |
| purType | 默认初始化查询 | String | '3':二级集采; '4':省自采-横向部门; '7':分公司采购 | — |
| purList | 下拉选得条件 | Array | — | — |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| select | 当用户手动点击数据行时触发的事件 | obj |
| nullValue | 是否可以返回空值 | boolean | — | false |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| prjId | 项目编码 | string | — |
| prjName | 项目名称 | string | — |
| prjMgr | 创建人 | string | — |
| purType2.label | 集采类型 | string | — |
| costType.label | 开支类型 | string | — |
| purMethod | 采购方式 | string | — |
| statusPrj | 项目状态 | string | — |

### 11. materiel-select(物料主数据)

#### 介绍
通过检索信息查询对应“物料”的基本信息。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| ebeln | 框架合同编号 | string | — | — |
| addrCode | 省码 | string | — | 'TJ' |
| viproductType | 产品类型 | string | '1':目录产品; '2':细化产品 | '2' |
| zfbprod | 非标产品标识 | string | '1':一采非标; '2':二采非标; '3':标准产品; '':全部产品 | '3' |
| viTopoType | 采购类型 | string | '1':一级集采; '2':二级集采; '3':非集采; '':全部类型 | — |
| nullValue | 是否可以返回空值 | boolean | — | false |
| flag  | 动态显示下拉框 | string | '1':包括一级集采; '2':不包括一级集采 是否参考总部合同创建 | — |
| inputBomFlg  | 仅搜索BOM | string | "0":否; "1":是 | '0' |
| bomFlgDisabled  | 是否禁用仅搜索BOM | boolean | — | false |
| isShowBomFlag  | 是否显示“仅搜索BOM” | boolean | — | false |
| status  | 物料状态(支持英文逗号分隔多值传入，例如：'A,B') | string | A-有效; B-预冻结; C-冻结; D-失效 | — |
| showClose | 是否显示关闭按钮 | boolean | — | true |
| closeOnPressEscape | 是否可以通过按下 ESC 关闭 Dialog | boolean | — | true |
| closeOnClickModal | 是否可以通过点击 modal 关闭 Dialog | boolean | — | true |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| select | 当用户手动点击数据行时触发的事件 | obj |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| materialCode | 物料编码 | string | — |
| shortName | 物料描述 | string | — |
| subProductNum | 产品编码 | string | — |
| subProductDesc | 产品名称 | string | — |
| materialUnit | 计量单位 | string | — |
| poTypeLabel | 采购类型 | string | — |

### 12. company-select(公司信息)

#### 介绍
通过检索信息查询对应“公司”的基本信息。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| select | 当用户手动点击数据行时触发的事件 | obj |
| nullValue | 是否可以返回空值 | boolean | — | false |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| bukrs | 公司编码 | string | — |
| des | 公司名称 | string | — |
| addrCode | 省码 | string | — |
| environmentName | 环境名称 | string | — |

### 13. opi-project-select(省采购项目产品信息)

#### 介绍
通过检索信息查询对应“产品”的基本信息。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| addrCode | 省码 | string | — | — |
| prjId | 项目ID | string | — | — |
| viproductType | 产品类型 | string | '1';'2' | '1' |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| select | 当用户手动点击数据行时触发的事件 | obj |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| prjId | 项目ID | string | — |
| prodFullId | 产品全ID | string | — |
| prodId | 产品编码   | string | — |
| prodName | 产品名称 | string | — |
| unit | 计量单位 | string | — |
| zkey | 六位小类 | string | — |
| zkey3 | 小类 | string | — |
| zkey3Text | 小类描述 | string | — |

### 14. operating-unit-select(下发单位)

#### 介绍
通过检索信息查询对应“下发单位”的基本信息。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| addrCode | 省码 | string | — | 'TJ' |
| viCode | 组织编码 | string | — | — |
| nullValue | 返回空值的显示与隐藏 | Boolean | — | — |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| select | 当用户手动点击数据行时触发的事件 | obj |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| erpMapId | OU组织编码 | string | — |
| erpMapName | OU组织名称 | string | — |
| code | 工厂代码 | string | — |
| name | 工厂名称 | string | — |
| addrCode | 省份编码 | string | — |
| addrName | 法人名称 | string | — |

### 15. opi-sup-select(根据供应商编码产品ID查询省采购项目产品信息)

#### 介绍
通过供应商编码查询产品信息。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| addrCode | 省码 | string | — | — |


#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| select | 当用户手动点击数据行时触发的事件 | obj |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| prodId | 产品编码 | string | — |
| prodFullId | 产品全ID | string | — |
| prodName | 产品名称 | string | — |
| prjName | 项目名称 | string | — |
| prjId | 项目编码 | string | — |
| lifnr | 供应商编码 | string | — |

### 16. attachment-card(附件信息)

> 使用此组件前需要在 `config/index.js` 文件的http属性内设置attachment后端服务设置。具体请参见 `web-nonsource` 工程内的 `sample-page.vue`。

#### 介绍
支持上传附件的卡片。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| data | 附件卡片数据，数据结构参照下方说明（Data Structure） | array | — | — |
| title | 附件卡片标题 | string | — | 附件信息 |
| uploadConfig | 附件上传设置（支持 `upload` 上传组件的 `accept`） | string | — | 附件信息 |
| businessTypeConfig | 附件业务类型，数据结构参照下方说明 | array | — | — |
| readonly | 是否只读，设置为true的场合，不显示右上角上传菜单和删除按钮 | boolean | — | false |
| required | 是否必须 | boolean | — | false |
| beforeFileUploadFun | 上传之前的函数钩子，如果返回false则不上传，返回true正常上传 | Function(file) | — | 默认返回true |
| beforeFileDeleteFun | 删除之前的函数钩子，如果返回false则不删除，返回true正常删除 | Function(fileList) | — | 默认返回true |
| hideTitle | 是否隐藏标题 | boolean | — | false |
| dropdownMenuCustomClass | Dropdown菜单自定义类名 | String | — | — |
| fileLimit | 最大上传文件数 | Number | — | — |
| isShwoActionColumn | 是否显示操作列 | boolean | — | false |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| attachment-add | 上传的文件列表 | array |
| attachment-delete | 删除的文件列表 | array |

#### Methods
| 函数名 | 说明 | 参数 |
| ---- | ---- | ---- |
| validate | 校验附件数据，当 `required` 为 true，没有上传附件的场合，返回false | — |

#### data Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| viFileId | 文件ID | string | — |
| viFileName | 文件名称 | string | — |
| viFileUrl | 文件下载的URL | string | — |
| viFileBusinessType | 文件类型 | string | — |
| viCreateAuthor | 上传人 | string | — |
| viCreateDatetime | 上传时间 | string | — |

#### businessTypeConfig Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| label | 文件类型名称 | string | — |
| value | 文件类型值 | * | — |

### 17. employee-select(员工信息)

#### 介绍
通过检索信息查询对应“员工”的基本信息。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| nullValue | 返回空值的显示与隐藏 | Boolean | — | false |
| addrCode | 省码 | string | — | 'TJ' |
| inputEmployeeType | 员工类型 | string | 0:内部员工,1:供应商一级账号,2:供应商二级账号,3:内部专家,4:外部专家,5:代理机构,6:检测机构 | '' |
| inputEmployeeName | 员工姓名 | string | — | — |
| inputUserName | 系统账号 | string | — | — |
| disabledEmployeeType | 是否禁用员工类型 | string | Boolean | false |
| userStatus | 用户状态 | string | '1':有权; '2':(无效,无权) | — |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| select | 当用户手动点击数据行时触发的事件 | obj |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| employeeBasicNameCn | 姓名 | string | — |
| userId | 系统账号 | string | — |
| employeeBasicMobilePhone | 手机号 | string | — |
| employeeHomeEmail | 邮箱 | string | — |
| employeeBasicType | 员工类型 | string | — |
| orgAddrName | 部门名称 | string | — |

### 18. 【旧】examine-mdm(审批公共页面)

#### 介绍
老的审批组件，包括提交和领导审批功能。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| updateUserId | 更新人ID（提交审批页面必传） | string | — | — |
| procInstId | 流程ID（领导审批页面必传） | string | — | — |
| modelName | 流程名字 （提交审批页面必传）| Array | — | — |
| isDisabled | 是否可编辑 | Boolean | — | false |
| isShowExamine | 是否可显示（用于提交审批和领导审批页面显示或隐藏） | Boolean | — | true |
| receiveUserIdAutoFlag | — | Number | — | — |
| receiveUserList | — | Array | — | — |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| select | 当用户手动点击数据行时触发的事件 | obj |

####  data 对象
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| approveOpinion | 审批意见 | String | — |
| ifAgrees | 是否同意 | Number | — |
| type | 类型 | Number | — |
| nextNode | 下一节点 | string | — |
| procInstId | 流程ID | string | — |
| modelKey | 流程图 | string | — |
| taskType | 节点类型 | string | — |
| id | 节点ID | string | — |
| receiveUserId | 下一处理人 | string | — |
| taskName | 节点名称 | string | — |

####  checkField 对象(校验)
| 参数      | 说明          | 类型      | 说明 |
|---------- |-------------- |---------- |---------- |
| startNode | 可选流程 | String |  选中时该数据为空 |
| targetNode | 下一路径/退回路径 | String |  选中时该数据为空 |
| title | 下一处理人 | String |  选中时该数据为空 |
|*****当所有值都为空的时候才可以提交|

### 19. department-select(部门信息)

#### 介绍
通过检索信息查询对应“部门”的基本信息。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| addrCode | 省码 | string | — | — |
| nullValue | 返回空值的显示与隐藏 | Boolean | — | false |
| preDeptIdLike | 部门Id前段（根据该值进行对xxx%的模糊匹配） | string | — | '' |
| lock | 是否有权 | string | ''-全部，1-有权，0-无权 | '' |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| select | 当用户手动点击数据行时触发的事件 | obj |
| nullValue | 是否可以返回空值 | boolean | — | false |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| addrCode | 省码 | string | — |
| addrName | 省份名称 | string | — |
| deptId | 部门ID | string | — |
| deptName | 部门名称 | string | — |
| shortName | 部门简称 | string | — |
| lockMark | 状态 | string | — |

### 20. pro-select(工建需求申请信息查看)

#### 介绍
通过检索信息查看对应“工建需求申请”的基本信息。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| provinceCode | 省码 | string | — | — |
| sourceFlag | 是否有源申请 | string | 'Y':有源; 'N':无源 | Y |
| viprojectNum | 工建项目编号 | String | — | — |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| select | 当用户手动点击数据行时触发的事件 | obj |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| provinceName | 省公司 | string | — |
| projectNum | 工建项目编号 | string | — |
| projectName | 工建项目名称 | string | — |
| projectApprovalNum | 立项批复依据 | string | — |
| amountApproval | 批发含税金额(元) | string | — |
| amountApprovalNoTax | 批发不含税金额(元) | string | — |
| reqApplyNum | 工建需求申请单号 | string | — |
| reqApplyName | 工建需求名称 | string | — |

### 21. opi-select(产品主数据)

#### 介绍
通过检索信息查询对应“产品”的基本信息。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| addrCode | 省码 | string | — | — |
| viproductType | 产品类型 | string | '1';'2' | '1' |
| nullValue | 是否可以返回空值 | boolean | — | false |
| zfbprod | 非标产品标识 | string | '1':一采非标; '2':二采非标; '3' :标准产品; ' '：全部产品 | '3' |
| viTopoType | 采购类型 | string | '1':一级集采; '2':二级集采; '3':非集采; ' '：全部类型 | ' ' |
| flag | 动态显示下拉框 | string | '1':包括一级集采 ; '2':不包括一级集采 | ' ' |
| productNumList | 产品编码list | string | '310101001,311001003' | ' ' |
| productCatalogCode3 | 小类编码 | string | — | — |
| isHideProductTree | 是否隐藏产品树 | boolean | — | false |
| disabledProductCatalogCode3 | 是否禁止点击小类编码 | boolean | — | false |
| poDetailType | 采购细化类型 | string | '1':1,2,3. '2':1,3,4,5 | '1' |
| disabledProType | 是否禁止点击采购类型 | boolean | — | false |
| inputProType | 采购类型 | string | — | — |
| inputAblistFlg | 是否能力清单 | string | '';'1';'0' | '' |
| showAblistFlg | 是否显示是否能力清单 | boolean | — | false |
| disabledAblistFlg | 是否禁止是否能力清单 | boolean | — | false |
| poYear | 采购年份 | string | — | — |
| flgDel | 无效标识筛选 | string | 1-无效，0-有效 | '' |
| closeClearSelection | 是否点击提交时清空多选 | boolean | — | true |
| $refs.clearSelection | 清空多选 | function | — | — |
| showIsIncludedContract | 是否显示是否存在可用框架合同 | boolean | — | false |
| showPurchasingDept | 是否显示采购部门 | boolean | — | false |
| inputIsIncludedContract | 是否存在可用框架合同 | string | 0：否；1：是, -1:全部 | -1 |
| inputPurchasingDept | 采购部门 | string | '':全部，1：采购一部；2：采购二部；3：采购三部；4：采购4部 | '' |
| disabledIsIncludedContract | 是否禁止是否存在可用框架合同 | boolean | — | false |
| disabledPurchasingDept | 是否禁止采购部门 | boolean | — | false |
| showViproductType | 是否显示产品范围 | boolean | — | false |
| disabledViproductType | 是否禁止产品范围 | boolean | — | false |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| select | 当用户手动点击数据行时触发的事件 | obj |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| productNum | 产品编码 | string | — |
| productName | 产品名称 | string | — |
| productCatalogName3 | 小类名称   | string | — |
| unitOfMeasure | 单位 | string | — |
| poTypeLabel | 采购类型 | string | — |
| isIncludedContract | 是否存在可用框架 | string | — |
| purchasingDept | 采购部门 | string | — |

### 22. matter-detail-select(组合件明细查看)

#### 介绍
通过检索信息查看对应“组合件明细”的基本信息。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| materialCode | 产品类型 | string |  — |  — |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| materialNum | 物料编码 | string | — |
| materialDesc | 物料描述 | string | — |
| quantity | 数量   | string | — |
| unitMeasure | 单位 | string | — |

### 23. 【旧】examineHistory-mdm(流程追踪页面)

#### 介绍
该审批流程号下的所有提交与审批历史记录。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| procInstId | 流程ID（必传） | string | — | — |
| bizId | 业务单据ID | string | — | — |
| taskTitle | 待办标题 | string | — | — |
| isSubmitNextNode | 更新流程追踪数据（看业务需求，需要数据更新的时候传 true） | Boolean | — | false |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| taskName | 环节名称 | string | — |
| approveUserName | 处理人 | string | — |
| createTime | 开始时间 | string | — |
| approveTime | 处理时间 | string | — |
| result | 处理结果 | string | — |
| approveOpinion | 处理意见 | string | — |

### 23-1. 【新】bpm-history-card(流程履历卡片)

#### 介绍
新开发的工作流流程履历卡片。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| procInstId | 流程实例id，不传入请求2、3期数据 | String | — | — |
| isSubmitNextNode | 更新流程追踪数据（看业务需求，需要数据更新的时候传 true） | Boolean | — | false |
| bizId | 业务id | String | — | — |
| bizType | 业务类型 | String | — | — |
| taskTitle | 待办标题 | string | — | — |

### 23. examineHistories-card(流程追踪页面 (框架合同用))

#### 介绍
该审批流程号下的所有提交与审批历史记录(框架合同用)。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| procInstId | 流程ID（必传） | Array | — | — |
| isSubmitNextNode | 更新流程追踪数据（看业务需求，需要数据更新的时候传 true） | Boolean | — | false |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| taskName | 环节名称 | string | — |
| createTime | 开始时间 | string | — |
| approveUserName | 处理人 | string | — |
| approveTime | 处理时间 | string | — |
| result | 处理结果 | string | — |
| approveOpinion | 处理意见 | string | — |

### 24. sublibrary-select(子库选择)

#### 介绍
通过检索信息查询对应“子库”的基本信息。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| addrCode | 省码 | string | — | — |
| ouCode | OU编码 | string | — | — |
| ioCode | IO编码 | string | — | — |
| userId | 用户ID(邮箱) | string | — | — |
| nullValue | 是否可以返回空值 | boolean | — | false |
| warehouseCode | 仓库编码 | string | — | — |
| permissionFilter | 是否过滤权限 | string | 1：过滤，其他不过滤 | — |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| select | 当用户手动点击数据行时触发的事件 | obj |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| secondaryInventoryName | 子库编码 | string | — |
| description | 子库名称 | string | — |
| locatorTypeDesc | 货位控制 | string | — |

### 25. allclass-select(产品选择)

#### 介绍
通过级联选择对应“大中小类产品”。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| addrCode | 省码 | string | — | — |
| viproductType | 细化产品 | string | — | '2' |
| nullValue | 是否可以返回空值 | boolean | — | false |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| select | 当用户手动点击数据行时触发的事件 | obj |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| productCatalogName1 | 大类产品名称 | string | — |
| productCatalogCode1 | 大类产品编码 | string | — |
| productCatalogName2 | 中类产品名称 | string | — |
| productCatalogCode2 | 中类产品编码 | string | — |
| productCatalogName3 | 小类产品名称 | string | — |
| productCatalogCode3 | 小类产品编码 | string | — |

### 26. bank-select(开具银行信息选择)

#### 介绍
通过检索信息查询对应“开具银行”的基本信息。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| nullValue | 是否可以返回空值 | boolean | — | false |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| select | 当用户手动点击提交时时触发的事件 | obj |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| bankId | 银行代码 | string | — |
| bankName | 银行名称 | string | — |

### 27. expenseAccount-select(费用科目信息)

#### 介绍
通过检索信息查询对应“费用科目”的基本信息。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| nullValue | 是否可以返回空值 | boolean | — | false |
| loginUserId | 登录者用户ID | String | — | — |
| summaryFlag | 父 | String | 'Y':是; 'N':否 | — |
| enabledFlag | 是否启用 | String | 'Y':是; 'N':否 | — |
| accountType | 账户类型 | String | 'A':资产类账户; 'L':负债类账户; 'O':所有者权益类账户; 'R':收入类账户; 'E':费用类账户 | — |
| segmentType | 段类型 | String | 'CMCC_COA_CO':公司段; 'CMCC_COA_CC':成本中心段; 'CMCC_COA_AC':科目段; 'CMCC_COA_SAC':子目段; 'CMCC_COA_IC':往来段; 'CMCC_COA_PJ':项目段; 'CMCC_COA_SP1':备用段1; 'CMCC_COA_SP2':备用段2 | — |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| select | 当用户手动点击数据行时触发的事件 | obj |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| flexValueDisp | 费用科目值 | string | — |
| description | 费用科目说明 | string | — |

### 28. product-tree-select(产品树选择下拉框)

#### 介绍
通过查询sap的表获取产品树。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| addrCode | 省码 | String | — | 'TJ' |
| productType | 产品类型 | String | — | '2' |
| placeholder | 输入框占位文本 | String | — | '' |
| disabled | 是否禁用 | Boolean | — | false |
| clearable | 是否支持清空选项 | Boolean | — | false |
| expandTrigger | 次级菜单的展开方式 | String | 'click' / 'hover' | 'click' |
| showAllLevels | 输入框中是否显示选中值的完整路径 | Boolean | — | true |
| checkStrictly | 是否严格的遵守父子节点不互相关联 | Boolean | — | false |
| level | 需要查询的层级号 | Number | — | — |
| isHideGreaterLevel | 是否隐藏大于level参数的数据 | Boolean | — | false |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| change | 当绑定值变化时触发的事件 | {value:节点的值数组, label: 节点的label数组, selectedNodes: 选中的节点实例数组} |
| blur | 在 Cascader 失去焦点时触发 | (event: Event) |
| focus | 在 Cascader 获得焦点时触发 | (event: Event) |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| productNum | 产品编码 | string | — |
| productName | 产品名称 | string | — |
| isNextNode | 是否存在子节点 | string | — |
| list | 子节点 | Array | — |

### 29. product-level-tree-select(产品树新增选择下拉框)

#### 介绍
通过查询orcale的表获取产品树，业务组新增后会回写sap表（28. product-tree-select(产品树选择下拉框)）。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| addrCode | 省码 | String | — | 'TJ' |
| level | 层级 | String | '1'; '2'; '3'; '4'; '5'; | — |
| placeholder | 输入框占位文本 | String | — | '' |
| disabled | 是否禁用 | Boolean | — | false |
| clearable | 是否支持清空选项 | Boolean | — | false |
| expandTrigger | 次级菜单的展开方式 | String | 'click' / 'hover' | 'click' |
| showAllLevels | 输入框中是否显示选中值的完整路径,同时决定是否只显示叶子结点参数 | Boolean | — | true |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| change | 当绑定值变化时触发的事件 | {values:节点的值数组, labels: 节点的label数组, selectedNodes: 选中的节点实例数组,value: 对应level的value, label: 对应level的label} |
| blur | 在 Cascader 失去焦点时触发 | (event: Event) |
| focus | 在 Cascader 获得焦点时触发 | (event: Event) |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| productNum | 产品编码 | string | — |
| productName | 产品名称 | string | — |
| isNextNode | 是否存在子节点 | string | — |
| isEffective | 是否可以点击 | string | — |
| list | 子节点 | Array | — |

### 30. contract-xf-select(下发框架合同信息)

#### 介绍
通过检索信息查询对应“下发框架合同”的基本信息。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| addrCode | 省码 | String | — | 'TJ' |
| nullValue | 返回空值的显示与隐藏 | Boolean | — | true |
| inputEmployeeType | 员工类型 | string | 0:内部员工,1:供应商一级账号,2:供应商二级账号,3:内部专家,4:外部专家,5:代理机构,6:检测机构 | '' |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| select | 当用户手动点击数据行时触发的事件 | obj |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| addrCode | 下发省码 | string | — |
| ebeln | 采购凭证号 | string | — |
| lifnr | 供应商编码 | string | — |
| lifnrName | 供应商名称 | string | — |
| zcgxm | 采购项目 | string | — |
| zcoid | 合同系统合同号 | string | — |
| zcomc | 合同名称 | string | — |
| zfounderName | 创建人 | string | — |
| kdatb | 有效起始日期 | string | — |
| kdate | 有效截至日期 | string | — |

### 31. import-dialog(导入弹窗)

#### 介绍
需要往自定义接口中导入文件的弹窗，同时支持根据业务添加自定义按钮插槽。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| param | 请求参数 | Object | — | — |
| url | 请求地址 | String | — | — |
| title | 弹窗标题 | String | — | '导入' |
| module | 模版模块 | String | — | — |
| code | 模版码 | String | — | — |
| isShowDownloadBtn | 是否显示下载按钮 | Boolen | — | true |

#### slot
| name      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| customBtn | 插槽 | html | — | — |


#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| initProTable | 上传成功是的回调函数 | Function |

### 32. procurement-all-select(采购项目信息(一采、总部一采、省采购))

#### 介绍
通过检索信息查询对应“采购项目”的基本信息(查询的是视图）。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| nullValue | 返回空值的显示与隐藏 | Boolean | — | false |
| addrCode | 省码 | String | — | — |
| status | 状态 | String | '0':保存未提交; '1':审批中; '2':审批通过; 其他:驳回 | — |
| statusPrj | 采购项目状态 | String | '1':立项未启动; '2':项目终止; '3':项目流标; '4':项目关闭 | — |
| zfbprod | 是否过滤非标产品 | String | '1':不过滤; '2':过滤 | — |
| purType | 默认初始化查询 | String | ''、全部;-1、全部一采;-2、全部二采;1、一级集采;2、总部自采-横向部门;3、二级集采;4、省自采-横向部门;5、总部来函一采项目;6、合同项目;7、分公司采购;8、分配一采结果项目 | 1 |
| purList | 下拉选得条件(如果修改此参数需要将‘purType’同时修改为purList的第一个value值或其他value值) | Array | — | [{label: '显示名称',value: '值'}] |
| createDepID | 创建部门 | String | — | — |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| select | 当用户手动点击数据行时触发的事件 | obj |
| nullValue | 是否可以返回空值 | boolean | — | false |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| prjId | 项目编码 | string | — |
| prjName | 项目名称 | string | — |
| prjMgr | 项目经理 | string | — |
| purType2.label | 集采类型 | string | — |
| costType.label | 开支类型 | string | — |
| purMethod | 采购方式 | string | — |
| numAmount | 控制方式 | string | — |
| statusPrj | 项目状态 | string | — |

### 33. addr-select(省市级联选择器)

#### 介绍
选择省市的级联选择器。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| level | 需要查询到省或者市 | Number | 1: 省; 2: 市; | 2 |
| placeholder | 输入框占位文本 | String | — | '' |
| disabled | 是否禁用 | Boolean | — | false |
| clearable | 是否支持清空选项 | Boolean | — | false |
| customList | 需要插入到备选列表中的数据(插入到首位) | 【{addrCode:'', addrName:''}】 | — | — |
| showAllLevels | 输入框中是否显示选中值的完整路径 | Boolean | — | true |
| theCityToBeShown | 要显示的省下的城市 | Aarray | 【'AH','LN'】 | — |
| excludeAddrCodeList | 排除省码（多个用,分割） | String | 'AH,LN' | — |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| change | 当绑定值变化时触发的事件 | {value:节点的值数组, label: 节点的label数组, selectedNodes: 选中的节点实例数组} |
| blur | 在 Cascader 失去焦点时触发 | (event: Event) |
| focus | 在 Cascader 获得焦点时触发 | (event: Event) |

### 34. 【新】bpm-submit(提交流程卡片)、bpm-submit-select(提交流程弹窗)

#### 介绍
新开发的工作流提交卡片。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| updateUserId | 登录人用户id | String | — | — |
| procInstId | 驳回时传入的流程id | String | — | — |
| modelName | 启动流程用的modelName | Array{addrCode,modelKey,modelName} | — | — |
| isDisabled | 驳回时后可选流程的置灰效果 | Boolean | — | false |
| isShowExamine | 卡片的显示与隐藏 | Boolean | — | true |
| receiveUserIdAutoFlag | 业务组手动传入下一处理人 | Number | 传入时传入1 | — |
| receiveUserList | 传入的下一处理人list | Array | label,value的形式 | — |
| returnId | 业务手动传入下一处理人，根据returnId来确定下一路径 | String | — | — |
| addrCode | 省码 | String | — | — |
| isSelectAll |  投票会签初始化是否全选显示在input，默认true显示 | Boolean | — | true |
| filterNextNode |  过滤下一路径 | Object | — | — |
| forcedReplacementData |  强制替换下一处理人(如果是多选时，要给每个人加deptList属性，该属性由业务组自己获取) | Array（Object） | — | — |
| voteSignDisabled |  投票会签禁止编辑 | Boolean | — | false |

#### forcedReplacementData[0] Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| taskName | 节点名称 | String | — | — |
| userList | 下一处理人列表 | Array（Object） | — | — |

#### forcedReplacementData[0].userList[0] Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| label | 人员名称 | String | — | — |
| value | 人员编号 | String | — | — |
| deptList | 部门信息（下一处理人为多选级联下拉时必填） | Array（Object） | — | — |

#### forcedReplacementData[0].userList[0].deptList[0] Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| orgCode | 部门ID | String | — | — |

#### filterNextNode Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| type | 过滤模式 | String | noFilter:不过滤; whitelist:白名单; blacklist:黑名单 | noFilter |
| list | 过滤项 | Array（String） | — | — |

### 35. 【新】bpm-approve(领导审批卡片)、bpm-approve-select(领导审批弹窗)

#### 介绍
新开发的工作流审批卡片。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| updateUserId | 登录人用户id | String | — | — |
| customCounterSignerList | 并行会签手动传入下一处理人(如果是多选时，要给每个人加deptList属性，该属性由业务组自己获取) | Array【dataList：【label,value】,taskName：string】 | — | — |
| procInstId | 流程id | String | — | — |
| isShowExamine | 卡片的显示与隐藏 | Boolean | — | false |
| receiveUserIdAutoFlag | 业务组手动传入下一处理人 | Number | 传入时传入1 | — |
| receiveUserList | 传入的下一处理人list | Array | label,value的形式 | — |
| returnId | 业务手动传入下一处理人，根据returnId来确定下一路径 | String | — | — |
| addrCode | 省码 | String | — | — |
| isSelectAll |  投票会签初始化是否全选显示在input，默认true显示 | Boolean | — | true |
| filterNextNode |  过滤下一路径 | Object | — | — |
| inputIsApprove |  默认是否同意 | Boolean | — | true |
| inputIsApproveDisabled |  是否禁用同意驳回 | Boolean | — | false |
| forcedReplacementData |  强制替换下一处理人(如果是多选时，要给每个人加deptList属性，该属性由业务组自己获取) | Array（Object） | — | — |
| voteSignDisabled |  投票会签禁止编辑 | Boolean | — | false |

#### forcedReplacementData[0] Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| taskName | 节点名称 | String | — | — |
| userList | 下一处理人列表 | Array（Object） | — | — |

#### forcedReplacementData[0].userList[0] Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| label | 人员名称 | String | — | — |
| value | 人员编号 | String | — | — |
| deptList | 部门信息（下一处理人为多选级联下拉时必填） | Array（Object） | — | — |

#### forcedReplacementData[0].userList[0].deptList[0] Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| orgCode | 部门ID | String | — | — |

#### filterNextNode Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| type | 过滤模式 | String | noFilter:不过滤; whitelist:白名单; blacklist:黑名单 | noFilter |
| list | 过滤项 | Array（String） | — | — |

### 36. contract-select(框架合同信息)

#### 介绍
通过检索信息查询对应“框架合同”的基本信息。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| addrCode | 省码 | String | — | 'TJ' |
| purchaseType | 类型 | String | '1':集采；'2'：一采 | '' |
| nullValue | 返回空值的显示与隐藏 | Boolean | — | true |
| inputEmployeeType | 员工类型 | string | 0:内部员工,1:供应商一级账号,2:供应商二级账号,3:内部专家,4:外部专家,5:代理机构,6:检测机构 | '' |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| select | 当用户手动点击数据行时触发的事件 | obj |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| addrCode | 下发省码 | string | — |
| ebeln | 采购凭证号 | string | — |
| lifnr | 供应商编码 | string | — |
| lifnrName | 供应商名称 | string | — |
| zcgxm | 采购项目 | string | — |
| zcoid | 合同系统合同号 | string | — |
| zcomc | 合同名称 | string | — |
| zfounderName | 创建人 | string | — |
| kdatb | 有效起始日期 | string | — |
| kdate | 有效截至日期 | string | — |

### 37. user-byFixedRoles-select(选择特定角色)

#### 介绍
选择“特定角色”的弹窗。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| nullValue | 返回空值的显示与隐藏 | Boolean | — | false |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| select | 当用户点击提交时触发的事件 | Array |
| clearSelect | 当用户点击返回空值时触发的事件 | Array |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| displayName | 展示名称 | string | — |
| userId | 用户id | string | — |
| userName | 用户名称 | string | — |
| ref_1 | 类型 | string | — |
| displayName | 展示名称 | string | — |

### 38. asset-class-select(查询需求交接单相关资产类别信息)

#### 介绍
通过检索信息查询对应“资产类别”的基本信息（从sap获取数据）。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| nullValue | 返回空值的显示与隐藏 | Boolean | — | false |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| select | 当用户点击提交时触发的事件 | Array |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| assetId | 资产类型 | string | — |
| assetName | 资产名称 | string | — |

### 39. old-asset-tag-select(查询需求交接单相关旧资产标签信息)

#### 介绍
通过检索信息查询对应“旧资产标签”的基本信息。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| nullValue | 返回空值的显示与隐藏 | Boolean | — | false |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| select | 当用户点击提交时触发的事件 | Array |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| prjId | 产品编码 | string | — |
| zasstTxt | 旧资产标签 | string | — |

### 40. capacity-list-select(能力清单信息)

#### 介绍
通过检索信息查询对应“能力清单”的基本信息。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| prodFullId | 产品编码 | String | — | — |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| publishName | 产品发布名称 | string | — |
| lifnrId | 产品销售供应商编码 | string | — |
| lifnrName | 产品销售供应商名称 | string | — |

### 41. asset-class-oracle-select(选择资产类别)

#### 介绍
通过检索信息查询对应“资产类别”的基本信息（从oracle获取数据）。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| nullValue | 返回空值的显示与隐藏 | Boolean | — | false |
| addrCode | 省码 | String | — | — |
| initSearchData | 初始化传入的搜索条件 | String | — | — |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| select | 当用户点击提交时触发的事件 | Array |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| assetId | 资产类型 | string | — |
| assetName | 资产名称 | string | — |

### 42. attachment-dialog(上传附件-弹窗)

#### 介绍
支持在弹窗中上传附件的搜索帮助。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| data | 附件列表数据 | Array | — | — |
| uploadConfig | — | Object{ accept: String } | — | — |
| businessTypeConfig | — | Array{ label: String, value: String || Object, uploadConfig: { accept: String } } | — | — |
| readonly | 是否只读 | Boolean | — | false |
| required | 是否必须上传附件 | Boolean | — | false |
| hideTitle | 是否隐藏标题 | Boolean | — | false |
| dropdownMenuCustomClass | Dropdown菜单自定义类名 | String | — | — |
| beforeFileUploadFun | 上传之前的函数钩子，如果返回false则不上传，返回true正常上传 | Function | — | true |
| beforeFileDeleteFun | 删除之前的函数钩子，如果返回false则不删除，返回true正常删除 | Function | — | true |
| fileLimit | 上传文件最大个数 | Number | — | — |
| title | 主标题 | String | — | — |
| subTitle | 副标题 | String | — | 默认使用主标题 |
| fileLimit | 最大上传文件数 | Number | — | — |
| noDownload | 禁止下载 | Boolean | — | false |
| isShwoActionColumn | 是否显示操作列 | boolean | — | false |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| attachment-add | 当用户添加附件时触发的事件 | currentFile, ret |
| attachment-delete | 当用户删除附件时触发的事件 | fileInfo, deleteFileList |
| attachment-select | 当用户点击提交时触发的事件 | fileList |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| viFileName | 文件名称 | string | — |
| viFileBusinessType | 文件类型 | string | — |
| viCreateAuthorName | 上传人 | string | — |
| viCreateDatetime | 上传时间 | string | — |

### 43. available-frame-select(可用框架信息)

#### 介绍
通过检索信息查询对应“可用框架”的基本信息。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| addrCode | 省码 | String | — | — |
| submitBtnName | 提交按钮名称 | String | — | — |
| inputProdFullId | 产品编码 | String | — | — |
| inputPrjMgr | 项目经理 | String | — | — |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| select | 当用户点击提交时触发的事件 | fileList |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| prodId | 产品编码 | string | — |
| prodName | 产品名称 | string | — |
| zcoid | 框架/合同号 | string | — |
| zcomc | 框架/合同描述 | string | — |
| zcgxm | 采购项目 | string | — |
| prjMgr | 项目经理 | string | — |
| lifnrName | 供应商名称 | string | — |

### 44. demand-survey-select(需求调查)

#### 介绍
通过检索信息查询对应“任务”的基本信息。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| inputTaskCode | 任务编码 | String | — | — |
| inputTaskName | 任务名称 | String | — | — |
| demandType | 任务名称 | String | — | — |
| prjCode | 采购项目编码 | String | — | — |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| select | 当用户点击提交时触发的事件 | fileList |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| inputTaskCode | 任务编码 | String | — |
| inputTaskName | 任务名称 | String | — |

### 45. print-card(打印卡片)

#### 介绍
打印组件内部的内容

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| printData | 需要打印的参数 | Obj | — | — |

#### printData Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| title | 主标题 | String | — | — |
| subTitle | 副标题 | String | — | — |
| info | 详细信息 | Object | — | — |
| table | 表格信息 | Object | — | — |
| message | 提示信息 | String | — | — |
| sign | 签字信息 | Object | — | — |

#### printData.info Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| labelWidth | 标题宽度 | Object | — | — |
| list | 需要显示的列及相关配置 | Array（Object） | — | — |

#### printData.info.list Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| label | 标题名称 | String | — | — |
| value | 值(如果是图片，需要传图片的base64值) | String | — | — |
| isImg | 是否是图片 | Boolean | — | false |
| imgTitle | 图片名称（依赖isImg） | String | — | — |
| imgWidth | 图片显示宽度（单位：同css）（依赖isImg） | String | — | — |

#### printData.table Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| setting | 表格相关设置 | Array(Object) | — | — |
| datas | 表格数据 | Array（Object） | — | — |

#### printData.table.setting Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| title | 列标题 | String | — | — |
| prop | 列属性名 | String | — | — |
| width | 列宽（%） | String | — | — |
| sum | 列求和 | Boolean | — | false |

#### printData.table.datas Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| prop | setting中设置的prop值 | String | — | — |

#### printData.sign Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| labelWidth | 签名间距（实际上是每个的margin-right）（px） | String | — | — |
| list | 需要签名的人 | Array（String） | — | — |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| $refs.componetName.onPrint() | 触发组件的打印事件 | — |

### 46. project-tasks-select(工建项目任务信息)

#### 介绍
通过检索信息查询对应“项目任务”的基本信息。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| orgId | OU组织编码 | string | — | — |
| inputSegment1 | 项目编号 | string | — | — |
| chargeableFlag | 可计费 | string | — | — |
| billableFlag | 可资本化 | string | — | — |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| select | 当用户点击提交时触发的事件 | fileList |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| orgId | OU组织编码 | String | — |
| orgName | OU组织名称 | String | — |
| projectManager | 项目经理 | String | — |
| taskManager | 任务经理 | String | — |
| segment1 | 项目编号 | String | — |
| projectName | 项目名称 | String | — |
| taskNumber | 任务编号 | String | — |
| taskName | 任务名称 | String | — |
| startDate | 任务起始日期 | String | — |
| completionDate | 任务完成日期 | String | — |
| chargeableFlag | 可计费 | String | — |
| billableFlag | 可资本化 | String | — |

### 47. project-expenditure-select(工建项目支出信息)

#### 介绍
通过检索信息查询对应“项目支出”的基本信息。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| select | 当用户点击提交时触发的事件 | fileList |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| expenditureTypeId | 支出类型编码 | String | — |
| expenditureType | 支出类型名称 | String | — |
| description | 描述 | String | — |
| expenditureCategory | 支出分类 | String | — |
| startDateActive | 启用日期 | String | — |
| endDateActive | 失效日期 | String | — |

### 48. sup-contact-select(供应商联系人信息)

#### 介绍
通过检索信息查询对应“供应商联系人”的基本信息。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| addrCode | 省码 | string | — | — |
| purchaseType | 是否是采购类型 | string | Y:采购类型,N:非采购类型 | — |
| loginUserId | 登录用户ID | string | — | — |
| ouCode | OU组织编码（仅在输入省码为ERP大集中的省份时有效） | string | — | — |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| select | 当用户手动点击数据行时触发的事件 | obj |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| lifnr | 供应商编码 | string | isERPCentralization = 1 |
| name | 供应商名称 | string | isERPCentralization = 1 |
| addrCode | 省码 | string | isERPCentralization = 1 |
| vatFlag | 纳税资质 | string | isERPCentralization = 1 |
| vendorSitCode | 供应商地址编码（非ERP大集中使用） | string | isERPCentralization = 1 |
| ouName | OU组织名称 | string | isERPCentralization = 1 |
| contactName | 联系人姓名 | string | isERPCentralization = 1 |
| contactPhone | 联系人电话 | string | isERPCentralization = 1 |
| contactFax | 联系人传真 | string | isERPCentralization = 1 |
| contactMail | 联系人邮箱 | string | isERPCentralization = 1 |
| lifnr | 供应商编码 | string | isERPCentralization = 2 |
| name | 供应商名称 | string | isERPCentralization = 2 |
| address | 供应商地址 | string | isERPCentralization = 2 |
| addrCode | 省码 | string | isERPCentralization = 2 |
| sourceCode | 数据来源 | string | isERPCentralization = 2 |
| innerFlag | 是否为关联方 | string | isERPCentralization = 2 |
| innerCode | 关联码 | string | isERPCentralization = 2 |
| vatFlag | 纳税资质 | string | isERPCentralization = 2 |
| ouCode | OU组织编码 | string | isERPCentralization = 2 |
| ouName | OU组织名称 | string | isERPCentralization = 2 |
| contactName | 联系人姓名 | string | isERPCentralization = 2 |
| contactCellphone | 联系人手机 | string | isERPCentralization = 2 |
| contactPhone | 联系人电话 | string | isERPCentralization = 2 |
| contactFax | 联系人传真 | string | isERPCentralization = 2 |
| contactMail | 联系人邮箱 | string | isERPCentralization = 2 |

### 49. region-select(大区信息)

#### 介绍
通过检索信息查询对应“大区-省份-地市”的基本信息。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| inputSelectKey | 查询范围 | string | "1":大区 — 省份; "2":大区 — 省份 — 地市 | '1' |
| inputDqCode | 大区编码 | string | — | — |
| inputAddrCode | 省份编码 | string | — | — |
| inputCityCode | 地市编码 | string | — | — |
| selectKeyDisabled | 是否禁用查询范围 | Boolean | — | false |
| dqCodeDisabled | 是否禁用大区编码 | Boolean | — | false |
| addrCodeDisabled | 是否禁用省份编码 | Boolean | — | false |
| cityCodeDisabled | 是否禁用地市编码 | Boolean | — | false |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| select | 当用户点击提交时触发的事件 | fileList |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| dqCode | 大区编码 | String | — |
| dqName | 大区名称 | String | — |
| addrCode | 省份编码 | String | — |
| addrName | 省份名称 | String | — |
| cityCode | 地市编码 | String | — |
| cityName | 地市名称 | String | — |

### 50. io-account-alias-select(库存组织账户别名信息)

#### 介绍
通过检索信息查询对应“库存组织账户别名”的基本信息。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| addrCode | 省码 | String | — | — |
| ouId | ouId | String | — | — |
| organizationCode | 库存组织代码 | String | — | — |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| select | 当用户点击提交时触发的事件 | fileList |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| mdDescription | 账户别名 | String | — |
| mdCode | 账户别名编码 | String | — |
| ouName | OU名称 | String | — |
| ouId | OU编码 | String | — |
| organizationName | 库存组织名称 | String | — |
| organizationCode | 库存组织代码 | String | — |
| invType | 库存组织类型 | String | — |
| invTypeDescription | 库存组织类型描述 | String | — |
| companyCode | 公司编码 | String | — |
| costAccount | 费用账户 | String | — |
| effectiveDate | 起始日期 | String | — |
| expiryDate | 到期日期 | String | — |

### 51. subclass-select(查询小类信息)

#### 介绍
通过检索信息查询对应“查询小类信息”的基本信息。

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| addrCode | 省码 | String | — | — |
| poYear | 有效年份 | String | — | — |
| inputProductCatalogCode3 | 小类编码 | String | — | — |
| productCatalogCode3Disabled | 是否禁用小类编码 | Boolean | — | false |
| inputProductCatalogName3 | 小类名称 | String | — | — |
| productCatalogName3Disabled | 是否禁用小类名称 | Boolean | — | false |

#### Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| select | 当用户点击提交时触发的事件 | fileList |

#### obj Structure
| 参数      | 说明          | 类型      |
|---------- |-------------- |---------- |
| productCatalogCode3 | 小类编码 | String | — |
| productCatalogName3 | 小类名称 | String | — |

<!-- ## <div id="history">更新历史</div><a href="top">返回</a> -->
## <a name="history">公共组件更新历史</a> <kbd>[返回顶部][top]</kbd>
[top]: #top

> 版本号： v1.2.0  
> 更新时间：2020-04-29 
> 更新内容：  
>> 1.新增：51.subclass-select(查询小类信息);  
  
* * *  
> 版本号： v1.1.8  
> 更新时间：2020-04-20 
> 更新内容：  
>> 1.增加：32.procurement-all-select(采购项目信息(一采、总部一采、省采购))增加“createDepID：创建部门id”;  
  
* * *  
> 版本号： v1.1.7  
> 更新时间：2020-04-09 
> 更新内容：  
>> 1.增加：17.employee-select(员工信息)搜索条件“员工类型”支持传入参数与控制是否禁用;  
  
* * *  
> 版本号： v1.1.6  
> 更新时间：2020-04-02 
> 更新内容：  
>> 1.增加：46.project-tasks-select(工建项目任务信息)增加搜索条件“可计费”和“可资本化”;  
>> 1.增加：49.region-select(大区信息)所有搜索条件可传入，可以控制是否禁用;  
  
* * *  
> 版本号： v1.1.5  
> 更新时间：2020-03-05 
> 更新内容：  
>> 1.增加：41. asset-class-oracle-select(选择资产类别)组件initSearchData(初始化传入的搜索条件)参数;  
  
* * *  
> 版本号： v1.1.4  
> 更新时间：2020-03-02  
> 更新内容：  
>> 1.增加：7.store-house-select(仓库)增加preLgortLikeList(仓库编码前段模糊匹配)字段;  
  
* * *  
> 版本号： v1.1.3  
> 更新时间：2020-02-28  
> 更新内容：  
>> 1.修改：19.部门信息增加preDeptIdLike搜索字段;  
  
* * *  
> 版本号： v1.1.2  
> 更新时间：2020-02-25  
> 更新内容：  
>> 1.修改：8.库存组织增加列表展示字段：库存组织类型，库存组织类型描述;  
  
* * *  
> 版本号： v1.1.1  
> 更新时间：2020-01-14  
> 更新内容：  
>> 1.修改：4.project-select初始化不查询指定参数的问题;  
  
* * *  
> 版本号： v1.1.0  
> 更新时间：2020-01-13  
> 更新内容：  
>> 1.新增组件50.io-account-alias-select(库存组织账户别名信息);  
  
* * *  
  
> 版本号： v1.0.1  
> 更新时间：2019-12-24  
> 更新内容：  
>> 1.修复了"7.store-house-select(仓库)"出现"提交"按钮的bug;  
>> 2.统一了搜索帮助清空按钮的清空逻辑;  
  
* * *  
  
> 版本号： v1.0.0  
> 更新时间：2019-12-24  
> 更新内容：  
>> 1.公共组件帮助文档增加更新历史功能；  
