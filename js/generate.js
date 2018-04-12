class CodegenState{
  constructor(options) {
    this.staticRenderFns = [];
  }
}

export function generate(ast, options) {
  const state = new CodegenState(options);
  const code = ast ? genElement(ast, state) : '_c("div")';
  return {
    render: `with(this){return ${code}`,
    staticRenderFns: state.staticRenderFns
  };
}

function genElement(el, state) {
  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el, state);
  } else {
    const data = el.plain ? undefined : genData(el, state);
    const children = genChildren(el, state);
    return `_c('${el.tag}'${
      data ? `,${data}` : ''
      }${children ? `,${children}` : ''})`;
  }
}

function genStatic(el, state) {
  el.staticProcessed = true;
  state.staticRenderFns.push(`with(this){return ${genElement(el,state)}`);
  return `_m(${
      state.staticRenderFns.length - 1
    },${
      el.staticInFor ? 'true' : 'false'
    },false)`;
}

function genChildren(el, state) {
  const children = el.children;
  if (children.length) {
    const gen = genNode;
    return `[${children.map(c => gen(c, state)).join(',')}]`;
  }
}


function genNode(node, state) {
  if (node.type === 1) {
    return genElement(node, state);
  } else {
    return genText(node);
  }
}

function genText(text) {
  return `_v(${text.type === 2
    ? text.expression
    : JSON.stringify(text.text)
  })`;
}

function genData(el) {
  let data = '{';
  if (el.attrs) {
    data += `attrs:{${genProps(el.attrs)}},`
  }
  // 去掉最后的逗号
  data = data.replace(/,$/, '') + '}';
  return data;
}

function genProps(props) {
  let res = '';
  for (let i = 0, l = props.length; i < l; i++) {
    const prop = props[i];
    res += `"${prop.name}": ${prop.value},`;
  }
  // 删除字符串最后一个分号
  return res.slice(0, -1);
}