var http = require('http');
var fs = require('fs');
http.createServer(function(request,response){
	if (request.url == '/')
	{
		fs.readFile('index.html',function readData(err,data){
			response.writeHead(200,{'Content-Type':'text/html'});
			response.end(data);
		});
	}
	else if (request.url == '/about')
	{
		fs.readFile('about.html',function readData(err,data){
			response.writeHead(200,{'Content-Type':'text/html'});
			response.end(data);
		});
	}
	else if (request.url == '/help')
	{
		fs.readFile('help.html',function readData(err,data){
			response.writeHead(200,{'Content-Type':'text/html'});
			response.end(data);
		});
	}else{
		fs.readFile('404.html',function readData(err,data){
			response.writeHead(200,{'Content-Type':'text/html'});
			response.end(data);
		});
	}
}).listen(8080,'127.0.0.1');
console.log(1+10000)