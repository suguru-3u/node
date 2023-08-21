/**
 * このファイルはNode.jsの非同期処理に関して学習した内容を記録したファイルである
 */

const { resolve } = require("path");

// 代表的なコールバックを使用した非同期プログラム
setTimeout(() => {
  console.log("1秒追加");
}, 1000);
console.log("setTimeoutを実行");

// -- 実行ログ --
// setTimeoutを実行
// 1秒追加

//　非同期処理のエラーハンドリング
//  同期的な処理と同様にtry..catchを使用するとうまくいかない
function parseJSONAsync(json, callback) {
  try {
    setTimeout(() => {
      callback(JSON.parse(json));
    }, 1000);
  } catch (err) {
    console.log("エラーをキャッチ", err);
  }
}
// parseJSONAsync("aa", (result) => console.log("parse結果", result));

// -- 実行ログ --
// undefined:1
// aa

// 上記を修正するとこうなる
function parseJSONAsync2(json, callback) {
  setTimeout(() => {
    try {
      callback(JSON.parse(json));
    } catch (err) {
      console.log("エラーをキャッチ", err);
    }
  }, 1000);
}

// parseJSONAsync2("aa", (result) => console.log("parse結果", result));

// -- 実行ログ --
// エラーをキャッチ SyntaxError: Unexpected token a in JSON at position 0

// Promiseを使用した非同期プログラミング
function parseJSONAyncPromise(json) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(JSON.parse(json));
      } catch (err) {
        reject(err);
      }
    }, 1000);
  });
}

const toBeFulfilled = parseJSONAyncPromise('{ "foo": 1 }');
// const toBeRejected = parseJSONAyncPromise("不正なjson");
console.log("******Promise生成直後******");
console.log(toBeFulfilled);
// console.log(toBeRejected);
setTimeout(() => {
  console.log("******1秒後******");
  console.log(toBeFulfilled);
  // console.log(toBeRejected);
}, 1000);

// -- 実行ログ --
// ******Promise生成直後******
// Promise { <pending> }
// Promise { <pending> }
// 1秒追加
// undefined:1
// [object Object]

function ayncHello() {
  return new Promise((resolve, reject) => {
    try {
      resolve("Hello");
    } catch {
      reject("Error");
    }
  });
}

const res = ayncHello();
console.log(res);
setTimeout(() => {
  res
    .then((res) => console.log(res + " :こんにちわ"))
    .then((res) => console.log(res + " :ニーハオ"))
    .then((res) => console.log(res + " :本ジョール"))
    .catch("Error");
}, 1000);

function promiseAll1() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("1秒");
    }, 1000);
  });
}

function promiseAll2() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("2秒");
    }, 2000);
  });
}
function promiseAll3() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("3秒");
    }, 3000);
  });
}

Promise.all([promiseAll1(), promiseAll2(), promiseAll3()]).then((data) => {
  console.log(data);
  console.log("全ての処理が完了");
});
