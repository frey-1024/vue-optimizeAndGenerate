import ast from "./ast";
import { optimize } from "./optimize";
import { generate } from "./generate";

function createCompileToFunctionFn(compile) {
  return function compileToFunctions(template, options) {
    const compiled = compile(template, options)
  }
}

function createCompilerCreator(baseCompile) {
  return function createCompiler() {
    function compile(template, options) {
      const compiled = baseCompile(template, options)
    }
    return {
      compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    }
  }
}
// js柯里化是逐步传参，逐步缩小函数的适用范围，逐步求解的过程。
export const createCompiler = createCompilerCreator(function(template, options) {
  console.log('这是处理后的ast(抽象语法树)字符串', ast);
  optimize(ast, options);
  const code = generate(ast, options);
  console.log(code);
});