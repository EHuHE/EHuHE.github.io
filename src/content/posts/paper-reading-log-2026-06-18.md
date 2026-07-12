---
title: "论文精读日志：2026-06-18"
description: "自动化论文精读日志，收录 5 篇论文的阅读笔记、评分与复现风险。"
pubDate: 2026-06-18
tags: ["论文精读", "自动化", "研究日志"]
featured: false
---

<!-- paper-log-sync: managed -->
<!-- paper-log-date: 2026-06-18 -->
<!-- paper-log-source-hash: d4fa395d317c91c1 -->

> 本文由“每日论文精读与打分”自动化日志同步生成，用于保留每周论文监测、阅读笔记与复现风险记录。

执行日期：2026-06-18  
检索窗口：优先近 7 天，即 2026-06-11 至 2026-06-18。  
筛选口径：优先计算机科学与跨学科方向中与大模型、推理、多模态、模型效率相关的论文；优先有顶会/高质量 venue 信息、官方论文页、代码或模型权重链接的条目。评分为阅读助理主观评估，非论文事实。

## 执行摘要

- 已选篇目数：5 篇，均在近 7 天内有 arXiv 发布记录。
- 摘要缺失：0 篇；5 篇均可从 arXiv、CVF 或 OpenReview 等页面核验摘要/正文。
- Venue 情况：ICML 2026 2 篇、CVPR 2026 Highlight 1 篇、ACL 2026 Findings 1 篇、ICLR 2026 Workshop Best Paper 1 篇。
- 可复现性风险：整体中到高。SoftMoE 和 OmniAgent 有代码链接；OmniAgent 还给出 SFT/RL 权重，但训练资源需求高。ALVTS、ST-Merge、Structural Uncertainty 的代码链接未在论文首页/摘要元数据中明确披露，需后续跟进。
- 检索说明：arXiv API 初次大范围查询出现 502，随后通过 HTTPS、窄查询、arXiv 页面/PDF、CVF、OpenReview 和 GitHub 链接完成核验，因此未生成失败日志。

## 入选清单

| 序号 | 题目 | Venue | 发布时间 | 主题 | 继续深读 |
|---|---|---|---|---|---|
| 1 | Native Active Perception as Reasoning for Omni-Modal Understanding | ICML 2026 | arXiv: 2026-06-17 | 多模态/长视频/智能体推理 | 是 |
| 2 | SoftMoE: Soft Differentiable Routing for Mixture-of-Experts in LLMs | ICML 2026 | arXiv: 2026-06-16 | LLM MoE/路由/模型效率 | 是 |
| 3 | One Layer's Trash is Another Layer's Treasure: Adaptive Layer-wise Visual Token Selection in LVLMs | CVPR 2026 Highlight | arXiv: 2026-06-12 | LVLM 视觉 token 压缩 | 是 |
| 4 | Enhancing Multilingual Reasoning via Steerable Model Merging | ACL 2026 Findings | arXiv: 2026-06-17 | 多语言推理/模型融合 | 是 |
| 5 | Quantifying Consistency in LLM Logical Reasoning via Structural Uncertainty | ICLR 2026 Workshop LLM Reasoning Best Paper | OpenReview: 2026-04-01；arXiv: 2026-06-15 | LLM 推理可靠性/不确定性评估 | 是 |

---

## 1. Native Active Perception as Reasoning for Omni-Modal Understanding

