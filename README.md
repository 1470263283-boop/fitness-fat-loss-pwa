# 减脂塑型训练管理 PWA

手机端优先的 React + TypeScript + Vite 健身打卡应用。无后端，训练、体重、饮食、恢复和设置数据全部保存在当前浏览器本地 `localStorage`。

正式使用建议部署到 Vercel、Cloudflare Pages、Netlify 或 GitHub Pages，通过 HTTPS 地址在手机浏览器访问并添加到桌面。`npm run dev` 只用于本地开发调试。

## 功能

- 首页：今日训练、阶段、体重、饮水、肌酸、蛋白粉、蛋白达标打卡
- 训练：内置每周 4-5 练计划，支持每组重量、次数、RPE、完成状态记录
- 进阶建议：根据连续训练完成情况和 RPE 给出加重、维持或降重建议
- 进度：每日体重、腰围、7 日均重、30 天变化和简单趋势图
- 饮食：热量、蛋白质、饮水、肌酸、蛋白粉、含糖饮料、夜宵、饮酒打卡
- 恢复：睡眠、疲劳、膝盖/腰部/肩部疼痛记录和提醒
- 历史：训练、动作重量、饮食、体重和腰围历史查看，支持删除
- 设置：个人信息确认/修改、训练天数、饮食目标、JSON 导出导入、清空数据
- PWA：`manifest.json`、service worker、核心页面和静态资源离线缓存、可添加到手机桌面

## 本地开发

```bash
npm install
npm run dev
```

本地开发地址只用于调试，不是正式使用方式。

## 构建

```bash
npm run build
```

构建输出目录为 `dist`。

## 预览构建产物

```bash
npm run preview
```

## 推送到 GitHub 仓库

1. 在 GitHub 新建一个仓库，例如 `fitness-pwa`。
2. 在项目目录初始化并提交：

```bash
git init
git add .
git commit -m "Initial fitness PWA"
git branch -M main
git remote add origin https://github.com/你的用户名/fitness-pwa.git
git push -u origin main
```

后续修改后：

```bash
git add .
git commit -m "Update app"
git push
```

## 部署到 Vercel

1. 打开 [Vercel](https://vercel.com/)，用 GitHub 登录。
2. 点击 `Add New Project`，选择刚推送的 GitHub 仓库。
3. Framework Preset 选择 `Vite` 或保持自动识别。
4. Build Command 填写：`npm run build`
5. Output Directory 填写：`dist`
6. 点击 Deploy。
7. 部署成功后，Vercel 会生成一个 HTTPS 地址，例如 `https://你的项目.vercel.app`。
8. 用手机浏览器打开这个 HTTPS 地址，即可正式使用。

## 部署到 Cloudflare Pages

1. 打开 [Cloudflare Pages](https://pages.cloudflare.com/)，用 GitHub 连接仓库。
2. 点击 `Create a project`，选择该 GitHub 仓库。
3. Framework preset 选择 `Vite` 或 `None`。
4. Build Command 填写：`npm run build`
5. Output Directory 填写：`dist`
6. Node 版本建议使用当前 LTS 或平台默认较新的版本。
7. 点击部署。
8. 部署成功后，Cloudflare 会生成一个 HTTPS 地址，例如 `https://你的项目.pages.dev`。
9. 用手机浏览器打开这个 HTTPS 地址，即可正式使用。

## 其他静态托管

Netlify、GitHub Pages 等静态托管同样可用。核心配置保持一致：

- Build Command：`npm run build`
- Output Directory：`dist`

如果部署到 GitHub Pages 的仓库子路径，本项目已使用相对资源路径，构建后的 `dist` 可以作为静态站点发布。

## 添加到手机桌面

部署成功后，用手机访问 HTTPS 地址：

- iPhone Safari：点击分享按钮，选择“添加到主屏幕”。
- Android Chrome：打开右上角菜单，选择“添加到主屏幕”或“安装应用”。

添加后会以“健身计划”作为短名称显示。PWA 安装后仍然使用当前浏览器/PWA 容器的本地数据。

## 数据备份与隐私

应用没有账号系统，也不会上传数据。所有记录默认保存在用户手机浏览器本地 `localStorage` 中。

建议每周在设置页导出一次 JSON 备份。换手机、清理浏览器缓存、重装 PWA 或更换浏览器前，请先导出 JSON；在新设备中可通过设置页导入。

如果部署到公网仓库，不要把隐私照片、身份证、联系方式、API Key、Token、密码等敏感信息写死到项目代码中。当前项目不包含真实隐私照片，体型照片功能只做提醒和备注。
