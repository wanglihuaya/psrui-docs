# PSRUI Docs

PSRUI Docs 是 PSRUI 的双语文档站项目，基于 Next.js 16 和 Fumadocs 构建。

当前站点以中文为默认语言，英文作为完整镜像页提供。文档内容覆盖：

- PSRUI 入门与界面使用
- 脉冲星处理基础概念
- 与 PSRUI 相关的 PSRCHIVE、`tempo2`、`dspsr` 等工具链说明

## 当前特性

- 中文默认路由：`/docs`
- 英文镜像路由：`/en/docs`
- 页面按 `*.zh.mdx` / `*.en.mdx` 成对维护
- 侧边栏内置语言切换
- 搜索按 locale 建索引

注意：

- 中文搜索当前使用稳定 fallback tokenizer，适合检索 `tempo2`、`pat`、`.par` 这类命令和术语
- 不额外引入中文分词，因此纯中文自然语言检索能力会弱一些

## 开发命令

示例统一使用 `npm`：

```bash
npm install
npm run dev
```

开发服务器启动后，打开：

- [http://localhost:3000/docs](http://localhost:3000/docs)
- [http://localhost:3000/en/docs](http://localhost:3000/en/docs)

常用校验命令：

```bash
npm run types:check
npm run lint
```

其中 `types:check` 会同时执行：

- `fumadocs-mdx`
- `next typegen`
- `tsc --noEmit`

## 内容结构

文档内容位于 [`content/docs`](./content/docs)。

```text
content/docs/
  index.zh.mdx
  index.en.mdx
  meta.zh.json
  meta.en.json
  getting-started/
  psrui-guide/
  pulsar-basics/
  toolchain/
```

约定如下：

- 每个页面都应优先维护中英文成对文件
- 每个目录通过 `meta.json` 控制顺序与侧边栏分组
- 站内链接优先使用相对链接
- 工具链页面要明确区分“上游工具能力”和“PSRUI 当前支持”

## 关键文件

| 路径 | 作用 |
| --- | --- |
| [`lib/i18n.ts`](./lib/i18n.ts) | 定义默认语言、可用语言与 UI 文案 |
| [`lib/source.ts`](./lib/source.ts) | 配置 Fumadocs source loader 与 i18n 内容读取 |
| [`app/docs`](./app/docs) | 中文默认 docs 路由 |
| [`app/[lang]/docs`](./app/[lang]/docs) | 非默认语言 docs 路由 |
| [`app/api/search/route.ts`](./app/api/search/route.ts) | 搜索接口与 locale tokenizer 配置 |
| [`proxy.ts`](./proxy.ts) | 默认语言隐藏与 Markdown/LLM 内容重写 |
| [`source.config.ts`](./source.config.ts) | MDX collection 配置 |

## README 适用范围

这个 README 面向仓库维护者与协作者，负责说明：

- 这个仓库是什么
- 文档内容放在哪里
- 路由和双语机制如何组织
- 本地开发和校验怎么跑

如果你想直接阅读文档内容，请优先从站点首页进入，而不是把 README 当成最终用户手册。

## 上游参考

当前文档站整理内容时，会参考这些上游资料：

- [PSRCHIVE Manuals](https://psrchive.sourceforge.net/manuals/)
- [Tempo2 User Manual](https://www.jb.man.ac.uk/~pulsar/Resources/tempo2_manual.pdf)
- [DSPSR documentation](https://dspsr.sourceforge.net/manuals/dspsr/sk-config/)
- [Fumadocs Documentation](https://fumadocs.dev)
