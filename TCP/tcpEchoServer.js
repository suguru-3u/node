// 1.TCPサーバーの生成（送信同期版）
const net = require("net");
const readline = require("readline");

const server = net.createServer();
// TCPサーバーの接続最大数を設定
server.maxConnections = 3;

// データコンストラクト
function Data(d) {
  this.data = d;
  // タイムアウト済みフラグ
  this.responded = false;
}

// クライアントコンストラクト
/**
 * ソケット
 * ソケットは各ネットワーク機器が外部とやりとりする際の窓口のことを指します。
 * IPアドレスをもとに相手先を特定し、お互いのソケットを窓口としてやりとりを行います。
 * */
/**
 * コンストラクタ
 * 定義したクラスからオブジェクトを生成し、初期化する際に実行される特殊な初期化用メソッドです。
 */

function Client(socket) {
  this.counter = 0;
  this.socket = socket;
  this.t_queue = {}; // 未実行のタイマーオブジェクトを格納
  this.w_queue = []; // 未送信データを格納する配列
}

Client.prototype.writeData = function (d, id) {
  const socket = this.socket;
  const t_queue = this.t_queue;
  const w_queue = this.w_queue;
  // 送信データが一番最初の未送信データであった場合に継続する
  if (w_queue[0].data !== d) return;
  // 頭から順番にタイムアウトが過ぎているデータを送信する
  while (w_queue[0] && w_queue[0].responded) {
    const w_data = w_queue.shift().data;
    if (socket.writable) {
      const key = socket.remoteAddress + ":" + socket.remoePort;
      process.stdout.write("[" + key + "] -" + w_data);
      socket.write("[R]" + w_data, () => {
        delete this.t_queue[id];
      });
    }
  }
};

let clients = {};

// クライアント接続時のイベント1
server.on("connection", (socket) => {
  const status = server.getConnections + "/" + server.maxConnections;
  const key = socket.remoteAddress + ":" + socket.remotePort;
  console.log("Connection start(" + status + ") - " + key);
  clients[key] = new Client(socket);
});

// クライアント接続のイベント2
// socketに対してdataイベントリスナを登録する
server.on("connection", (socket) => {
  let data = "";
  const newLine = /\r\n|\n/;
  // 改行コードが送られるまで溜めておく
  socket.on("data", (chunk) => {
    function writeDataDelayed(key, d) {
      const client = clients[key];
      const d_obj = new Data(d);
      client.w_queue.push(d_obj);
      const tmout = setTimeout(() => {
        // タイムアウト済みフラグを変更する
        d_obj.responded = true;
        client.writeData(d_obj.data, client.counter);
      }, Math.random() * 10 * 1000);
      client.t_queue[client.counter++] = tmout;
    }
    data += chunk.toString();
    const key = socket.remoteAddress + ":" + socket.remotePort;
    if (newLine.test(data)) {
      writeDataDelayed(key, data);
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
