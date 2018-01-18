const cp = require("child_process");

// const key = "msg.long.chongdingdahui.com";
const key = "chongdingdahui";
const mark = "showQuestion";
const searchEngine = "https://www.baidu.com/s";

const descReg = /^.*"desc":"[1-9]{1,2}\.(.+)[?？].*",".*$/;
let problemMap = {};

const openBrowser = function(url) {
    let cmd = "";
    if (process.platform == "wind32") {
        cmd = 'start "%ProgramFiles%Internet Exploreriexplore.exe"';
    } else if (process.platform == "linux") {
        cmd = "xdg-open";
    } else if (process.platform == "darwin") {
        cmd = "open";
    }
    cp.exec(`${cmd} "${url}"`);
};

const formatProblem = function(problem) {
    if (!problem) return problem;
    problem = problem.replace(/\s+/g, "");
    let index = problem.indexOf(".");
    if (index == -1) return problem;
    problem = problem.substring(index + 1, problem.length - 1);
    return problem;
};

const analyzeProblem = function(dataStr) {
    // let dataStr = Buffer.concat(rawBody).toString();
    // console.log(dataStr);
    let index = dataStr.indexOf(mark);
    if (index == -1) {
        return null;
    }

    let matchRet = dataStr.match(descReg);
    if (matchRet && matchRet[1]) {
        return matchRet[1];
    }
    return null;
};

const browserSearch = function(question) {
    if (!question) return;
    // let desc = question.desc;
    // let problem = formatProblem(desc);
    if (problemMap[question]) return;
    problemMap[question] = true;
    let queryUrl = searchEngine + "?wd=" + question;
    openBrowser(queryUrl);
};

const queryAnswer = function(dataStr) {
    // console.log(rawBody);
    if (dataStr.length > 800) return;
    let questionData = analyzeProblem(dataStr);
    browserSearch(questionData);
};

let dataStr = process.argv[2];
console.log(dataStr);
if(dataStr.length > 800 ||!dataStr) return;

queryAnswer(dataStr);