- 题目：Native Active Perception as Reasoning for Omni-Modal Understanding
- 作者：Zhenghao Xing, Ruiyang Xu, Yuxuan Wang, Jinzheng He, Ziyang Ma, Qize Yang, Yunfei Chu, Jin Xu, Junyang Lin, Chi-Wing Fu, Pheng-Ann Heng
- 会议/期刊：ICML 2026
- 发布时间：arXiv 2026-06-17
- 来源链接：[arXiv](https://arxiv.org/abs/2606.19341)、[代码](https://github.com/harryhsing/OmniAgent)、[SFT 权重](https://huggingface.co/harryhsing/OmniAgent-SFT-7B)、[RL 权重](https://huggingface.co/harryhsing/OmniAgent-RL-7B)

### 标准化阅读笔记

- 研究问题：长视频/音视频理解中，传统“watch-it-all”被动处理会让上下文和计算成本随视频时长增长；论文研究能否把感知建模为按需搜索与推理过程，使复杂度更多取决于问题难度而不是视频长度。
- 核心方法：提出 OmniAgent，把视频理解形式化为 POMDP 下的 Observation-Thought-Action 循环。模型按需调用 `get_frames`、`get_audio`、`get_clip`、`answer` 等动作，将临时视听证据蒸馏到持久文本记忆。训练包含 Agentic SFT 和 Agentic RL，其中 RL 使用 TAURA，根据 turn-level entropy 调整多轮轨迹中的信用分配。
- 关键创新点：将主动感知作为原生多模态模型内部的推理过程，而不是外部工具链；通过持久文本记忆与原始媒体片段清理机制降低上下文压力；TAURA 针对多轮智能体轨迹中关键发现步骤与普通步骤同权的问题做 turn-aware advantage rescaling。
- 实验设计：以 Qwen2.5-Omni-7B 为基座；在 10 个 benchmark 上评估，包括 VideoMME、VSI-Bench、MLVU、Minerva、LVBench、DailyOmni、WorldSense、OmniVideoBench、LongVALE、VUE-TR。Agentic SFT 使用 58K trajectories、16 张 A100；RL 使用 64 张 A100、group size 8、150 steps，并限制 RL 视频时长低于 300 秒。
- 主要结果：OmniAgent-7B 在 LVBench 得到 50.5%，高于 Qwen2.5-Omni-7B 的 43.0%，也高于 Qwen2.5-VL-72B 的 47.3%，且平均采样帧数更少。VideoMME-Long 从基线 54.8 提升到 59.6；MLVU 为 71.1；DailyOmni 为 64.8；LongVALE 相比 Qwen2.5-Omni 提升 +33.4 IoU。论文还报告 VideoMME-Long 随最大交互轮数增加有正向 test-time scaling。
- 与现有方法对比：相较被动长视频模型，OmniAgent 使用 query-conditioned active perception；相较 LLM 控制外部工具的 agentic 方法，它强调同一原生模型完成感知、推理和动作决策；在 LVBench 上，7B 模型超过 72B 被动模型。
- 局限性：论文明确指出顺序交互循环会引入 latency overhead，未来工作会研究并行化探索。训练资源需求高，SFT 与 RL 分别使用 16/64 张 A100；RL 阶段视频时长限制在 300 秒以下。
- 复现难度：高。代码和权重公开降低了复现门槛，但完整训练需要多机 GPU、视频处理环境、Ray/verl、ffmpeg 处理链和轨迹生成管线。
- 实际可用性：高。若关注长视频问答、视频检索式推理、音视频时间定位，方法有明确工程价值；更适合先复现推理/评测流程，再考虑训练。
- 潜在风险：论文未单列安全风险。可直接识别的风险是多轮主动采样可能遗漏关键证据，且高延迟/视频处理错误会影响决策；用于监控、司法、医疗等高风险场景前需要额外审计。

### 评分

| 维度 | 分数 |
|---|---:|
| 创新性 | 9 |
| 方法严谨性 | 8 |
| 实验说服力 | 8 |
| 工程可复现性 | 6 |
| 应用价值 | 9 |

- 是否值得继续深读：是。该文是本轮最值得优先深读的多模态智能体论文。
- 下一步关注点：先检查 GitHub 中的推理脚本、环境动作定义和权重可用性，再评估是否能在本地/云端复现 LVBench 子集。

---

## 2. SoftMoE: Soft Differentiable Routing for Mixture-of-Experts in LLMs

- 题目：SoftMoE: Soft Differentiable Routing for Mixture-of-Experts in LLMs
- 作者：Mikołaj Zasada, Łukasz Struski, Jacek Tabor, Marcin Kurdziel
- 会议/期刊：ICML 2026
- 发布时间：arXiv 2026-06-16
- 来源链接：[arXiv](https://arxiv.org/abs/2606.17952)、[代码](https://github.com/dlcuda/SoftMoE)

### 标准化阅读笔记

- 研究问题：标准 sparse MoE 依赖 hard top-k 路由，选择过程不可微，且每层/每 token 激活专家数固定。论文研究如何在保持自回归兼容与稀疏计算的同时，让专家选择和跨层专家预算可学习。
- 核心方法：提出 SoftMoE，用基于 LapSum 的 soft top-k relaxation 替代 hard top-k；再用阈值截断低权重专家以保持稀疏；同时把每层平均激活专家数参数化，在全局专家预算约束下用梯度学习跨层分配。
- 关键创新点：soft top-k 对 routing score 与选择参数 `k` 可微；可在自回归语言模型中逐 token 独立路由，不依赖 token mixing；学习到非均匀专家分配，实验中后几层获得更多专家预算。
- 实验设计：使用 1.631B 参数 decoder-only GPT-2 风格模型，10 个 blocks、10 个 attention heads、32 experts；在 OpenWebText 和 C4 上做语言建模，并在 PIQA、HellaSwag、ARC-E 上评测。对比 Sparse MoE、固定专家分配 SoftMoE*、学习专家分配 SoftMoE。训练资源包括 GH200 节点，OWT 使用 8-way data parallelism，C4 使用 20-way data parallelism。
- 主要结果：在 OWT 和 C4 上，SoftMoE/SoftMoE* 通常以更少平均激活专家数达到相当或更低 loss。示例：OWT `<=2` budget 下，Sparse MoE-2 loss 2.79，SoftMoE*-1.5 loss 2.78 且 Train-AE 1.53；SoftMoE-1.5 loss 2.76。论文还报告前 3 个顶层大约吸收 50% 专家预算。
- 与现有方法对比：相较 hard top-k MoE，SoftMoE 允许路由梯度穿过 soft top-k relaxation 并学习专家预算；相较部分 soft routing/token mixing 方法，论文强调其保持自回归兼容，不混合不同位置 token。
- 局限性：论文明确说明实验仅覆盖 OWT/C4 英文语料与英文下游任务；未研究多语言任务；未探索多模态应用；模型规模为 1.63B，低于实际部署中的最大 LLM。
- 复现难度：中到高。代码已公开，但完整预训练实验需要较强 GPU 资源；复现小规模路由行为和下游评测比完整训练更现实。
- 实际可用性：高。对 MoE 架构、推理成本控制、专家路由研究有直接参考价值，尤其适合作为新路由器 baseline。
- 潜在风险：论文未单列安全风险。方法层面的主要风险是把 1.63B 英文实验结论过早外推到超大规模、多语言或多模态 MoE；部署前还需验证路由稳定性、吞吐和负载均衡。

### 评分

| 维度 | 分数 |
|---|---:|
| 创新性 | 8 |
| 方法严谨性 | 8 |
| 实验说服力 | 7 |
| 工程可复现性 | 6 |
| 应用价值 | 8 |

- 是否值得继续深读：是。它触及 MoE 路由的核心训练-推理不一致问题。
- 下一步关注点：阅读代码中的 SoftTopK/LapSum 实现，并测试是否能替换现有 MoE router 的小模型配置。

---

## 3. One Layer's Trash is Another Layer's Treasure: Adaptive Layer-wise Visual Token Selection in LVLMs

- 题目：One Layer's Trash is Another Layer's Treasure: Adaptive Layer-wise Visual Token Selection in LVLMs
- 作者：Yongru Chen, Kai Zhang, Zeliang Zong, Yuchen Lu, Wenming Tan, Ye Ren, Jilin Hu
- 会议/期刊：CVPR 2026 Highlight
- 发布时间：arXiv 2026-06-12
- 来源链接：[arXiv](https://arxiv.org/abs/2606.14277)、[CVF Open Access PDF](https://openaccess.thecvf.com/content/CVPR2026/papers/Chen_One_Layers_Trash_is_Another_Layers_Treasure_Adaptive_Layer-wise_Visual_CVPR_2026_paper.pdf)

### 标准化阅读笔记

- 研究问题：LVLM 的视觉 token 很长，推理成本高。现有 visual token pruning 往往在某一层永久丢弃 token，后续层无法再访问这些视觉信息。论文研究如何做逐层、动态、可恢复的视觉 token 选择。
- 核心方法：提出 ALVTS。每个 LLM decoder layer 前用轻量 token selector 计算视觉 token 重要性；高分 token 进入该层计算，低分 token 跳过该层；层输出后将两路 token 重新合并，保证后续层仍能访问完整 token 序列。selector 通过重要性一致约束的低秩近似来模拟 full attention，不需要重训原始 LVLM。
- 关键创新点：从静态 pruning 改为 layer-wise dynamic selection；跳过 token 不是永久删除，而是在下一层前重新合并；低秩 selector 用少量校准样本训练，论文称 LLaVA-1.5-7B 的优化过程可在 15 分钟内完成。
- 实验设计：在 LLaVA-1.5-7B/13B、LLaVA-NeXT-7B、Qwen2.5-VL-3B-Instruct 上实验；评测 AI2D、POPE、TextVQA、OKVQA、VizWiz、COCO Caption、NoCaps、RealWorldQA；对比 FastV、VTW、PyramidDrop、DART。效率实验在单张 RTX 4090 上报告。
- 主要结果：LLaVA-1.5-7B 在 89% token reduction 时，ALVTS 保留 96.73% 平均性能，高于 DART 93.27%、PyramidDrop 88.52%、FastV 85.13%。LLaVA-NeXT-7B 保留 320 tokens 时保留 96.25% 性能。Qwen2.5-VL-3B 在 89% token reduction 下平均保留 86.39%，高于 FastV 80.23% 和 PyramidDrop 78.43%。POPE 上推理 latency 从 211ms 降到 156ms，prefill 从 165ms 降到 103ms。
- 与现有方法对比：FastV、VTW、PyramidDrop、DART 都存在不同形式的静态或不可恢复 token 删除；ALVTS 的核心优势是每层重新选择重要 token，并保持 token 可访问性。
- 局限性：论文未设置独立局限性章节。已披露实验范围主要是图像 LVLM 和若干通用多模态 benchmark；未明确给出代码链接；对视频、多轮交互、OCR 极端场景、安全关键视觉细节的鲁棒性未明确披露。
- 复现难度：中。方法不要求重训原始 LVLM，selector 参数量相对小；但代码未明确披露，完整复现需要自己实现逐层 token routing、selector 训练和 LMMs-Eval 评测。
- 实际可用性：高。若目标是降低 LVLM prefill 和推理成本，它比永久剪枝更符合多层视觉关注差异。
- 潜在风险：论文未单列安全风险。潜在工程风险是压缩错误可能跳过对答案关键的视觉证据，尤其在细粒度识别、文档理解、医疗/安防图像等场景需额外验证。

### 评分

| 维度 | 分数 |
|---|---:|
| 创新性 | 8 |
| 方法严谨性 | 8 |
| 实验说服力 | 8 |
| 工程可复现性 | 5 |
| 应用价值 | 8 |

- 是否值得继续深读：是。它对 LVLM 推理成本优化有直接工程价值。
- 下一步关注点：寻找作者是否后续开源；若未开源，可先复现 LLaVA-1.5-7B 单层 selector 与 POPE/AI2D 子集。

---

## 4. Enhancing Multilingual Reasoning via Steerable Model Merging

- 题目：Enhancing Multilingual Reasoning via Steerable Model Merging
- 作者：Zhuoran Li, Rui Xu, Jian Yang, Junnan Liu, Zhijun Chen, Qianren Mao, Hongcheng Guo, Jiaheng Liu, Likang Xiao, Ming Li, Xiaojie Wang
- 会议/期刊：ACL 2026 Findings
- 发布时间：arXiv 2026-06-17
- 来源链接：[arXiv](https://arxiv.org/abs/2606.19002)

### 标准化阅读笔记

- 研究问题：多语言推理需要同时保留推理 LLM 的能力和多语言 encoder 的语义理解能力。固定模型融合对所有输入采用同一权重，容易在高资源语言中过度依赖外部 encoder、或在低资源语言中依赖不足。论文研究如何按输入动态调节两类模型表示的贡献。
- 核心方法：提出 ST-Merge。先用 mT5-xl encoder 提取多语言特征，用 MetaMath 等 LLaMA 系列推理模型提取 reasoning feature；通过映射层对齐特征空间；再用 gated cross-attention 和 language embedding 生成两个输入相关权重，动态调制多语言表示与推理表示，作为冻结 LLM decoder 的输入。
- 关键创新点：把 fixed model merging 改为 steerable model merging；用 gated cross-attention 学习输入相关的模型贡献；显式注入 language identity，以缓解不同语言对多语言理解和推理能力需求不同的问题。
- 实验设计：在 4 个多语言推理 benchmark 上评测，覆盖 21 种语言。任务包括 MGSM、MSVAMP、X-CSQA、XNLI。训练使用 Lego-MT 做 mapping layer，使用 MultilingualMath 学习 gated cross-attention；采用 mT5-xl encoder 与 MetaMath reasoning LLM；训练设置为 4 张 A100、learning rate 2e-5、batch size 128、3 epochs，三随机种子平均。
- 主要结果：MGSM 平均准确率 ST-Merge 60.0，高于 LayAlign 59.0、MindMerger 57.3；MSVAMP 平均 61.4，高于 MindMerger 60.4、LayAlign 59.1；X-CSQA 平均 62.5，略高于 LayAlign 62.3；XNLI 平均 79.9，略高于 LayAlign 79.7。消融中移除 gate network 后 MGSM 平均从 60.0 降到 56.9。
- 与现有方法对比：相较 Translate-En，ST-Merge 不依赖运行时翻译；相较 LangBridge、MindMerger、LayAlign 等固定或弱可控融合，ST-Merge 根据输入和语言动态调整 source model 贡献。
- 局限性：论文明确说明为公平比较，主要实验使用 Llama 2 系列模型；后续需要扩展到更多 backbone。另一个限制是权重生成过程缺少更细粒度指导，未来考虑 token-level 或 step-aware guidance。
- 复现难度：中。训练资源相对可控，但代码未明确披露；需要准备 mT5-xl、MetaMath、Lego-MT、MultilingualMath 和多 benchmark 评测。
- 实际可用性：中到高。对多语言推理系统和低资源语言增强有实用价值，尤其适合作为“外部多语言 encoder + 推理 LLM”的融合模块。
- 潜在风险：论文未单列安全风险。方法依赖 language ID 和训练语料，潜在风险包括低资源语言表现不均、语言识别错误导致 gating 偏移，以及在真实多语混写输入上泛化未明确。

### 评分

| 维度 | 分数 |
|---|---:|
| 创新性 | 7 |
| 方法严谨性 | 8 |
| 实验说服力 | 7 |
| 工程可复现性 | 6 |
| 应用价值 | 8 |

- 是否值得继续深读：是。它对多语言 reasoning alignment 与模型融合很有参考价值。
- 下一步关注点：查看是否有开源实现；重点复核 gating 权重与语言/正确性之间的相关分析。

---

## 5. Quantifying Consistency in LLM Logical Reasoning via Structural Uncertainty

- 题目：Quantifying Consistency in LLM Logical Reasoning via Structural Uncertainty
- 作者：Baishali Chaudhury, Mengdie Flora Wang, Hyunji Hayley Park, Rahul Ghosh, Sungmin Hong, Jae Oh Woo
- 会议/期刊：ICLR 2026 Workshop on Logical Reasoning of Large Language Models；OpenReview 标注 BestPaper
- 发布时间：OpenReview 2026-04-01；arXiv 2026-06-15
- 来源链接：[OpenReview](https://openreview.net/forum?id=YMwow5RQgP)、[arXiv](https://arxiv.org/abs/2606.17312)

### 标准化阅读笔记

- 研究问题：LLM 可能给出相同答案但推理路径不稳定或互相矛盾。传统 self-consistency/answer dispersion 只看答案分布，可能漏掉“答案一致但推理排序不稳定”的失败模式。论文研究如何衡量模型是否能稳定评价自己的候选推理路径。
- 核心方法：提出 structural uncertainty。对同一问题采样多个候选解，让同一模型对自己的候选解做 pairwise preference judgment；用 Bradley-Terry + PageRank 聚合稀疏偏好图，并分解为 across-trial ranking instability 与 within-trial candidate ambiguity 两个熵信号，再与 Self-ConsU 组合。
- 关键创新点：从“答案是否分散”转向“模型是否稳定排序自己的推理候选”；显式区分 across-trial instability 和 within-trial ambiguity；指出该方法不是通用置信度估计器，而是 regime-sensitive 的推理一致性评估器。
- 实验设计：评测 5 个模型：Claude Sonnet 4.5、GPT-OSS 20B、Qwen 3 32B、Amazon Nova Premier、DeepSeek R1。8 个 benchmark 分为数学/逻辑推理、reasoning-adjacent knowledge 和 retrieval-dominant regime，包括 Math-Synth、MATH-500、AMC-23、AIME-24/25、MMLU-Pro、TruthfulQA、HotpotQA。每题 N=5 候选回答，M=5 个 trials，每 trial 做 N-1 个 pairwise comparisons。
- 主要结果：在数学推理和部分知识任务上，StructU+Self-ConsU 能补充 answer dispersion；论文报告弱模型在难题上提升较大，例如 Qwen on AIME-25 +12.0% Sel-AUC，Amazon Nova Premier on AMC-23 +13.4%。HotpotQA 上结构信号塌缩，强模型中 dispersion 方法更优，例如 Claude Self-ConsU 0.839 vs hybrid 0.742。
- 与现有方法对比：相较 Self-ConsU、SemanticU、VerbalizedU，该方法利用候选推理之间的偏好结构；相较需要内部 logits/hidden states 的方法，它是黑盒协议，但调用成本更高。
- 局限性：论文明确说明需要 N 次生成和 M(N-1) 次 pairwise comparisons，推理成本增加；模型自评可能继承模型偏差；两个分量是固定协议下的可观测信号，不是普适不确定性源；当候选差异只是风格差异时偏好图会塌缩，如 HotpotQA；评估集中在短答案任务，长文本/开放生成是未来工作。
- 复现难度：中。数学和 QA 评测协议写得较细，但需要多模型 API/本地推理、候选采样、pairwise preference、BT/PageRank 聚合；成本主要来自多次生成和自评。
- 实际可用性：中到高。适合用于评估数学、逻辑、多步推理系统的可靠性；不适合直接当作所有任务的通用置信度分数。
- 潜在风险：若把 structural uncertainty 误当成通用 confidence estimator，会在 retrieval 或风格差异主导任务上误导决策；模型自评偏差也可能掩盖系统性错误。

### 评分

| 维度 | 分数 |
|---|---:|
| 创新性 | 8 |
| 方法严谨性 | 8 |
| 实验说服力 | 7 |
| 工程可复现性 | 7 |
| 应用价值 | 7 |

- 是否值得继续深读：是。它对“如何评估推理可靠性”有清晰的问题定义和边界分析。
- 下一步关注点：把协议在一个小型数学 benchmark 上复现，重点检查 HotpotQA 式 collapse signature 是否可作为自动切换评估器的触发条件。

## 复现优先级建议

1. OmniAgent：先跑公开权重推理与 LVBench/VideoMME 子集，不建议一开始复训。
2. SoftMoE：优先阅读并运行 router 单元测试/小模型训练，验证 LapSum soft top-k 的数值稳定性。
3. ALVTS：若找不到官方代码，可从 LLaVA-1.5-7B 单模型、POPE 子集、低秩 selector 开始最小复现。
4. ST-Merge：重点复现 gating ablation，而不是一次性覆盖 21 语言全量 benchmark。
5. Structural Uncertainty：可先用 1 个模型、1 个数学数据集、N=5/M=5 复现结构信号，再评估调用成本。
