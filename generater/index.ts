/**
 * ジェネレーター === イテレーター
 * ジェネレターはジェネレータ関数から返されるオブジェクトです。
 * 処理の途中で停止したり再開したりすることができるので、非同期処理を同期処理のように扱うことができる。
 */

// ジェネレたー関数の作成の仕方 functionの後ろに*をつける
function* generaterFunc() {
  console.log("ジェネレーター処理の開始");
  console.log("yield1");
  yield 1; // 1を返す 関数処理を止めたり再開できる
  console.log("yield2");
  yield 2; // 2を返す 関数処理を止めたり再開できる
  console.log("yield3");
  yield 3; // 3を返す 関数処理を止めたり再開できる
}

const generator = generaterFunc();
// valueはyieldの値
console.log(generator.next()); // { value: 1, done: false }
console.log(generator.next()); // { value: 2, done: false }
console.log(generator.next(100)); // { value: 3, done: false }
console.log(generator.next()); // { value: undefined, done: true }

// nextに引数も割り当てることができる(使い道は不明)
console.log(generator.next(100));

// throwを使用することで、直前に実行されたyieldの部分でエラーが投げられます。
// console.log(generator.throw(new Error("エラー発生")));

// generatorを使用した非同期処理
function generatorAsyncJson(json) {
  return new Promise((resoleve, reject) => {
    setTimeout(() => {
      try {
        resoleve(JSON.parse(json));
      } catch (err) {
        reject(err);
      }
    }, 1000);
  });
}

// yieldののところでPromiseの処理を呼び出していることで、処理が一時停止し同期処理のような書き方を行うことができる
function* asyncWithGeneratorFunc(json) {
  try {
    // 非同期の実行
    const result = yield generatorAsyncJson(json);
    console.log("バース結果", result);
  } catch (err) {
    console.log("エラーをキャッチ..", err);
  }
}

const asyncWithGenertor1 = asyncWithGeneratorFunc('{ "foo": 1 }');
console.log("処理結果の確認", asyncWithGenertor1);
const promise1 = asyncWithGenertor1.next().value;
console.log("処理結果の確認", promise1);

/**
 * async/await
 * ES20172017で登場。直感的に非同期プログラミングを行うことができる
 * asyncキーワードが付いた関数は、必ずPromiseインスタンスを返す。
 * また、エラーが発生した際は、rejectedなPromiseインスタンスを返します。
 * awaitしている、処理を一時停止しているが、スレッドの処理を止めるのではなく、async関数の外の処理は動作を続ける
 */

// *がasyncに変わった。
async function asyncFunc(input) {
  try {
    //　yieldがawaitに変わった。
    const result = await generatorAsyncJson(input);
    console.log("逐次実行バース結果", result);
  } catch (err) {
    console.log("エラーをキャッチ..", err);
  }
}

asyncFunc('{"foo":1}');

// 並行時実行する場合は、Promise.allを使用する必要がある
async function asyncAllFunc(input) {
  try {
    //　yieldがawaitに変わった。
    const result = await Promise.all([
      generatorAsyncJson(input),
      generatorAsyncJson(input),
      generatorAsyncJson(input),
    ]);
    console.log("並行実行バース結果", result);
  } catch (err) {
    console.log("エラーをキャッチ..", err);
  }
}

asyncAllFunc('{"foo":1}');

/**
 * トップレベルawait
 * 使う機会はあまりないかもしれないが、ファイルのトップ階層にawaitが存在する場合
 * その処理が終了するまで、そのモジュールのロードが停止する。
 * これは、CommonJSでは使用できない。
 * モジュールの初期化処理の中で使う機会があるかもしれない。
 */

// const input = '{"foo":1}';
// await generatorAsyncJson(input);

/**
 * asyncの反復処理を行いたい場合は、for await..ofを使用することで反復処理を行うことができる
 * 反復で実行する必要がなければ、並行処理の方がいい
 * streamとの相性がいいかもしれない
 */

async function* asyncForAwaitOf() {
  let i = 0;
  while (i <= 3) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    yield i++;
  }
}

for await (const element of asyncForAwaitOf()) {
  console.log("反復処理結果", element);
}

export {};
