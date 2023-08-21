/**
 * TCPサーバーの概要
 * 1.TCPサーバーの生成
 * 2.TCPサーバーをリッスンする
 * 3.TCPクライアントから接続を受ける
 * 4.TCPクライアントからデータを受信する
 * 5.TCPクライアントにデータを送信する
 * 6.TCPクライアントへのデータ送信が溜まる
 * 7.TCPクライアントへのデータ送信の溜まりが解消する。
 * 8.TCPクライアントから接続終了を受ける
 * 9.TCPクライアントとの接続を終了する
 * 10.TCPサーバを終了する
 */

// 1.TCPサーバーの生成
const net = require("net");

// 引数は省略可能
const server = net.createSerrver();

// 2.TCPサーバーをリッスンする
server.listen(11111, "127.0.0.1");
server.on("listening", () => console.log("Hello"));

// 3.TCPクライアントから接続を受ける
server.on("connection", (socket) => {
  // 4.TCPクライアントからデータを受信する
  socket.on("data", (chunk) => {
    console.log("受信データ", chunk); // 文字コードを設定していないので、Buffer型で渡される
  });
  const ret = socket.write("hello"); // osへの書き込みに待ちがなければ、retはtrueとなる
  // 6.TCPクライアントへのデータ送信が溜まる
  if (ret === false) {
    // 送信データが溜まっている。その値を標準出力に出す。
    console.log(socket.bufferSize);
  }
  // 5.TCPクライアントにデータを送信する orq
  // 7.TCPクライアントへのデータ送信の溜まりが解消する。
  socket.on("drain", () => {
    console.log("送信するデータ", ret);
  });

  // 8.TCPクライアントから接続終了を受ける
  socket.on("end", () => {
    console.log("end connection", server.coonections);
  });

  // 9.TCPクライアントとの接続を終了する
  socket.on("close", () => {
    console.log("close socket");
  });
});

/**
 * TCPクライアントの概要
 */

const socket = new net.Socket();
socket.connect(1338, "localhost");
// TCPサーバーと同様のメソッド、イベントによってデータの書き込み(write),受信(data),終了(end)の操作が可能
socket.on("connect", () => {
  console.log("TCP Client connected");
  socket.end();
});
