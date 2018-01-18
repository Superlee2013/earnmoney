const cp = require("child_process");
const cluster = require('cluster');

const key = "chongdingdahui";
const mark = "totalLive";
const searchEngine = "https://www.baidu.com/s";

const descReg = /^.*"showTime":([0-9]+),".*$/;

let problemMap = {};

const openBrowser = function(url) {
    console.log("浏览器打开");
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
    if(!problem) return problem;
    // console.log("浏览器搜索12312 " + problem);
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
    console.log("位置:"+index);
    if(index==-1){
        return null;
    }
    let matchRet = dataStr.match(descReg);
    if(matchRet&&matchRet[1]){
        return matchRet[1];
    }

    return null;
};

const browserSearch = function(question) {
    if(!question) return;
    if (problemMap[question]) return;
    problemMap[question] = true;
    let queryUrl = searchEngine + "?wd=" + question;
    openBrowser(queryUrl);
};

const queryAnswer = function(dataStr) {
    console.log("查答案");
    if(dataStr.length>800) return;
    let questionData = analyzeProblem(dataStr);
    browserSearch(questionData);
};

module.exports = {
    summary: "by superlee",
    *beforeSendResponse(requestDetail, responseDetail) {
        // console.log(requestDetail.url);
        // console.log(requestDetail.requestOptions);
        // console.log(responseDetail);
        let hostName = requestDetail.requestOptions.hostname;

        if (hostName.indexOf(key) != -1) {
            console.log(hostName);
            let response = responseDetail.response;
            console.log(response);
            let rawBody = response.rawBody;
            console.log(rawBody);
            let data = Buffer.concat(rawBody).toString();
            // let data = '57:42["totalLive",{"showTime":1515935598002,"count":369857}]';
            console.log(data);
            try{
                // queryAnswer(data);
            } catch(e){
                // console.log(e);
            }
            
        }
    }
};
