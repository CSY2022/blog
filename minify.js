// minify.js
const fs = require("fs");
const path = require("path");
const htmlMinifier = require("html-minifier"); // 使用 html-minifier 替代 minify-html
const terser = require("terser"); // 用于压缩JS
const cssnano = require("cssnano"); // 用于压缩CSS
const postcss = require("postcss"); // 用于处理CSS

// 配置压缩选项（根据需要调整）
const minifyOptions = {
  html: {
    collapseWhitespace: true, // 删除空白字符
    removeComments: true, // 删除注释
    removeRedundantAttributes: true, // 删除冗余属性
    removeScriptTypeAttributes: true, // 删除script的type属性
    removeStyleLinkTypeAttributes: true, // 删除style/link的type属性
    useShortDoctype: true, // 使用短文档类型
    minifyJS: true, // 压缩内联JS
    minifyCSS: true, // 压缩内联CSS
    removeAttributeQuotes: true, // 尽可能删除属性引号
    removeEmptyAttributes: true, // 删除空属性
    // 更多选项参考: https://github.com/kangax/html-minifier
  },
  js: {
    // Terser 压缩选项
    compress: true,
    mangle: true,
  },
  css: {
    // CSSNano 预设配置
    preset: 'default'
  }
};

// 压缩JS文件
async function minifyJsFile(filePath) {
  try {
    const code = fs.readFileSync(filePath, "utf8");
    const result = await terser.minify(code, minifyOptions.js);
    if (result.error) throw result.error;
    fs.writeFileSync(filePath, result.code);
  } catch (err) {
    console.error(`Error minifying JS file ${filePath}:`, err);
  }
}

// 压缩CSS文件
async function minifyCssFile(filePath) {
  try {
    const css = fs.readFileSync(filePath, "utf8");
    const result = await postcss([cssnano(minifyOptions.css)]).process(css, {
      from: filePath,
      to: filePath
    });
    fs.writeFileSync(filePath, result.css);
  } catch (err) {
    console.error(`Error minifying CSS file ${filePath}:`, err);
  }
}

// 压缩HTML文件
function minifyHtmlFile(filePath) {
  try {
    const html = fs.readFileSync(filePath, "utf8");
    const minified = htmlMinifier.minify(html, minifyOptions.html);
    fs.writeFileSync(filePath, minified);
  } catch (err) {
    console.error(`Error minifying HTML file ${filePath}:`, err);
  }
}

// 遍历目录并压缩文件
async function minifyDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      await minifyDirectory(filePath); // 递归处理子目录
    } else {
      if (file.endsWith(".html")) {
        minifyHtmlFile(filePath);
      } else if (file.endsWith(".js")) {
        await minifyJsFile(filePath);
      } else if (file.endsWith(".css")) {
        await minifyCssFile(filePath);
      }
    }
  }
}

// 执行压缩
(async function() {
  try {
    await minifyDirectory(path.join(__dirname, "."));
    console.log("Minification complete!");
  } catch (err) {
    console.error("Error during minification:", err);
  }
})();