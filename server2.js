// creating a server using http node js module


const http = require("http");
const url = require("url");

http.createServer(function(req, res){
    console.log(req)

}).listen(3001)