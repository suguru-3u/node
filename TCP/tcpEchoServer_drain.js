// 1.TCPサーバーの生成（送信同期版）
const net = require("net");
const readline = require("readline");

const server = net.createServer();
// TCPサーバーの接続最大数を設定
server.maxConnections = 3;

/**
 * ソケット
 * ソケットは各ネットワーク機器が外部とやりとりする際の窓口のことを指します。
 * IPアドレスをもとに相手先を特定し、お互いのソケットを窓口としてやりとりを行います。
 * */
/**
 * コンストラクタ
 * 定義したクラスからオブジェクトを生成し、初期化する際に実行される特殊な初期化用メソッドです。
 */

// クライアントコンストラクト
function Client(socket) {
  this.counter = 0;
  this.socket = socket;
  this.t_queue = {}; // 未実行のタイマーオブジェクトを格納
  this.tmout = null; // socketのpasue/resumeを実行するタイマーオブジェクトを保管
}

Client.prototype.writeData = function (d, id) {
  const socket = this.socket;
  const t_queue = this.t_queue;
  if (socket.writable) {
    const key = socket.remoteAddress + ":" + socket.remoePort;
    socket.write("[R]" + d, () => {
      delete t_queue[id];
    });
    process.stdout.write(key + " " + socket.bytesWritten + " bytes Written\n");
  }
};

let clients = {};

// クライアント接続時のイベント1
// 接続開始のログ
server.on("connection", (socket) => {
  const status = server.getConnections + "/" + server.maxConnections;
  const key = socket.remoteAddress + ":" + socket.remotePort;
  console.log("Connection start(" + status + ") - " + key);
  clients[key] = new Client(socket);
  // 10mesc秒後からソケットを停止・再開をランダムに繰り返す
  controlSocket(clients[key], "pause", 10);
});

// ソケットの停止・再開の制御を行う関数
// delay後にランダムな時間間隔でsocket/resumeを繰り返す
// pasue時間：最大3秒間,resume時間：最大10秒間
function controlSocket(client, action, delay) {
  const socket = client.socket;
  const key = socket.remoteAddress + ":" + socket.remotePort;
  if (action === "pause") {
    socket.pause();
    console.log(key + "socket pause");
    client.tmout = setTimeout(() => {
      controlSocket(client, "resume", Math.random() * 3 * 1000);
    }, delay);
  } else if (action === "resume") {
    socket.resume();
    console.log(key + "socket resume");
    client.tmout = setTimeout(() => {
      controlSocket(client, "pause", Math.random() * 3 * 1000);
    }, delay);
  }
}

// クライアント接続のイベント2
// socketに対してdataイベントリスナを登録する
server.on("connection", (socket) => {
  let data = "";
  const newLine = /\r\n|\n/;
  // 改行コードが送られるまで溜めておく
  socket.on("data", (chunk) => {
    data += chunk.toString();
    const key = socket.remoteAddress + ":" + socket.remotePort;
    if (newLine.test(data)) {
      clients[key].writeData(data);
      process.stdout.write(key + " " + socket.bytesRead + " bytes Read\n");
      data = "";
    }
  });
});

// クライアント接続時のイベント3
// クライアント接続終了時のイベントリスナを登録する
server.on("connection", (socket) => {
  const key = socket.remoteAddress + ":" + socket.remotePort;
  // socketが切断を要求してきたとき
  socket.on("end", () => {
    const status = server.connections + "/" + server.maxConnections;
    console.log("Connection end(" + status + ") - " + key);
    // socketのpasume/resumeするタイマーオブジェクトをクリアする
    if (clients[key].tmout) {
      clearTimeout(clients[key].tmout);
    }
    delete clients[key];
  });
});

//サーバーソケットクッローズ時のイベント
// serrver.close()後、全ての接続が終了した時にイベントが発生する。
server.on("close", () => console.log("Server Closed"));

// サーバーの開始と終了処理
server.listen(11111, "127.0.0.1", () => {
  const addr = server.address();
  console.log("Listening Start - " + addr.address + ":" + addr.port);
});

// Control-cでサーバーソケットをクローズ
const rl = readline.createInterface(process.stdin, process.stdout);
rl.on("SIGINT", () => {
  // 全てのソケットを終了する
  for (let i in clients) {
    if (clients[i].tmout) {
      clearTimeout(clients[i].tmout);
    }
    let socket = clients[i].socket;
    let t_queue = clients[i].t_queue;
    socket.end();
    for (let id in t_queue) {
      clearTimeout(t_queue[id]);
    }
  }
  server.close();
  rl.close();
});
