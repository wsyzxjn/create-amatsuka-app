#!/usr/bin/env node
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import fs from "fs-extra";
import { input, select } from "@inquirer/prompts";
import { execa } from "execa";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 获取命令行参数
// process.argv[0] → node 路径
// process.argv[1] → 当前脚本路径
// process.argv[2] → 第一个参数
let projectName = process.argv[2];

// 如果没传参数，就用交互式询问
if (!projectName) {
  const answer = await input({
    message: "请输入项目名称:",
    default: "amatsuka-app",
  });
  projectName = answer;
}

// 项目描述
const projectDescription = await input({
  message: "请输入项目描述:",
  default: "A simple Node.js project created by create-amatsuka-app",
});

// 模板路径
const templateDir = resolve(__dirname, "../templates");

// 目标路径 = 当前运行目录 + 项目名
const targetDir = resolve(process.cwd(), projectName);

// 1. 复制模板文件夹
await fs.copy(templateDir, targetDir);

// 创建 .gitignore
await fs.writeFile(
  resolve(targetDir, ".gitignore"),
  `node_modules/
dist/
.env
.npmrc
.DS_Store
`
);

const devDependencies = [
  "tsup",
  "prettier",
  "cross-env",
  "typescript",
  "tsx",
  "eslint",
  "@types/node",
  "@typescript-eslint/eslint-plugin",
  "@typescript-eslint/parser",
  "eslint-config-prettier",
];

// 选择包管理器
const packageManager = await select({
  message: "请选择包管理器:",
  choices: ["npm", "pnpm"],
  default: "pnpm",
});

// 2. 读取并修改 package.json
const pkgPath = resolve(targetDir, "package.json");
if (await fs.pathExists(pkgPath)) {
  const pkg = await fs.readJson(pkgPath);
  pkg.name = projectName; // 动态修改包名
  pkg.description = projectDescription; // 动态修改描述
  const packageManagerVersion = await execa(packageManager, ["--version"]).then(
    result => result.stdout
  );
  pkg.packageManager = `${packageManager}@${packageManagerVersion}`;
  await fs.writeJson(pkgPath, pkg, { spaces: 2 });
}

// 3. 安装依赖
await execa(packageManager, ["i", "-D", ...devDependencies], {
  cwd: targetDir,
});

// 4. 完成提示
console.log(`\n✅ 项目 ${projectName} 创建完成！`);
