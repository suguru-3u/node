/**
 * コールバックAPIを利用した非同期処理の例
 *
 * ・コールバックとは
 * 関数の引数に関数を与えること
 *
 * Node.jsのコールバックの非同期処理には規約がある(seTtimeoutはブラウザのJSの規約に準拠している)
 * 1.コールバックがパラメータの最後にあること
 * 2.コールバックの最初のパラメータが処理中に発生したエラー、2つ目以降のパラメータが処理の結果であること
 */

setTimeout(() => console.log("非同期処理"), 1000);

// import fs from "fs";

// fs.readdir(".", (err, files) => {
//   console.log("fs.readdir()実行結果");
//   console.log("err:", err);
//   console.log("files:", files);
// });

/**
 * 非同期処理のエラーハンドリング
 *
 * parseFailJSONのエラーハンドリングでは、catchにエラー内容が伝わらない.
 * setTimeoutはparseFailJSONの処理が呼ばれた後に実行され、関数の外で実行されるのと同じになる（プログラムではparseFailJSONの中に記載しているが）
 * そのため、tryの中でエラーをキャッチすることができなずにいる。
 * 正しくエラーハンドリングを行うのであれば、parseSuccesJSONのように記述するが、コールバック関数の引数errで適切に処理を行う必要がある。
 */

// function parseFailJSON(json, callback) {
//   try {
//     setTimeout(() => {
//       callback(JSON.parse(json));
//     }, 1000);
//   } catch (err) {
//     console.log("エラーをキャッチ", err);
//   }
// }

function parseSuccesJSON(json, callback) {
  setTimeout(() => {
    try {
      callback(JSON.parse(json));
    } catch (err) {
      console.log("エラーをキャッチ", err);
    }
  }, 1000);
}

/**
 * Promise
 * ES2015から導入された非同期処理の状態と結果を表現するオブジェクト
 * Promiseを使用することで、非同期処理が書きかやすいものとなった。
 * 巨大なファイルをstreamで取得したり、何度も結果が返ってくる通信は向いていない
 *
 * Promiseは以下3つの状態が存在し、状態が変化した場合、その後に状態が変わることはない
 * pending・・・結果が未確定(デフォルト)
 * fulffiled・・非同期処理に成功
 * rejected・・・非同期処理が失敗
 *
 */

function parseJSONPromise(json) {
  // Promiseインスタンスを生成する（pending）
  // Promiseのコンストラクタは、関数をパラメータとする
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // fulfilled状態にする(引数なしでも可)
        resolve(JSON.parse(json));
      } catch (err) {
        // reject状態にする(引数なしでも可)
        // 単にエラーをthrowしても、Promiseをrejectに遷移することができる。
        reject(err);
      }
    });
  });
}

const toBeFulfilled = parseJSONPromise('{ "foo": 1 }');
// const toBeRejected = parseJSONPromise("不正な値");
console.log("******Promise生成直後******");
console.log(toBeFulfilled);
// console.log(toBeRejected);
setTimeout(() => {
  console.log("******1秒後******");
  console.log(toBeFulfilled);
  // console.log(toBeRejected);
}, 1000);

// 実行結果
// ******Promise生成直後******
// Promise { <pending> }
// ******1秒後******
// Promise { { foo: 1 } }

/**
 * Promiseのpendingを経ずに、fulfiledまたはrejectedなPromiseインスタンスを直接生成する方法
 * Promise.allなどで使われる？
 */

new Promise((resolve) => resolve({ foo: 1 }));
Promise.resolve({ foo: 1 });
// Promise.reject(new Error("エラー"));

/**
 * then(常に非同期で実行される)
 * Promiseインスタンスの状態が、fulffiledやrejectedになった際に実行するコールバックを登録するメソッド
 * thenの実行は、元のPromiseインスタンスには影響を与えない
 */

const thenResult = new Promise((resolve, reject) => {
  try {
    resolve("成功");
  } catch (err) {
    reject("error");
  }
  // resoleなら成功、rejectならerrorがコンソール上に表示される
}).then((promise) => console.log("promisenの状態", promise));

// thenを使用すればPromiseの処理を逐次実行を行うこともできる
function promiseFunc1() {
  return new Promise((resolve) => resolve("成功1"));
}
function promiseFunc2() {
  return new Promise((resolve) => resolve("成功2"));
}
function promiseFunc3() {
  return new Promise((resolve) => resolve("成功3"));
}

function promiseFunc(input) {
  try {
    promiseFunc1().then(promiseFunc2).then(promiseFunc3);
  } catch (err) {
    console.log("err");
  }
}

/**
 * catch(常に非同期で実行される)
 * rejectedステータスのPromiseオブジェクトを受け取る。
 */

function promiseCatchFunc(input) {
  promiseFunc1()
    .then(promiseFunc2)
    .then(promiseFunc3)
    .catch((err) => console.log("err")); // ここにエラーハンドリングを集中することができる(promiseFunc2でも3でエラーが発生するとここの処理が実行される)
}

/**
 * Promiseの非同期処理の並行実行
 */

/**
 * Promise all
 * 引数のPromiseが全て、fulfilledになった時にfulfilledを返し、一つでもRejectになると他のPromiseインスタンスの結果を待たずにRejectになる
 * fulfilledのレスポンスは、解決された値を順番通りに保持する配列を返す
 */

Promise.all([promiseFunc1(), promiseFunc2(), promiseFunc3()]).then((message) =>
  console.log(message)
); // [成功1,成功2,成功3]

/**
 * Promise race
 * 引数のPromiseのどれか一つがsettledになると、他のPromiseインスタンスの結果を待たずにそのPromiseインスタンスと同じ結果になる
 * タイムアウトの実装で、よく使用される
 */

Promise.race([promiseFunc1(), promiseFunc2(), promiseFunc3()]).then((message) =>
  console.log(message)
); // [成功1]

/**
 * Promise allSettled
 * 引数のPromiseが全て、settledになった時にfulfilledになる
 * 戻り値にPromiseの状態結果と値が表示される
 */

Promise.allSettled([promiseFunc1(), promiseFunc2(), promiseFunc3()]).then(
  (message) => console.log(message)
); //  { status: 'fulfilled', value: '成功1' }, { status: 'fulfilled', value: '成功2' }, { status: 'fulfilled', value: '成功3' },
