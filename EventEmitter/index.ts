/**
 * EventEmitter
 *
 * EventEmitterは、Node.jsにおいて独自のイベント駆動プログラミングを実行する際に使用される。
 * 実業務では、直接EventEmitterを使用する機会はないかもしれないが、EventEmitterの仕組みは多くのNode.jsのコアAPIで使用されている。
 */

/**
 * 基本の使い方
 * eventsイベントからEventEmitterインスタンスを作成するか、クラスを継承する必要がある。
 * 基本的な使い方は、イベントを登録し、イベントを発火させることで登録したイベントを実行することができる。
 */

const EventEmitter = require("events");
const emitter = new EventEmitter();

class EmitterClass extends EventEmitter {
  constructor() {
    super();
  }

  addEvent(eventName, callback) {
    this.on(eventName, callback);
  }
}

// イベントの登録を実施
// 関数Version
emitter.on("myEvent", () => {
  console.log("EmitterEvetn発生");
});

// クラスVersion
const emitterClass = new EmitterClass();
emitterClass.addEvent("testEvent", (params) =>
  console.log("testEvent:", params)
);

// イベントの発火（実施）
// 関数Version
emitter.emit("myEvent"); // 実行結果：EmitterEvetn発生

// クラスVersion
emitterClass.emit("testEvent", "クラスVersion");

/**
 * on、emitなどのクラス関数について
 * 一度だけ実行するonceやイベントを削除するoffなどが存在する。
 * 気になる点はググってみよう！
 */

/**
 * 実行タイミングについて
 * EventEmitterによって発生したイベンドは同期的に実行される。
 */

emitter.on("event1", () => {
  console.log("event1");
});

emitter.on("event2", () => {
  console.log("event2");
});

// evetn0,evetn1,evetn2,evetn3の順番で実行される。
console.log("event0");
emitter.emit("event1");
emitter.emit("event2");
console.log("event3");

/**
 * 非同期で実行する方法
 * EventEmitterのイベントが同期的に実行されてしまうので、非同期に実行させるには"process.nextTick()"を使用する必要がある（他にも方法があるかもしれない）
 * process.nextTickについて調べて見てもいいかもしれない
 */

emitter.on("asyncEvent", () => {
  process.nextTick(() => console.log("EventEmitterの非同期処理2"));
});

// EventEmitterの非同期処理1,EventEmitterの非同期処理3,EventEmitterの非同期処理2の順番で実行される。
console.log("EventEmitterの非同期処理1");
emitter.emit("asyncEvent");
console.log("EventEmitterの非同期処理3");

/**
 * EventEmitterののエラーハンドリング
 * EventEmitter"error"という名前のイベントによって、エラーを伝播する規約が存在する。
 * 実行すると「ctach」と表示され、errorイベントのコメントを消すと「error」イベントと表示される。
 */

try {
  const eventError = new EventEmitter();
  //　この状態で実行するとcatchの方の処理は実行されずに、"error"イベントの内容が実行される
  eventError
    .on("error", (err) => console.log("errorイベント", err))
    .emit("error", new Error("エラー"));
} catch (err) {
  console.log("catch");
}

/**
 * 注意事項
 * ある特定のイベントに対して反応させるには、同じEventEmitterインスタンスからemitを実行する必要がある
 * 以下の例だとEventEmitterインスタンスが異なる為、イベントが発火しない
 * また、イベントは11個以上登録するとメモリークが発生する可能性があり、Nodeから警告が表示される。
 * オプションを使用すれば警告は解除できるが、イベント登録してしまうと意図的に削除しなければ常にメモリを使用してしまいGCで削除することができない
 */
const eventEmitter1 = new EventEmitter();
eventEmitter1.on("myEvent", () => {
  console.log("myEvent emitted");
});

const eventEmitter2 = new EventEmitter();
eventEmitter2.emit("myEvent");

/**
 * 使用されている有名なライブライの例
 * http（サーバーを立ち上げる）
 * ストリーム
 */

/**
 * 参考サイト
 *　https://qiita.com/sakamuuy/items/8e91809ddc19a7996e86
 *　https://weseek.co.jp/tech/1359/
 *  https://zenn.dev/xxpiyomaruxx/articles/60747436e47486
 */
