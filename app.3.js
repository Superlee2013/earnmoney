let product = true;
if(process.argv[2] == 'debug'){
    console.log("debug模式");
    product = false;
}
const Core = require("./Core");
let core = new Core(8001,product);
core.go();