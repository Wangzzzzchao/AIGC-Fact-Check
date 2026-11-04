// Part 2: 幻灯片 8-14（v3 仿人工朴素版）
const H = require("./theme.js");
const { T, F, title, pageno, bullets, box, arrow } = H;

function build(pres) {
  // ============ Slide 8 相关工作 ============
  let s = pres.addSlide();
  title(s, "相关工作：四条研究线，各有进展、各有缺口");
  bullets(s, [
    { lead: "审稿生成与决策预测：", body: "异质图建模范式可行，但目标是 accept/reject 预测", gap: 2 },
    { lvl: 1, body: "代表工作：ReViewGraph（AAAI 2026）、CycleReviewer（ICLR 2025）、GraphEval（ICLR 2025）、AgentReview（EMNLP 2024）、AI-Scientist、DeepReview" },
    { lvl: 1, body: "缺口：边是论辩关系而非事实关系；辩论由 LLM 模拟，分布与真实评审不同", gap: 8 },
    { lead: "审稿事实核查：", body: "任务限定「评审 vs 被审论文」", gap: 2 },
    { lvl: 1, body: "代表工作：HalluPeer（12K 论文 / 38K 评审合成注入基准）、Peerispect（SIGIR 2026 Demo）、Peerify（800 条原子主张）、CLAIMCHECK" },
    { lvl: 1, body: "缺口：Peerispect 明确排除外部文献验证；幻觉定义为「被论文不支持或与论文矛盾」", gap: 8 },
    { lead: "评审间矛盾检测：", body: "停在「发现分歧」，不裁决", gap: 2 },
    { lvl: 1, body: "代表工作：ContraSciView（EMNLP 2023）、IMPACT / RevCI（aspect 条件化矛盾 span + 强度分级）、CoCoReviewBench" },
    { lvl: 1, body: "缺口：只标矛盾不裁决；CoCoReviewBench 用 meta-review 仲裁但仅用于构建训练参考", gap: 8 },
    { lead: "主张—文献验证：", body: "检索—判定范式可行，但对象不是评审文本", gap: 2 },
    { lvl: 1, body: "代表工作：SciFact / SciFact-Open（1,409 主张 vs 5,183 摘要）、MultiVerS、HALLMARK、RefChecker、FactReview（引入执行证据）" },
    { lvl: 1, body: "缺口：对象是论文内主张或通用科学主张；评审的压缩表达（省略任务条件与适用范围）与通用主张不同", gap: 0 }
  ], { y: 1.02, h: 4.15, size: 12.5, subSize: 11 });
  pageno(s, 8);
  s.addNotes("相关工作按四条线梳理。第一条审稿生成与决策预测，ReViewGraph 用异质图建模 LLM 模拟的审稿辩论，证明了图范式可行，但它预测的是录用决定；第二条审稿事实核查，HalluPeer、Peerispect 都很成熟，但任务限定为评审对被审论文，Peerispect 甚至明确排除外部文献验证；第三条矛盾检测，ContraSciView 只做检测，CoCoReviewBench 用 meta-review 仲裁但只拿来构建训练参考；第四条主张文献验证，SciFact 证明范式可行，但对象不是评审文本。四条线各管一段，没有人把它们组织起来面向已写出的评审做统一核查。");

  // ============ Slide 9 缺口与切入点 ============
  s = pres.addSlide();
  title(s, "缺口总结：四个缺口，一个切入点");
  bullets(s, [
    { lead: "证据源割裂：", body: "论文内核查、外部科学主张验证、矛盾检测三线各自推进，缺少面向已写出评审的统一组织与可追溯核查输出" },
    { lead: "文献主张缺测量：", body: "真实评审中文献类主张的比例、可核实性与典型错误形态（引用身份错误、错误归因、夸大适用范围），尚无第一手量化数据" },
    { lead: "冲突缺裁决：", body: "现有工作停在「发现分歧」，没有回到被审论文与外部文献证据判断各方主张是否成立；矛盾 ≠ 事实错误" },
    { lead: "关系价值待验证：", body: "相关主张可能共享证据、也可能相互冲突；显式组织三类关系是否优于逐条独立核查——这是本项目要检验的方法问题" },
    { lead: "本项目的切入点：", body: "以 ReviewClaim（评审事实主张）为核心，同时连接被审论文、外部文献与其他评审中的相关主张，输出「支持 / 反驳 / 证据不足」及可回溯的证据路径；与现有工作互补而非竞争——关系 I 复用成熟管线，增量集中在关系 II 与 III", bold: true, gap: 0 }
  ], { y: 1.15, h: 3.9, size: 13, gap: 9 });
  pageno(s, 9);
  s.addNotes("把缺口收敛成四条：证据源割裂、文献主张没人测、冲突没人裁决、关系建模的价值没人验证过。最后是切入点——一切围绕 ReviewClaim 这个核心对象展开，三类信息源都挂到它上面，最终输出带证据路径的三分类标签。这个定位让我们和现有工作形成互补而不是竞争：关系 I 复用成熟管线，增量集中在关系 II 和 III。");

  // ============ Slide 10 研究问题与核心假设 ============
  s = pres.addSlide();
  title(s, "研究问题：三个子问题，一个可检验的核心假设");
  bullets(s, [
    { lead: "RQ1（边 2）外部文献核查：", body: "如何把评审中的文献类主张对齐到外部文献，并判定其得到支持、受到反驳或证据不足？引用身份核验单独评测。" },
    { lead: "RQ2（边 3）冲突检测与裁决：", body: "如何检测评审间的事实性冲突（区别于评价性分歧），并利用被审论文或外部文献证据判断各方主张是否成立？" },
    { lead: "RQ3（三边统一）关系建模的价值：", body: "显式组织三类关系，能否比逐条独立核查更准确地定位证据、识别冲突并给出最终标签？" },
    { lead: "核心假设：", body: "当多条评审主张共享证据或发生事实冲突时，显式建模「评审主张—论文—外部文献—其他评审主张」之间的关系，有望提高核查准确性与证据可解释性；该假设通过与独立核查管线的对照实验验证，若不成立，方法降级而数据资产保留", bold: true },
    { size: 11.5, body: "任务边界：主观评价性陈述（评分倾向、新颖性判断等）不进入事实标签，只核查可核实陈述。", gap: 0 }
  ], { y: 1.15, h: 3.9, size: 13, gap: 9 });
  pageno(s, 10);
  s.addNotes("三个子问题分别对应三条边：RQ1 解决外部文献对齐与判定，RQ2 解决事实冲突检测加证据裁决，RQ3 是方法层面的问题——关系建模到底有没有增益。核心假设我特意写成可检验的形式：如果对照实验显示统一图建模不优于独立管线，假设就被证伪，我们会降级方案。这样导师可以放心，这不是一个赌注，而是一个有明确验证标准的科学问题。");

  // ============ Slide 11 框架图（手画感） ============
  s = pres.addSlide();
  title(s, "ReviewGraph 框架：四类节点 + 三条边");
  bullets(s, [
    { lead: "Paper：", body: "被审论文（可细化为 Section / Claim 节点）" },
    { lead: "ReviewClaim：", body: "评审中的事实性主张（观点级粒度，LLM 抽取 + 人工校验）" },
    { lead: "ExternalPaper：", body: "被评审提及或与论文相关的外部文献（引用网络 + 检索）" },
    { lead: "ExternalClaim：", body: "外部文献中的关键结论 / 主张" }
  ], { x: 0.5, y: 1.15, w: 3.35, h: 2.6, size: 11.5, gap: 8 });
  // 手画示意图：白底黑框 + 箭头
  box(s, pres, 4.35, 1.05, 1.7, 0.5, "被审论文 Paper", { size: 11.5 });
  box(s, pres, 7.15, 1.05, 1.95, 0.5, "外部文献 ExternalPaper", { size: 11.5 });
  box(s, pres, 5.55, 2.35, 2.0, 0.55, "评审主张 ReviewClaim", { size: 12 });
  box(s, pres, 5.55, 3.75, 2.0, 0.5, "其他评审的相关主张", { size: 11.5 });
  arrow(s, pres, 5.2, 1.55, 0.85, 0.8, {});
  arrow(s, pres, 6.95, 1.55, 0.85, 0.8, { flipH: true });
  arrow(s, pres, 6.55, 2.9, 0, 0.85, { dash: "dash" });
  s.addText("边 1：supports / contradicts /\ninsufficient_evidence", { x: 3.7, y: 1.8, w: 1.7, h: 0.55, fontSize: 9.5, color: T.muted, align: "right", fontFace: F, lineSpacingMultiple: 1.1 });
  s.addText("边 2：cites / aligns_with /\ncontradicts / unresolved", { x: 7.9, y: 1.75, w: 1.6, h: 0.55, fontSize: 9.5, color: T.muted, fontFace: F, lineSpacingMultiple: 1.1 });
  s.addText("边 3：fact_agrees / fact_contradicts / unrelated", { x: 6.75, y: 3.15, w: 2.75, h: 0.3, fontSize: 9.5, color: T.muted, fontFace: F });
  bullets(s, [
    { bold: true, body: "输出：每条 ReviewClaim 的证据状态（supported / contradicted / insufficient evidence）+ 可回溯证据路径；主观评价性陈述不进入事实标签", gap: 0 }
  ], { y: 4.5, h: 0.6, size: 12.5 });
  pageno(s, 11);
  s.addNotes("框架总览。左边是四类节点：被审论文、评审主张、外部文献、外部文献里的关键结论。右边示意图：ReviewClaim 是中心节点，向上两条边分别连被审论文（边 1，复用成熟管线）和外部文献（边 2，核心增量一），向下虚线边连其他评审的相关主张（边 3，核心增量二）。每条边有明确的语义标签。最终输出是三分类证据状态加可回溯的证据路径——审稿人、作者、领域主席都能点进去看证据原文。注意任务边界：主观评价（比如新颖性强不强）不进事实标签，我们只核查可核实的陈述。");

  // ============ Slide 12 边2 方法 ============
  s = pres.addSlide();
  title(s, "边 2 方法：外部文献核查四步管线（核心增量一）");
  bullets(s, [
    { lead: "① 主张筛选：", body: "从评审文本识别文献类主张——prior work 描述、领域共识断言、方法归属断言、基线断言；过滤纯评价性语句；可借鉴 HalluPeer 的 aspect 标注思想，把主张挂到「相关工作 / 实验 / 理论」等 aspect 下" },
    { lead: "② 文献对齐：", body: "解析主张中的引用与实体（作者名、年份、方法名），在 Semantic Scholar / arXiv 语料中检索候选文献；区分「明确引用」与「隐式提及」两类对齐难度" },
    { lead: "③ 关系判定：", body: "对对齐成功的文献抽取相关结论与限定条件（ExternalClaim），用 NLI / LLM 辅助判定 aligns_with / contradicts；检索无果时标记 unresolved，不直接判定为虚构引用" },
    { lead: "④ 时间与版本控制：", body: "以评审发生时可获得的文献和投稿版本为准，避免使用后续发表的工作或 camera-ready 修改内容反向判定早期评审" },
    { bold: true, body: "两大难点：隐式提及的对齐（评审常说「现有方法大多…」而不点名）；检索召回不足时正确放弃（宁可判 insufficient evidence，不强行下结论）", gap: 0 }
  ], { y: 1.15, h: 3.9, size: 13, gap: 9 });
  pageno(s, 12);
  s.addNotes("边 2 是本项目的第一个核心增量，管线分四步：先筛选出文献类主张，再做文献对齐，然后判定主张和文献的关系，全程用评审发生时的文献快照做时间控制——这点很重要，不能用后来发表的工作去倒推当年的评审错了。两个技术难点要提前说明：一是隐式提及，评审经常说「现有方法大多如何如何」但不点名，对齐很难；二是检索不到证据时必须正确放弃，标记 unresolved 而不是硬判虚构。这两个难点也是 pilot 要测的：管线精度够不够支撑大规模标注。");

  // ============ Slide 13 边3 方法 ============
  s = pres.addSlide();
  title(s, "边 3 方法：跨评审冲突，从发现到裁决（核心增量二）");
  bullets(s, [
    { lead: "STEP 1 主张对齐：", body: "判断两条 ReviewClaim 是否指向同一事实对象（同一数据集 / 方法 / 数值 / 相关工作）；先粗粒度聚类（aspect + 实体匹配），再簇内细粒度对齐；报告对齐失败率" },
    { lead: "STEP 2 冲突判定：", body: "对齐后判定 fact_agrees / fact_contradicts；关键设计：显式区分「评价性分歧」（如对新颖性的不同判断，不算事实错误）与「事实性矛盾」（对同一事实对象给出互斥描述）" },
    { lead: "STEP 3 事实裁决：", body: "对 fact_contradicts 的簇，分别回到边 1、边 2 检索原始证据，判断每条主张 supported / contradicted / 证据不足；meta-review 仅作辅助分析或弱监督，不作测试阶段唯一事实依据" },
    { bold: true, body: "矛盾是线索、不是结论——谁对谁错，必须回到被审论文与外部文献的原始证据" },
    { size: 11.5, body: "辅助信号：作者 rebuttal 与讨论区回复可作为弱监督候选，但不作测试金标。", gap: 0 }
  ], { y: 1.15, h: 3.9, size: 13, gap: 9 });
  pageno(s, 13);
  s.addNotes("边 3 是第二个核心增量，和 ContraSciView 那类矛盾检测的本质区别在第三步：我们不止步于发现矛盾，还要裁决。流程是：先把不同评审的主张对齐到同一事实对象，再判定是不是事实性矛盾——这里有个关键设计，评价性分歧（比如一个评审觉得新颖、另一个觉得不新颖）不算事实错误，任务定义里显式排除；确认是事实矛盾后，回到边 1 和边 2 的证据分别核查双方。meta-review 只用于辅助分析和弱监督，不作测试集的金标依据，避免循环论证。");

  // ============ Slide 14 图推理与降级 ============
  s = pres.addSlide();
  title(s, "图推理：第一版实例与降级路径");
  bullets(s, [
    { lead: "第一版候选：HGT 异质图 Transformer", gap: 2 },
    { lvl: 1, body: "节点类型与边类型先验沿用 ReViewGraph 的实现思路，支持三边统一的消息传递" },
    { lvl: 1, body: "推理目标：ReviewClaim 节点级三分类（supported / contradicted / insufficient evidence）" },
    { lvl: 1, body: "边级任务（证据关系识别、矛盾边识别）做多任务训练" },
    { lvl: 1, body: "理论收益：共享证据在图上传播——一条主张的证据可辅助判定相关主张", gap: 8 },
    { lead: "若增益不及预期：可降级", gap: 2 },
    { lvl: 1, body: "对照基线：强检索 + 逐条独立核查管线" },
    { lvl: 1, body: "降级方案一：「图做证据传播 + LLM 判定」；降级方案二：「检索增强逐条判定 + 关系约束」" },
    { lvl: 1, body: "数据资产不受损：标注数据集、多源检索管线、冲突定位能力全部保留", gap: 8 },
    { bold: true, body: "项目的核心是多源证据核查，而非预先绑定某一种图模型——HGT 只是第一版候选实现，具体模型不构成方向成立的前提", gap: 0 }
  ], { y: 1.05, h: 4.1, size: 13, subSize: 11.5 });
  pageno(s, 14);
  s.addNotes("方法层面想说清楚一件事：我们不赌图模型。第一版用 HGT 做三边统一的消息传递，理论收益是共享证据可以在图上传播——比如两条主张引用同一篇外部文献，一条的判定结果能辅助另一条。但 RQ3 的对照实验会严格检验这个收益：如果图推理相对强检索基线没有稳定增益，就降级为检索增强逐条判定加关系约束。降级后数据集、检索管线、冲突定位能力都还在，项目仍然成立。这是可控风险，不是单点押注。");

  return 14;
}

module.exports = { build };
