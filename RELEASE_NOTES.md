## CodePilot v0.67.14

> 修复已有聊天切换模型与渠道时的续聊问题，改善 OpenAI 登录、模型目录刷新，并加入 Fable 5.1 支持。

### 新增功能

- 支持 Fable 5.1，并按模型能力提供推理强度与工具调用配置。

### 修复问题

- 修复已有聊天在同一 Runtime 内切换模型或服务商后无法继续发送的问题，保留原聊天和历史消息。
- 修复 OpenAI 登录刷新遇到临时网络错误时误清登录状态的问题，并处理并发刷新与退出后迟到请求。
- 修复模型目录首次加载和后台刷新时可能误报模型不可用的问题；刷新失败时保留已加载目录。
- 修复部分推理强度设置未正确传给模型的问题，不支持的选项会给出明确提示。

### 优化改进

- 模型目录按当前账号读取，区分 API 与 Codex 的上下文预算，并改善 Codex 模型分页与图片能力识别。
- 完善模型恢复提示的中文显示，优化官网视觉与多语言桌面截图。

### 已知问题

- 自动化用例与隔离开发界面验证已通过；OpenAI OAuth 实际刷新与生成、Astra 长上下文、Fable 5.1 真实账号工具调用仍待验证。
- 本版 Codex 改动尚未完成各平台打包后的运行期恢复测试及至少 15 分钟稳定性验证。
- Windows 安装包未配置 Authenticode 证书，请只从本 Release 下载并核对 SHA-256。

## 下载地址

> macOS v0.67.5 及更高正式版、Windows v0.67.10 及更高正式版可在应用内检查并升级。更早的 Windows 版本请手动安装 v0.67.14；Linux 继续手动下载安装。

### macOS

- [Apple Silicon (M1/M2/M3/M4)](https://github.com/op7418/CodePilot/releases/download/v0.67.14/CodePilot-0.67.14-arm64.dmg)
- [Intel](https://github.com/op7418/CodePilot/releases/download/v0.67.14/CodePilot-0.67.14-x64.dmg)

### Windows

- [Windows x64 安装包](https://github.com/op7418/CodePilot/releases/download/v0.67.14/CodePilot.Setup.0.67.14.exe)
- Windows 安装包未配置 Authenticode 证书，可能显示 SmartScreen。仅从本 Release 下载并核对 SHA-256；应用内也会在安装更新前再次明确提示未签名状态。

### Linux

- [x64 AppImage](https://github.com/op7418/CodePilot/releases/download/v0.67.14/CodePilot-0.67.14-x86_64.AppImage)
- [arm64 AppImage](https://github.com/op7418/CodePilot/releases/download/v0.67.14/CodePilot-0.67.14-arm64.AppImage)
- [amd64 DEB](https://github.com/op7418/CodePilot/releases/download/v0.67.14/CodePilot-0.67.14-amd64.deb)
- [arm64 DEB](https://github.com/op7418/CodePilot/releases/download/v0.67.14/CodePilot-0.67.14-arm64.deb)
- [x86_64 RPM](https://github.com/op7418/CodePilot/releases/download/v0.67.14/CodePilot-0.67.14-x86_64.rpm)
- [aarch64 RPM](https://github.com/op7418/CodePilot/releases/download/v0.67.14/CodePilot-0.67.14-aarch64.rpm)

### 完整性验证

- [SHA-256 Checksums](https://github.com/op7418/CodePilot/releases/download/v0.67.14/SHA256SUMS.txt)
- GitHub Release 页面可验证每个安装包的 build-provenance attestation；`latest-mac.yml`、`latest.yml` 与 blockmap 是自动更新器资产，不需要手工下载。

## 安装说明

**macOS**：下载 DMG → 拖入 Applications → 正常启动。若 Gatekeeper 报告开发者无法验证或文件损坏，请停止安装并反馈，不要绕过安全检查。

已安装的 macOS 正式版会通过同一 GitHub Release 的 `latest-mac.yml` 检查更新，并使用签名、公证后的 universal ZIP 完成应用内下载与重启安装。

**Windows**：v0.67.10 及更高版本会通过 `latest.yml` 优先差分下载未签名 NSIS，失败时回退完整安装包。更早版本需手动安装 v0.67.14。出现 SmartScreen 时请核对下载来源与 SHA-256；安装前仍会明确提示没有独立发布者签名。

**Linux**：继续手动下载新版安装包，不会静默运行包管理器或提权安装。

## 系统要求

- macOS 12.0+
- Windows 10/11 x64，或常见 x64/arm64 Linux 发行版
- 需要配置 API 服务商或受支持的套餐凭据
- 推荐安装 Claude Code CLI 或 Codex CLI 以获得完整功能
