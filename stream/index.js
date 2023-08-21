/**
 * ストリーム
 * Nodeにおいて様々なオブジェクト内で、データの流れを扱う際に利用される抽象的なインターフェイス。
 * コンソールに出力、ネットワークに流れるデータ、ファイルの読み書きを行うデータなど、様々な利用用途が存在する。
 * ストリームにおいて入出力データはバファ単位で行い、データ全体をそのままやり取りするのではなく細切れで扱われる
 * またストリームは全てEventEmitterのインスタンスとなっており、状態の変更がイベントによって通知される。
 */

const path = require("path");
const fs = require("fs");

const writeFilePath = path.join(__dirname, "write.txt");
const writeStream = fs.createWriteStream(writeFilePath);

const filePath = path.join(__dirname, "test.txt");
const readStream = fs.createReadStream(filePath, { bufferSize: 2 });
readStream.setEncoding("utf8");

/**
 * 出力ストリーム
 */
writeStream.on("error", (err) => {
  console.log("error", err);
});

writeStream.on("close", () => {
  console.log("writable stream closed");
});

writeStream.on("pipe", () => {
  console.log("resumed writing");
});

/**
 * 入力ストリーム
 * ネットワーク、キーボードのイベント、その他ストレージデバイスからのデータ読み込みを司る
 */
readStream.pipe(writeStream);

readStream.on("data", () => {
  console.log("read data event");
});

readStream.on("end", () => {
  console.log("end");
});

readStream.on("error", (err) => {
  console.log("error", err);
});
