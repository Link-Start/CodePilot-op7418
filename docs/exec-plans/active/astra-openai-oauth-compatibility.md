# Astra / OpenAI OAuth 兼容修复

> 创建时间：2026-09-05
> 最后更新：2026-09-05

## 用户问题与取舍

用户要求核对 Astra 在 Codex 的窗口和 OpenCode 最新授权实现，随后明确授权修复。源码对照及离线复现见 [调研](../../research/astra-fable51-adaptation-2026-09-05.md)。当前 OAuth 固定目录滞后，SDK 会丢 Astra reasoning，刷新并发/临时失败会清掉登录状态。API 的 1.05M 不能作为 Codex 默认窗口。

用户验收：OpenAI OAuth 登录后在原聊天选择新模型、调整 effort；临时网络失败重试不要求重新登录；退出/重登录不会被旧请求覆盖。保持原聊天、Runtime owner 和既有默认模型；不触发新聊天或自动账号迁移。Fable 协议适配、device flow、WebSocket、发版不属于此轮授权的四项修复。

## 状态

| Phase | 内容 | 状态 |
| --- | --- | --- |
| 1 | refresh 单次执行、永久/临时错误分类、原子写入与过期请求防护 | Code complete |
| 2 | 同 OAuth 凭据发现目录、缓存隔离、Astra capability/effort | Code complete |
| 3 | API/Codex 预算区分、Codex 分页及视觉能力 | Code complete |
| 4 | targeted/full tests、旧聊天 E2E、guardrail 回写 | Tests pass；真实授权生成未执行 |

## 契约

- 并发刷新共用 promise；同账号快照才能回写，退出/换账号使旧请求失效。refresh token 轮换和 account metadata 在同一 DB transaction 中保存。
- 仅明确 grant/revocation 错误清凭据；网络、429、5xx 和未知错误保留凭据并返回可重试错误，不将旧过期 bearer 继续发出。
- 模型目录使用独立 OAuth 的凭据请求 Codex backend，不能借用 app-server 账号。失败用同账号缓存/明确兼容目录；目录只代表候选，不证明生成 entitlement；成功空目录必须保留为空。
- reasoning 仅按模型能力启用，用户选择必须精确到 wire，不静默退为 medium。Codex `ultra` 继续保持原产品边界。
- Astra 默认 Codex 有效窗口 258400；API 1050000。无 transport 事实时不填假窗口，实际 runtime usage 继续优先。保守历史预算不冒充用量。
- bearer 与 residency 仅发往精确 Codex endpoint，禁止重定向外传。

## Smoke Ledger

| Date | Runtime | Provider | Model | 凭据形态 | 场景 | Result | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-09-05 | 离线 | OpenAI OAuth | Astra | 假 token / 内存 fixture | 修复前并发刷新、断网、SDK max wire | 已复现 | 调研文档中的 5 项结果 |

## 决策日志

- 2026-09-05：新源码目录在 `/private/tmp` 独立 checkout；现有站点和上轮聊天修复保留，不混入本轮改动。授权凭据存储继续兼容旧 key，但用一笔 SQLite transaction 防止半写入，避免引入独立数据迁移。


## 验证结果（2026-09-05）

- `CODEX_DISABLED=1 npm test`：typecheck、Harness boundary、完整单测通过，5508 pass / 1 skip。日志 `/private/tmp/codepilot-astra-full-final.log`。
- Targeted OAuth / Native wire / Codex model / context：65 pass（随后新增的项目 config/read 与窗口覆盖两例也进入上述 full suite）。日志 `/private/tmp/codepilot-astra-target.log`。
- 隔离 Dev（3136）+ 浏览器：旧聊天 GLM 内换模型、同 Runtime 换 DeepSeek、历史消息/产品会话 ID 保留与 GLM identity conflict 两例，共 3 pass。日志 `/private/tmp/codepilot-astra-e2e.log`。自动测试创建的数据库及服务均隔离于用户日常数据。
- 改动文件 ESLint：0 errors，9 个既有 unused 警告；新增模块/测试及模型目录文件单独 lint clean。docs-drift / diff-check 通过。
- 防回归合同回写 `Onboarding.md`、`Runtime.md`；公共模型目录与 token smoke 的历史失败记录保留在调研，不冒充修复后真实上游结果。

| Date | Runtime | Provider | Model | 凭据形态 | 场景 | Result | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-09-05 | CodePilot Native | OpenAI OAuth | gpt-6-astra | 假 token，拦截真实 SDK fetch | runAgentLoop 的 max / bearer / account / residency | pass（wire，非生成） | openai-oauth-compatibility.test.ts |
| 2026-09-05 | Claude Code / Codex | GLM → DeepSeek | sonnet/haiku → deepseek-v4-flash | 隔离数据库 fixtures | 旧聊天 Picker 原地换模型/Provider | 3 E2E pass（不发上游推理） | old-chat-model-route + model-identity-conflict |
| 2026-09-05 | Codex | Codex Account | gpt-6-astra | fake app-server + 本地模型 metadata | config/read(cwd)、1M 覆盖 clamp 为 828400 有效窗口、较小覆盖 95000 | pass（协议/预算） | codex-models-dual-schema.test.ts |

## 剩余验证边界

本机独立 OpenAI OAuth 未登录，因此真实账号发现、token rotation、Astra 文本/工具生成及长上下文 smoke 未执行；不能以候选目录或模拟 wire 宣称上游 entitlement 已通过。没有升级 CLI/SDK、改默认模型、修改真实 OAuth 凭据或发版。实现状态为 Code complete + Tests pass，未标记真实账号 Smoke passed / Release ready。
