# web-common-component

前端公共业务组件

>本仓库用于管理供应链管理系统四期页面所依赖的公共业务组件。

## 公共组件定义

对于一些可能被多处引用的功能模块，建议提炼成业务组件统一管理。这些组件一般有以下特征：

- 只负责一块相对独立，稳定的功能；

- 没有单独的路由配置；

- 可能是纯静态的，也可能包含自己的 state，但不涉及 vuex 的数据流，仅受父组件（通常是一个页面）传递的参数控制。

## 代码创建规约：

公共组件的创建需遵循以下规定：

- 建立以组件名命名的文件夹，为了不引起大小写不敏感的文件系统的问题，单词使用横线连接 (kebab-case)。
- 命名尽量体现组件的功能，譬如unit-select。
- 对于较为复杂的组件，尽量依据组件功能分为多个组件文件。
- 在组件文件夹下新建 `src` 目录，其内放置组件文件。与 `src` 目录同级放置 `index.js`用于导出组件。

```javascript
// unit-select.vue
<template>
  <div class="scm-unit-select">
    单位信息
  </div>
</template>
<script>
export default {
  name: 'ScmUnitSelect',
};
</script>
<style lang="scss">
.scm-unit-select{
}
</style>


// index.js
import ScmUnitSelect from './src/unit-select';

/* istanbul ignore next */
ScmUnitSelect.install = function (Vue) {
  Vue.component(ScmUnitSelect.name, ScmUnitSelect);
};

export default ScmUnitSelect;
```

## 代码编写规约

[JavaScript代码编写规约](https://github.com/airbnb/javascript)

[Vue代码编写规约](https://cn.vuejs.org/v2/style-guide)

## 代码管理方式

本仓库代码通过 `Git子模块(submodules)` 的方式由各个业务模块前端项目（例：无源采购申请`web-nonsource` ）引入，并保持同步。

## 公共组件代码的新建/修改流程

公共组件开发人员在依赖其所开发的公共组件的业务模块前端项目（譬如无源采购申请页面 `web-nonsource` ）内进行公共组件的开发工作。开发完成后通过如下命令进行公共组件代码的提交并通知 `SCM(Software Configuration Management)` 更新各个业务模块前端项目：

```bash
// 拉取最新公共组件代码
git pull
// 将代码放进git暂存区
git add .
// 提交代码
git commit -m "comment"
// 推送代码至公共组件代码仓库(web-common-component)
git push origin master
```

## 公共组件代码的更新流程

> 公共组件代码的更新脚本已在各个业务模块前端项目内定义，可直接使用。

#### 第一次克隆(Clone)业务模块前端项目的场合，使用如下命令：

```bash
yarn initial:common-component
```

#### 拉取业务模块前端项目内公共组件代码的场合，使用如下命令：

```bash
// 更新所依赖的公共组件代码版本(对于一次版本更新此命令只需执行一次)
// 建议执行人员：SCM(Software Configuration Management)
yarn upgrade-commit:common-component
// 更新公共组件代码（其他业务模块前端开发者只需执行此命令）
// 建议执行人员：开发者(software developer)
yarn upgrade:common-component
```