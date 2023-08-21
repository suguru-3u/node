/**
 * リクエスト内容のハンドル定義を行なっている。
 */

// const exec = require("child_process").exec;
const querystring = require("querystring");

function start(response, postData) {
  console.log("Request handler 'start' was called.");

  // exec("ls", (error, stdout, stderr) => {
  //   response.writeHead(200, { "Content-Type": "text/plain" });
  //   response.write(stdout);
  //   response.end();
  // });

  const body =
    "<html>" +
    "<head>" +
    '<meta http-equiv="Content-Type" content="text/html; ' +
    'charset=UTF-8" />' +
    "</head>" +
    "<body>" +
    '<form action="/upload" method="post">' +
    '<textarea name="text" rows="20" cols="60"></textarea>' +
    '<input type="submit" value="Submit text" />' +
    "</form>" +
    "</body>" +
    "</html>";

  response.writeHead(200, { "Content-Type": "text/html" });
  response.write(body);
  response.end();
}

function upload(response, postData) {
  console.log("Request handler 'upload' was called.");

  response.writeHead(200, { "Content-Type": "text/plain" });
  response.write("You`are send " + postData);
  response.end();
}

exports.start = start;
exports.upload = upload;
