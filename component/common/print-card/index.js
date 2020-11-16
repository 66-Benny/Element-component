import PrintCard from './src/print-card';

/* istanbul ignore next */
PrintCard.install = (Vue) => {
  Vue.component(PrintCard.name, PrintCard);
};

export default PrintCard;
