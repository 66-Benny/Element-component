import ErrorHanlder from './src/error-hanlder.vue';

/* istanbul ignore next */
ErrorHanlder.install = (Vue) => {
  Vue.component(ErrorHanlder.name, ErrorHanlder);
};

export default ErrorHanlder;

