// minify.js
const fs = require("fs");
const path = require("path");
const minifyHtml = require("minify-html");

// 配置压缩选项（根据需要调整）
const minifyOptions = {
  minifyJs: true,  // 压缩内联 JS
  minifyCss: true, // 压缩内联 CSS
  collapseWhitespace: true, // 删除空白字符
};

// 遍历目录并压缩 HTML
function minifyDirectory(dir) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      minifyDirectory(filePath); // 递归处理子目录
    } else if (file.endsWith(".html")) {
      const html = fs.readFileSync(filePath, "utf8");
      const minified = minifyHtml.minify(html, minifyOptions);
      fs.writeFileSync(filePath, minified);
    }
  });
}

// 压缩整个目录（例如 "dist" 或 "public"）
minifyDirectory(path.join(__dirname, "."));