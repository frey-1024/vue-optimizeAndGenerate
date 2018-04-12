import { compileToFunctions } from './compileToFunctions';

// Vue 对象
function Vue(options) {
  const selected = document.querySelector(options.el);
  this.$mount(selected);
}

Vue.prototype.$mount = function (el) {
  const html = el.outerHTML;
  compileToFunctions(html, {});
};

export default Vue;