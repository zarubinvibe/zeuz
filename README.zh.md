# Zeuz

Zeuz 把一份写清楚的规格变成带角色、闸门、可观测性和结论的多智能体工作流。

[English](README.md) · [Русский](README.ru.md)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) [![Stars](https://img.shields.io/github/stars/zarubinvibe/zeuz?style=flat&color=C9A87A)](https://github.com/zarubinvibe/zeuz/stargazers) [![Status](https://img.shields.io/badge/status-reference-brightgreen.svg)](https://github.com/zarubinvibe/zeuz) [![Olympuz](https://img.shields.io/badge/olympuz-family-B8D6EA.svg)](https://github.com/zarubinvibe/athena#olympuz-family)

<p align="center"><img src="docs/assets/pantheon/hero.png" alt="白色大理石的宙斯手持金色闪电站在古典石柱旁，一张受管控的工作流图在日光里展开" width="100%"></p>

## 目录

- [这是什么](#这是什么)
- [它解决什么问题](#它解决什么问题)
- [最大的优势](#最大的优势)
- [工作流程](#工作流程)
- [快速开始](#快速开始)
- [简单对比](#简单对比)
- [简单词汇](#简单词汇)
- [安全与隐私](#安全与隐私)
- [局限](#局限)
- [点亮星标与参与](#点亮星标与参与)

<!-- beginner-readme:start -->

## 这是什么

Zeuz 是一座智能体工作流的工厂。你给它一份完整的规格，一串专职智能体设计这套系统、写出文件并检查结果。产出是一个新的项目目录，而不是一个跑着的服务。

## 它解决什么问题

手写多智能体系统，意味着每次都要重新想角色、阶段、闸门和日志，也意味着每次都会漏掉其中一样。Zeuz 把这套结构固定成可重复的流水线，末尾站着一个测试者。

## 最大的优势

**最大的优势：** 生成出来的系统必须用确定性的检查守住不可逆的动作。

**为什么这样更好：** 架构和构建阶段的提示词强制要求这些检查，测试者在给出结论之前会亲自看它们。只有测试者点头，这次运行才会报告完成。

## 工作流程

流水线在一个工作流宿主里按阶段运行。每个阶段都有角色、输入，以及一件你能读的产物。

<!-- workflow-diagram:start -->

```text
  ┌──────┐   ┌──────┐   ┌──────┐
  │ 规格 │ ▶ │ 观察 │ ▶ │ 选角 │
  └──────┘   └──────┘   └──────┘
      ▼
  ┌──────┐   ┌──────┐   ┌──────┐
  │ 架构 │ ▶ │ 省耗 │ ▶ │ 构建 │
  └──────┘   └──────┘   └──────┘
      ▼
  ┌──────┐
  │ 检验 │
  └──────┘
```

<!-- workflow-diagram:end -->

| 阶段 | 会发生什么 |
|---|---|
| 1. 规格 | 目标、输入、完整性不变量、约束、完成标准 |
| 2. 观察 | 这台机器上真正可用的东西，写进日志 |
| 3. 选角 | 角色定义和经过核对的人物设定 |
| 4. 架构 | 并行边界和确定性闸门的要求 |
| 5. 省耗 | 每个阶段的模型分配和省上下文的做法 |
| 6. 构建 | 智能体文件、工作流、协议、路由和计划图 |
| 7. 检验 | 语法、闸门、可观测性、来源、人物设定、干跑 |

### 第 1 步：先写清楚规格

你写下目标、输入、绝对不能跳过的东西、约束，以及怎样才算做完。规格缺失或者太短会被拒绝。

**你会得到：** 一份工厂可以照着造的规格，而不是靠猜。

### 第 2 步：给环境拍一张快照

第一个阶段把运行环境的快照写进本地 JSONL 文件。可选工具不存在时，这次运行会记录这个事实，而不是假装有。

**你会得到：** 一个写下来的起点，事后还能回头看。

### 第 3 步：角色找到自己的人

选角阶段为将来的系统写下角色定义和背后的人物设定。传记性的事实应当被核对，而不是编出来。

**你会得到：** 一支有名有姓的队伍，而不是一段匿名提示词。

### 第 4 步：阶段、闸门和一张图

架构阶段排出阶段顺序，标出哪些可以并行，并指明哪些闸门必须是确定性的。结果是一张图，不是一段散文。

**你会得到：** 一份在代码出现之前就把不可逆步骤围起来的计划。

### 第 5 步：挑模型，压上下文

每个阶段拿到一个模型档位和把上下文压小的做法。便宜的机械活默认不会用上昂贵的模型。

**你会得到：** 一套跑不止一次也不心疼的系统。

### 第 6 步：文件被写出来

构建阶段把生成的项目写进你的输出目录：智能体文件、工作流源码、协议、项目路由和计划图。

**你会得到：** 一个可以阅读、比对差异、单独运行的项目目录。

### 第 7 步：测试者给出结论

测试者按这些方向检查生成出来的系统并报告发现。只要不是通过，运行就返回需要修复，并附上问题清单。

**你会得到：** 一个诚实的状态，而不是一段听起来很有底气的总结。

## 快速开始

你需要 Bash 和 Node.js。冒烟检查不调用任何模型，它证明工厂的源码还是完整的。

```bash
git clone https://github.com/zarubinvibe/zeuz.git
cd zeuz
bash smoke/smoke.sh
```

没有 Git？下载 [ZIP](https://github.com/zarubinvibe/zeuz/archive/refs/heads/main.zip) 或 [tar.gz](https://github.com/zarubinvibe/zeuz/archive/refs/heads/main.tar.gz)，在里面跑同样的检查。要真正造一套系统，先把 `workflows/zeuz-pipeline.js` 注册到工作流宿主里。宿主需要提供 `args`、`phase()`、`agent()` 和 `log()`。然后设置 `ZEUZ_HOME` 与 `ZEUZ_PROJECTS`。

**你会得到：** 检查以一行通过的闸门结束，说明源码能被解析，必需的标记也都还在。

## 简单对比

| 方案 | 适合什么时候 | 你会得到 | 代价 |
|---|---|---|---|
| **Zeuz** | 你不止一次要造多智能体系统 | 默认就有角色、闸门、可观测性和测试者结论 | 需要一个工作流宿主，自身不带运行器 |
| 手写工作流 | 只造一套小系统 | 完全按你的想法 | 闸门和日志每次都要重新发明 |
| 智能体框架 | 你想要库和社区 | 现成组件、文档、集成 | 角色、闸门和证据仍然要你自己设计 |
| 一段很长的提示词 | 快速试一下 | 什么都不用配置 | 没有阶段、没有闸门，也看不清发生了什么 |

## 简单词汇

| 词 | 简单解释 |
|---|---|
| Repository | 仓库：Git 保存并记录版本的项目文件夹 |
| Terminal | 终端：你输入命令的窗口 |
| Command | 命令：给电脑的一条指令 |
| Branch | 分支：不影响 `main` 的另一条修改线 |
| Pull Request | 合并请求：请别人审阅并接受你的修改 |
| Workflow host | 工作流宿主：执行流水线并给智能体提供工具的程序 |
| Gate | 闸门：不通过就不允许执行不可逆步骤的检查 |

## 安全与隐私

- 文件访问：构建智能体被要求写进你的输出目录，环境快照写在项目目录下。
- Shell：观察和测试阶段会执行本地命令，沙箱与确认由你的宿主决定。
- 网络：角色阶段会请宿主在线核对事实，Zeuz 自己不设定网络策略。
- 密钥：仓库不需要任何凭据，规格和生成物里也不该出现凭据。
- 遥测：没有远程遥测客户端，快照都是本地文件。
- 回滚：Zeuz 不会撤销已经写下的内容，请用单独的输出目录并检查差异。

信任边界和问题上报方式写在 [SECURITY.md](SECURITY.md) 里。

## 局限

状态：参考实现。仓库里有工作流源码、智能体提示词、规则和一个静态冒烟检查。

- 没有现成的工作流宿主适配器，也没有打包好的命令行。
- 冒烟检查看的是源码和标记，不会完整执行生成出来的系统。
- haiku、sonnet、opus 这类模型标签需要你的宿主自己映射。
- 智能体的结论仍然是模型输出：在你自己的检查通过之前，把生成的代码和说法都当作未经证实。
- 可选的可观测性程序可能不存在，这时运行会如实记录，而不是安静地失败。

想看得更深：[完整参考](docs/DETAILS.md)、[路线图](specs/00-roadmap.md)、[构建规则](rules/best-practices.md) 和 [决策记录](docs/decisions/)。

## 点亮星标与参与

觉得有用？给 Zeuz 点亮星标：[https://github.com/zarubinvibe/zeuz](https://github.com/zarubinvibe/zeuz)。这只要一秒，却决定别人能不能找到这个项目。

想改点什么？流程很短：先 fork 仓库，建一个分支 branch，提交 commit，推送 push，然后开一个 Pull Request。请不要直接向 `main` 推送，发布闸门会拒绝。

发现问题？到 [https://github.com/zarubinvibe/zeuz/issues](https://github.com/zarubinvibe/zeuz/issues) 开一个 issue，写清楚你运行了什么、发生了什么。

<!-- beginner-readme:end -->

<!-- pantheon-family:start -->
## Olympuz 家族

这是 [Olympuz 家族](https://github.com/zarubinvibe/athena#olympuz-family) 的公开项目之一。表格里的每一行都可以打开仓库，或者直接下载源码压缩包。

| 类型 | 名称 | 做什么 | 获取 |
|---|---|---|---|
| 项目 | Athena | 可携带的智能体操作系统：在新的 Mac 上重建 Claude 与 Codex 的工作环境。 | [仓库](https://github.com/zarubinvibe/athena) · [ZIP](https://github.com/zarubinvibe/athena/archive/refs/heads/main.zip) |
| 项目 | Helioz | 全天候的智能体工作传送带，带可验证的完成标记和按目标做出的夜间决策。 | [仓库](https://github.com/zarubinvibe/helioz) · [ZIP](https://github.com/zarubinvibe/helioz/archive/refs/heads/main.zip) |
| 项目 | Mnemazine | 本地优先的记忆系统：把原始材料变成可复用的、已核验的知识。 | [仓库](https://github.com/zarubinvibe/mnemazine) · [ZIP](https://github.com/zarubinvibe/mnemazine/archive/refs/heads/main.zip) |
| 项目 | Themis | 面向俄罗斯诉讼的多智能体助手，本地识别扫描件，五位法学家组成合议审阅。 | [仓库](https://github.com/zarubinvibe/themis) · [ZIP](https://github.com/zarubinvibe/themis/archive/refs/heads/main.zip) |
| 项目 | Zeuz | 工作流工厂：把一个想法变成带规则、闸门、可观测性和回放的多智能体系统。 | [仓库](https://github.com/zarubinvibe/zeuz) · [ZIP](https://github.com/zarubinvibe/zeuz/archive/refs/heads/main.zip) |
<!-- pantheon-family:end -->

## 许可证

MIT。见 [LICENSE](LICENSE)。Zeuz 由 Philipp Zarubin 创建。
