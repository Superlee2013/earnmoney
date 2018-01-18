class SLRequest {
    constructor(request) {
        this.request = request;
    }

    getFormData(url, data) {
        const that = this;
        let postDataStr = url+"?";
        for(let key in data){
            let value = data[key];
            postDataStr+=(key+"="+value+"&");
        }
        postDataStr = postDataStr.substr(0,postDataStr.length-1);
        console.log(postDataStr);
        return new Promise(function (resolve, reject) {
            that.request(postDataStr, function (err, httpResponse, body) {
                if (!err) {
                    var result = JSON.parse(body);
                    resolve(result);
                } else {
                    reject(err);
                }
            });
        });
    }

}

module.exports = SLRequest;