const rule = require("./proxy/rules");
const rule_debug = require("./proxy/rules.debug");

const Util = require("./util");
const AnyProxy = require("anyproxy");

class Core {
    constructor(port,env) {
        this.port = port;
        this.product = env;
    }

    go() {
        const options = {
            port: this.port,
            rule: this.product?rule:rule_debug,
            webInterface: {
                enable: true,
                webPort: 8002,
                wsPort: 8003
            },
            throttle: 10000,
            forceProxyHttps: false,
            silent: true
        };

        const proxyServer = new AnyProxy.ProxyServer(options);

        proxyServer.on("ready", () => {
            console.log("代理启动");
            console.log("ip地址: " + Util.getIPAdress() + "; 端口号: " + this.port);
        });
        proxyServer.on("error", e => {
            console.log("代理异常，未启动");
        });
        proxyServer.start();

        proxyServer.close();
    }
}

module.exports = Core;
