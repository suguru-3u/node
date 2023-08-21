/**
 * メインファイル。
 * 下記サイトを参考にし、HTTPサーバーを構築
 * ルーティング、レスポンス機能を搭載
 * https://www.nodebeginner.org/index-jp.html
 *
 * nodeは、イベントループを行い処理を捌いている。
 * イベントループの順番
 * 1.setTimeout()のコールバック実行
 * 2.process.nextTick()のコールバック実行（メインモジュールの実行）
 * 3.I/Oイベントが発生するまで待機
 * 4.I/Oイベントのコールバック実行
 * 5.process.nextTick()のコールバック実行
 *
 * イベントの登録は、自分達でも行えることができて、EventEmitterを使用することでイベントを登録することができるようになる。
 * process.nextTick()を使用してイベントを発生させると必ずJavaScriptの実行が全て完了した後にイベントが実行される。
 */

const server = require("./server.js");
const router = require("./router.js");
const requestHandlers = require("./requestHandlers.js");

// ルーティングの判定を行うため、パス名に関数を代入している
const handle = {};
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;

server.start(router.route, handle);
