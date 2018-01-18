const cp = require("child_process");
const sleep = require("sleep");
const request = require("request");

class Core1 {
    constructor(request, url, searchEngine) {
        this.request = request;
        this.url = url;
        this.searchEngine = searchEngine;
        this.problemMap = {};
    }

    earnMoney(){
        const that = this;
        sleep.sleep(1);
        request(this.url, function(error, response, body) {
            body =
            '{"code":0,"msg":"成功","data":{"event":{"answerTime":10,"correctOption":0,"desc":"12.李清照的《如梦令》里的“绿肥红瘦”是描写什么季节的景象？","displayOrder":11,"liveId":106,"options":"[\"晚春\",\"盛夏\",\"初秋\"]","questionId":1221,"showTime":1515762793422,"stats":[8061,6262,6557],"status":2,"type":"showAnswer"},"type":"showAnswer"}}';
            if (!error && response.statusCode == 200) {
                console.log(body);
                let ret = JSON.parse(body);
                if (ret && ret.data) {
                    let desc = ret.data.event.desc;
                    let choices = ret.data.event.options;
                    that.browserSearch(desc);
                    that.countProblemWithChoices(desc,choices);
                }
            }
            that.earnMoney();
        });
    }

    output(choice,count) {
        // console.log("百度为您搜索结果如下");
        // console.log(choice+": "+count);
    }

    browserSearch(problem) {
        problem = this.formatProblem(problem);
        let searchUrl = this.searchEngine + "?wd=" + problem;
        this.openBrowser(searchUrl);
    }

    countProblemWithChoices(problem,choiceList){
        let promiseList = this.buildRequestList(problem,choiceList);
        choiceList.forEach(item=>{
            let choice = choiceList[index];
            let searchKey = problem + " " + choice;
            let requestPromise = this.request(this.url,{wd:searchKey});
            requestPromise.then(res=> {
                let content = res.text;
                let count = handelBaiduResult(content);
                this.output(choice,count);
            })
            
        })
    }

    handelBaiduResult(text){
        let content = text;
        let pattern = "百度为您找到相关结果约(.*)个";
        let regExp = new RegExp(pattern, "i");
        let list = content.match(regExp);
        let count = list[1];
        return count;
    }

    buildRequestList(problem,choiceList){
        let promiseList = [];
        for(let index in choiceList){
            let choice = choiceList[index];
            let searchKey = problem + " " + choice;
            promiseList.push(this.request(this.url,{wd:searchKey}))
        }
        return promiseList;
    }

    formatProblem(problem) {
        problem = problem.replace(/\s+/g, "");
        let index = problem.indexOf(".");
        if (index == -1) return problem;
        problem = problem.substring(index + 1, problem.length - 1);
        // console.log(problem);
        return problem;
    }

    openBrowser(url) {
        let cmd = "";
        if (process.platform == "wind32") {
            cmd = 'start "%ProgramFiles%Internet Exploreriexplore.exe"';
        } else if (process.platform == "linux") {
            cmd = "xdg-open";
        } else if (process.platform == "darwin") {
            cmd = "open";
        }
        cp.exec(`${cmd} "${url}"`);
    }
}

module.exports = Core1;
