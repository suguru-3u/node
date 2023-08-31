/**
 * EventEmitter
 * 1回の要求に対して、結果が複数回発生するような非同期処理の実装
 */

const EventEmitter = require("events");
const eventEmitter = new EventEmitter();

// イベントの登録＆処理
eventEmitter.on("event", () => {
  console.log("B");
});

// イベントの発火
console.log("A");
eventEmitter.emit("event");
console.log("C");

eventEmitter.on("box", () => {
  console.log("listener1");
  console.log("Sum of this listener is " + eventEmitter.listenerCount("box"));
});

const listenerMessage1 = () => console.log("This is listener1");
const listenerMessage2 = () => console.log("This is listener2");

eventEmitter.on("addItem1", () => {
  console.log("add listener");
  eventEmitter.addListener("box", listenerMessage1);
});

eventEmitter.on("addItem2", () => {
  console.log("add listener");
  eventEmitter.addListener("box", listenerMessage2);
});

eventEmitter.on("removeItem", () => {
  console.log("remove listener");
  eventEmitter.removeListener("box", listenerMessage1);
});

eventEmitter.emit("addItem1");
eventEmitter.emit("addItem2");
eventEmitter.emit("removeItem");
eventEmitter.emit("box");
