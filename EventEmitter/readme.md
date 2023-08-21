# Node.js の EventEmitter について

node.js の学習を進めていく中で、EventEmitter とゆう言葉があることを知った。
EventEmitter についてよく知らずにいたので、学習しメモを残す。

## EventEmitter

EventEmitter とは、node.js でイベントを登録し、実行するもののことを言う。
そもそも node.js はイベント駆動型のプログラミングであり、JS の画面側でのイベントからプログラムが発火するように
node もバックエンドでのイベントからブログラムが発火するようにできている。
EventEmitter は、そのイベント発火するように発火する際に自分の任意なプログラムが実行されるように登録できる仕組み

### EventEmitter の使い方

```js
// EventEmitterのライブラリを読み込み、インスタンスを作成する
const EventEmitter = require("events");
const eventEmitter = new EventEmitter();

// onまたはaddEventListerでイベントの登録を行う
eventEmitter.on("event", () => {
  console.log("B");
});

// emitでイベントの発火を行う（emitするまで実行されない）
console.log("A");
eventEmitter.emit("event");
console.log("C");
```

```bash
nodeの実行
A
B
C
```

### まとめ

EventEmitter は、イベントを登録するためのクラス。
実行する時には emit が必要で、emit が実行されるまでは、登録したイベントは実行されない。
EventEmitter に登録できる数や一度しか実行されないようにイベントを登録することもできる

### 参考 URL

https://www.whizz-tech.co.jp/1659/#EventEmitterremoveListener
https://weseek.co.jp/tech/1359/
https://zenn.dev/xxpiyomaruxx/articles/60747436e47486
