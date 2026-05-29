# AGENTS.md

## 项目概览

这是一个发布在 GitHub Pages 上的个人静态网站项目，仓库地址为：

- `https://github.com/thinking555/thinking555.github.io.git`
- 默认分支：`main`
- 当前远程 `main` 指向提交：`89aeac2 Update site files`

项目主体由大量独立 `.html` 页面组成，不依赖前端框架。大多数页面是导航、教程、资料整理或小工具页面，可以直接作为静态页面访问。

## 目录结构

主要文件类型统计：

- HTML 页面：约 45 个
- CSS 文件：2 个
- JavaScript 文件：1 个
- Python 脚本：10 个
- JSON 数据：1 个
- PNG 图片：约 164 张

重点目录和文件：

- `index.html`：主入口页面，标题为 `Xinshoucpu`
- `index 2.html`：另一个导航页/首页副本
- `search-style.css`：统一搜索框样式，多个导航页共用
- `drink.html`：饮料含糖量可视化系统入口
- `css/style.css`：饮料含糖量页面专用样式
- `js/main.js`：饮料含糖量页面专用脚本
- `data/drinks.json`：饮料数据源
- `images/`：饮料图片素材，包含正面和背面图片
- `VerifyData/`：人口预测相关图片，包含 `2020.png`、`2030.png`、`2040.png`、`2050.png`
- `.github/workflows/jekyll-gh-pages.yml`：GitHub Pages 自动部署 workflow
- `.gitignore`：已排除系统文件、缓存、本地环境、日志、构建产物等

## 主要页面分类

### 导航和搜索类页面

这些页面大多使用同一套顶部搜索框和链接列表：

- `index.html`
- `index 2.html`
- `首页搜索框.html`
- `1.html`：Super 谷歌高级搜索
- `2.html`：视频
- `3.html`：软件
- `4.html`：网盘
- `5.html`：图片
- `6.html`：邮箱接码
- `7.html`：安全工具
- `11.html`：Yandex 高级搜索
- `map.html`：地图
- `tg.html`
- `gogogo.html`
- `id.html`
- `w.html`

维护搜索框样式时，优先修改 `search-style.css`，不要逐页复制粘贴样式。此前已把搜索框统一成白底、柔和边框、绿色强调色、聚焦态和移动端适配。

### 教程和资料类页面

常见内容页包括：

- `kali-cn.html`：Kali 设置中文教程
- `kali-tool.html`：Kali Linux 常见工具和指令
- `localsend-fix.html`：LocalSend Mac 搜索不到设备解决办法
- `v2rayNG.html`：使用 v2rayNG 给 Switch 加速下载
- `openwrt.html`：OpenWrt 路由器翻墙
- `AD-VPN.html`：国外 VPN 为什么无法翻墙
- `IMSI.html`：Wi-Fi 探针与 IMSI 捕捉器
- `Pegasus.html`：NSO Group 与 Pegasus 资料
- `Sync.html`、`12.html`：Resilio Sync 相关页面
- `13.html`：LocalSend 快速下载
- `14.html`：迷雾通国内镜像
- `md.html`：Markdown 语法简明教程
- `advanced_search.html`：高级搜索语法

### 数据和可视化页面

- `date.html`：数据泄露案汇总，带表格搜索过滤功能
- `中国人口年龄分布与预测.html`：中国人口年龄分布与预测
- `population_age_distribution_prediction_simple.html`：人口年龄分布与预测简版
- `preview.html`：娃哈哈饮用纯净水卡片预览

`date.html` 的搜索框使用 `class="search"`，同样由 `search-style.css` 统一美化。修改时要保留其表格筛选脚本。

## 饮料含糖量模块

饮料含糖量可视化系统由以下文件组成：

- `drink.html`
- `css/style.css`
- `js/main.js`
- `data/drinks.json`
- `images/`

功能要点：

- 页面通过 `fetch("./data/drinks.json?v=" + Date.now())` 加载数据。
- 数据当前约有 80 条饮料记录、15 个品牌、16 个分类。
- 每条数据通常包含：`id`、`brand`、`name`、`category`、`volume`、`sugarPer100ml`、`caloriePer100ml`、`image1`、`image2`、`mainColor`。
- 前端会计算单瓶总糖量、热量、方糖数量，并按糖分分为 `zero`、`low`、`middle`、`high`。
- 页面支持关键词搜索、品牌筛选、分类筛选、糖分筛选、加载更多和分享按钮。

注意：

- 由于浏览器直接打开 `file://` 时可能无法正常 `fetch` JSON，调试 `drink.html` 时建议使用本地静态服务。
- 图片路径大小写要和 `data/drinks.json` 完全一致。
- 如果新增饮料，优先同时添加正面图和背面图。

## GitHub Pages 发布

项目使用 GitHub Pages workflow：

- 配置文件：`.github/workflows/jekyll-gh-pages.yml`
- 触发条件：推送到 `main` 分支，或手动运行 workflow
- 构建方式：`actions/jekyll-build-pages@v1`
- 部署方式：`actions/deploy-pages@v4`

常用 Git 流程：

```bash
git status
git add .
git commit -m "说明这次改了什么"
git push
```

当前仓库已设置远程：

```bash
origin https://github.com/thinking555/thinking555.github.io.git
```

如果 GitHub 登录失效，`git push` 可能需要重新配置 HTTPS token、GitHub CLI 或 SSH key。

## 本地预览

这是静态站点，没有 `package.json`，也没有统一构建命令。

普通 HTML 页面可以直接在浏览器中打开。涉及 `fetch` 的页面，例如 `drink.html`，建议通过本地静态服务访问。

在当前环境中，`python3 -m http.server` 可能会被系统开发工具配置拦截；如果 Node 可用，可以使用一个简单静态服务预览。

## Python 脚本说明

当前项目根目录未保留 Python 脚本。此前的练习脚本和机器人实验脚本已按“以本地为主”的原则清理，不再作为网站项目的一部分维护。

`requirements.txt` 仍存在，但当前静态站点本身不依赖 Python 运行；如果后续不再需要 Python 相关实验，可以考虑一并清理。

## 维护注意事项

- 不要提交 `.DS_Store`、缓存、虚拟环境、日志和本地密钥文件；这些已在 `.gitignore` 中排除。
- 修改多个导航页搜索框时，优先改 `search-style.css`。
- 不要误删远程恢复回来的 `.github/`、`css/`、`data/`、`images/`、`js/` 和 `drink.html`，它们属于饮料含糖量模块和 GitHub Pages 发布链路。
- 修改 `data/drinks.json` 后，要检查 JSON 语法合法、图片路径存在、分类和品牌筛选仍正常。
- 修改页面时尽量保持纯静态结构，不引入新的构建工具，除非明确需要。
- 中文文件名和带空格文件名较多，写命令时注意加引号。

## 快速接手建议

1. 先运行 `git status`，确认是否有未提交改动。
2. 如果改搜索框，先看 `search-style.css`。
3. 如果改饮料页面，先看 `drink.html`、`js/main.js`、`data/drinks.json`。
4. 如果改发布流程，先看 `.github/workflows/jekyll-gh-pages.yml`。
5. 推送前确认不会把远程旧资源作为删除提交。
