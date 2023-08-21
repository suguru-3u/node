/**
 * HTTPサーバーの役割。
 * リクエストをルーティング設定をしているファイルに渡し、リクエストに応じたレスポンスを返している。
 */

const http = require("http");
const url = require("url");

function start(route, handle) {
  function onRequest(request, response) {
    let postData = "";
    // リクエストされたURLを取得
    const pathname = url.parse(request.url).pathname;

    // 文字コードの設定
    request.setEncoding("utf8");

    // 指定したイベントに処理を実行するために[addListener]を使用。
    // https://mag.osdn.jp/13/03/18/0939236/3
    request.addListener("data", (postDataCheck) => {
      // レスポンスのデータは、分割された data イベントとして受信されるので、
      // data イベントが呼び出される度に受信したデータを結合していく必要があるようです
      // （短いデータを受信するときは結合しなくても全体を受信できてしまうので気付きにくいですが）。
      postData += postDataCheck;
      console.log("Received POST data chunk" + postDataCheck + ".");
    });

    request.addListener("end", () => {
      route(handle, pathname, response, postData);
    });
  }

  // createServerでサーザーを立ち上げ、listenのメソッドでサーバーのポート番号を指定する。
  // .listenでイベント登録が行われて、httpリクエストがされるまで待機する非同期処理になる。
  http.createServer(onRequest).listen(8888);
  console.log("Server has started.");
}

exports.start = start;
