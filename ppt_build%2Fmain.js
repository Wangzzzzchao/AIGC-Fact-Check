// ReviewGraph 导师汇报 PPT 生成入口
const path = require("path");
const pptxgen = require("pptxgenjs");

const part1 = require("./part1.js");
const part2 = require("./part2.js");
const part3 = require("./part3.js");

const pres = new pptxgen();
pres.defineLayout({ name: "W16x9", width: 10, height: 5.625 });
pres.layout = "W16x9";
pres.author = "ta285026";
pres.company = "AIGC 事实核查研究";
pres.title = "ReviewGraph：面向学术评审事实核查的三维异质图框架";
pres.subject = "导师方向汇报 v0.3";

const n1 = part1.build(pres);
const n2 = part2.build(pres);
const n3 = part3.build(pres);
console.log("slides built:", n1, n2, n3);

const out = path.join(__dirname, "ReviewGraph_导师汇报_v0.3.pptx");
pres.writeFile({ fileName: out }).then((f) => {
  console.log("OK:", f);
}).catch((e) => {
  console.error("FAILED:", e);
  process.exit(1);
});
