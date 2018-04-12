let isStaticKey;
let isPlatformReservedTag;

export function optimize(root, options) {
  if (!root) {
    return;
  }
  isStaticKey = genStaticKeys;
  markStatic(root);
  markStaticRoots(root, false);
}

function markStatic(node) {
  node.static = isStatic(node);
  if (node.type === 1) {
    for (let i = 0, l = node.children.length; i < l; i++) {
      const child = node.children[i];
      markStatic(child);
      if (!child.static) {
        node.static = false;
      }
    }
  }
}

/**
 * 静态的包括普通文本和普通标签（不包含任何特殊的属性，比如不包含v-if, @ 等等）
 * @param node
 * @returns {boolean}
 */
function isStatic(node) {
  // 表达式 {{}}
  if (node.type === 2) {
    return false;
  }
  // 普通文本
  if (node.type === 3) {
    return true;
  }

  return !node.hasBinding && !node.if && !node.for && Object.keys(node).every(isStaticKey);
}

function markStaticRoots(node, isInFor) {
  if (node.type === 1) {
    if (node.static || node.once) {
      node.staticInFor = isInFor;
    }
    if (node.static && node.children.length && !(
      node.children.length === 1 && node.children[0].type === 3)) {
      node.staticRoot = true;
      return;
    } else {
      node.staticRoot = false;
    }
    if (node.children) {
      for (let i = 0, l = node.children.length; i < l; i++) {
        markStaticRoots(node.children[i], isInFor || !!node.for);
      }
    }
  }
}

function genStaticKeys(key) {
  const list = ['type', 'tag', 'attrsList', 'attrsMap', 'plain', 'parent', 'children', 'attrs'];
  for (let i = 0; i < list.length; i++) {
    if (key === list[i]) {
      return true;
    }
  }
  return false;
}