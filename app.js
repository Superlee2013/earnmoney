const request = require("request");
const cp = require("child_process");
const sleep = require("sleep");

let kw = "12.蛤蛤蛤蛤 by superlee";

// kw.replace(/\s+/g, "");
// console.log(kw);

let count = 0;

let url = "http://htpmsg.jiecaojingxuan.com/msg/current";

let problemMap = {};

queryProblem(url);

function queryProblem(url) {
    // if(count>24) return;
    sleep.sleep(1);
    request(url, function(error, response, body) {
        // body =
        // '{"code":0,"msg":"成功","data":{"event":{"answerTime":10,"desc":"12.以下哪个"}}}';
        queryProblem(url);
        if (!error && response.statusCode == 200) {
            console.log(body);
            let ret = JSON.parse(body);
            if (ret && ret.data) {
                let data = ret.data.event.desc;
                queryAnswer(data);
            }
        }
    });
}

function queryAnswer(kw) {
    kw = kw.replace(/\s+/g, "");
    if (problemMap[kw]) return;
    problemMap[kw] = true;
    kw = formatProblem(kw);
    console.log(kw);
    console.log("查询答案");
    count++;
    let queryUrl = "https://www.baidu.com/s?wd=" + kw;
    cp.exec("open " + queryUrl);
}

function browserCount(problem,choiceList){
    let counts = [];
    
}

function formatProblem(problem) {
    let index = problem.indexOf(".");
    if (index == -1) return problem;
    problem = problem.substring(index + 1, problem.length - 1);
    console.log(problem);
    return problem;
}

// opn('https://www.baidu.com/s?wd='+kw);
