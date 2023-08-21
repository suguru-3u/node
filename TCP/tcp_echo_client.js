// TCPによるエコークライアントの実装
const net = require("net");
const readline = require("readline");

let options = {};
options.host = "localhost";
options.port = "11111";

const client = net.connect("11111", "localhost");

// 接続失敗時のイベント
client.on("error", (e) => {
  console.error("Connect Failed " + options.host + " : " + options.port);
  console.error(e.message);
});

// クライアントソケット接続確定時のイベント
client.on("connect", () => {
  console.log("Connected " + options.host + " : " + options.port);
});

// Control-cでクライアントソケットをクローズできるようにする
const rl = readline.createInterface(process.stdin, process.stdout);
rl.on("SIGINT", () => {
  console.log("Connection Closed - " + options.host + " : " + options.port);
  client.end();
  rl.close();
});

// 1秒毎にtimeoutするように設定して'Hello World'をサーバに送信
let i = 0;
client.setTimeout(1000);
client.on("timeout", () => {
  let str = "";
  // 2万個の文字列を連結して送信データを大きくする。
  for (let i = 0; i < 20000; i++) {
    str += "Hello World";
  }
  str += "\n";
  const ret = client.write(str);
  // if (!ret) {
  //   client.setTimeout(0);
  // }
  // 返り値、書き込みバイト数、バッファサイズを出力する
  process.stdout.write(
    "write: " +
      ret +
      ", " +
      client.bytesWritten +
      "bytesWritten, bufferSize: " +
      client.bufferSize +
      "byte"
  );
});

// Echoバックされてきたデータを標準出力に表示
client.on("drain", () => {
  console.log("drain emitted");
});

// クライアントソケット終了時のイベント
client.on("end", (had_error) => {
  client.setTimeout(0); //タイムアウトを無効化
  console.log("Connection End -" + options.host + options.port);
});

client.on("close", () => {
  console.log("Client Closed");
  rl.close();
});
