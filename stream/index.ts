/**
 * Stream
 *
 * Streamとは、データを小さな単位に分け、読み込み毎にイベントをが発行されるもの。
 * 特徴としてデータを分割して処理を実行するので、容量が大きいファイル処理やデータ量が大きいデータに使用されるそう。
 *
 * よくStreamを使う場合と使わない場合で比較をされるが、こちらのサイトがわかりやすく解説している。
 * https://tech-blog.lakeel.com/n/n62073e6f3101
 *
 * また、よく使用されるfs、http、axisoなどもStreamを使用する仕組みが用意されており、ざまざま場面で使用することができそう。
 *
 */

// データの読み取り用の例
import {
  createReadStream,
  ReadStream,
  createWriteStream,
  WriteStream,
} from "fs";
import { Transform, pipeline } from "stream";

const readableNonFlowing: ReadStream = createReadStream("./hello.txt", "utf8");
readableNonFlowing.on("readable", () => {
  while (readableNonFlowing.read(50) !== null) {
    console.log(readableNonFlowing.read(50));
  }
});

const readableFlowing: ReadStream = createReadStream("./hello.txt", "utf8");
const writable: WriteStream = createWriteStream("./sample.txt", "utf8");
readableFlowing.on("data", (data: Buffer) => {
  console.log(data.toString());

  // データの書き込み例
  writable.write(data);
});

/**
 * pipe() / pipeline()
 * 上記にstremの基本的な例を記載しているが、上記のように読み取りと書き込みを手動で記述するのは一般的ではないもよう
 * pipe() / pipeline() メソッドでは、設定された highWaterMark にもとづいたバックプレッシャーを自動的に行ってくる。
 * さらに記述量も大幅に削減することができる。
 */

// pile()の場合
readableFlowing.pipe(writable);

// process.stdoutも同様にStreamとなっている（ファイルの標準出力）
readableFlowing.pipe(process.stdout);

// pipeline() を利用する場合
// pipeline(process.stdin, writable, (err: any) => {});

/**
 *  Streamの種類
 *
 *  Streamには四つの抽象クラスが用意されている。
 * ・Readable: データの読み取り用
 * ・Writable: データの書き込み用（コンシューマー）
 * ・Duplex: Readable かつ Writable な Stream
 * ・Transform: 読み取り、書き込み時にデータ変更可能な二重 Stream
 */

// Readable（このファイルを指定した後にdataイベントをリスナーに登録している）
const src = createReadStream(__filename, "utf8");
src.on("data", (chunk) => process.stdout.write(chunk)); // console.logと同じようにターミナルに標準出力する

// また、Readable Stream は AsyncIterable でもあるので、for await...of構文を使ってデータを取り出すこともできる。
async function streamFunction() {
  console.log("for await...ofの処理開始");
  for await (const chunk of src) {
    console.log(chunk);
  }
  console.log("for await...ofの処理終了");
}

streamFunction();

// 複雑な読み取りクラスを作成するには、以下のようにReadableを継承したクラスを作成する必要がある。
class ReadableStream extends Readable {
  constructor() {
    super();
  }

  // 引数のサイズは、読み込み時のバックプレッシャーを指定している。(無視してもいい)
  // 必ず_readメソッドを作成する必要がある。このメソッドで読み取り時の処理を行なっている
  _read(size: number): void {
    // this.push() pushメソッドで、このストリームからデータを流す。
  }
}

/**
 * バックプレッシャー,highWaterMark
 * Stream は、その内部にバッファとしてデータを保持する。
 * そして各 Stream は、バッファにどの程度のデータまで保持するのかを示す、highWaterMark という名前の閾値を持っている。
 * この閾値を過度に超えないように上手く制御することで、「データを少しずつ処理する」ことが可能になる。
 */

const readableMark: ReadStream = createReadStream("./hello.txt", {
  highWaterMark: 16,
}); // highWaterMarkのデフォルト値は64KB
const writableMark: WriteStream = createWriteStream("./sample.txt");

readableMark.on("readable", () => {
  let data: Buffer;

  // highWaterMark 64byte の Writable Stream に、1KBのデータを書き込む
  while ((data = readableMark.read(1024)) !== null) {
    writableMark.write(data);
  }
});

// Writable（sampleファイルへの書き込みを行う）
const src2 = createReadStream(__filename, "utf8");
const desc2 = createWriteStream("sample.txt");

src2.on("data", (chunk) => {
  desc2.write(chunk);
});
desc2.on("finish", () => console.log("書き込み処理が終了"));

// 複雑な書き込みクラスを作成するには、以下のようにWriteStreamを継承したクラスを作成する必要がある。
class WriteStreamStream extends WriteStream {
  constructor() {
    super();
  }

  // 必ず_Writeメソッドを作成する必要がある。このメソッドで書き込み時の処理を行なっている
  // chunkがデータを表す
  _write(
    chunk: any,
    encoding: BufferEncoding,
    callback: (error?: Error | null | undefined) => void
  ): void {
    // callback(); 書き込みの最後に必ずcallbackを呼び出す
  }
  // this.push() pushメソッドで、このストリームからデータを流す。
}

// Duplex（参考になるサイトが見当たらなかった）

// Transform
// TransformクラスはReadableストリームであると同時にWritableストリームでもある。
// つまり、ストリームパイプの途中に入って、上流から流れてきたデータを加工して、下流に流すことができる。
import { TransformCallback, Readable } from "stream";

const tranform = new Transform({
  transform(
    chunk: string | Buffer,
    encoding: string,
    done: TransformCallback
  ): void {
    this.push(chunk); // データを下流のパイプに渡す処理
    done(); // 変形処理終了を伝えるために呼び出す
  },
});

// 流れてきたデータを大文字に変換するTransForm
const toUpperTransFrom = new Transform({
  transform(
    chunk: string | Buffer,
    encoding: string,
    done: TransformCallback
  ): void {
    this.push(chunk.toString().toUpperCase());
    done();
  },
});

const readStream = Readable.from(["a", "b", "c"]); // fromは[]をStreamに変換する
readStream.pipe(toUpperTransFrom).pipe(process.stdout);

// 複雑な読み込み、書き込みクラスを作成するには、以下のようにTransformを継承したクラスを作成する必要がある。
class TransformStream extends Transform {
  constructor(options) {
    // objectMode: true で chunkをObjectで受け取る。
    // この設定しないとchunkはstring or Buffer型を期待するため、TYPE_ERRORで例外を投げる。
    super({ ...options, objectMode: true });
  }

  // 必ず_transformメソッドを作成する必要がある。
  // chunkがデータを表す
  _transform(
    chunk: any,
    encoding: BufferEncoding,
    callback: TransformCallback
  ): void {
    // this.push() pushメソッドで、このストリームからデータを流す。
    callback();
  }

  // 上流からデータを流し終えると実行されるメソッド（普段使用しないかも）
  _flush(callback: TransformCallback): void {}
}

/**
 * pipeのエラーハンドリング
 * pipeを使用してのエラーハンドリングは、errorイベントを登録することでハンドリングすることができるが、1pipeにつき1つerrorイベントを登録する必要がある。
 * これでは、可動性が悪くなってしまうし、プログラムを開発する側でも開発しづらい。
 * そこでpipelineを使用することでこのエラーハンドリングが簡単に行うことができる。
 * 基本的に複数のpipeを使用する場合は、pipelineを使用することで記述量を減らすことができる。
 */

// pipeのエラーイベントのハンドリング例
readStream
  .pipe(toUpperTransFrom)
  .on("error", (err) => console.log("errイベント発生", err))
  .pipe(process.stdout)
  .on("error", (err) => console.log("errイベント発生", err));

// pipelineエラーハンドリング例
pipeline(readStream, toUpperTransFrom, process.stdout, (err) => {
  console.log("errイベントの発生", err);
});

/**
 * pipelineなどのイベント発火の種類について、readableやfinishについては、参考サイトを参照すること
 */

/**
 * 参考サイト
 * https://tech-blog.lakeel.com/n/n62073e6f3101
 * https://qiita.com/masakura/items/5683e8e3e655bfda6756
 * https://numb86-tech.hatenablog.com/entry/2022/07/09/144422
 * https://ponzmild.hatenablog.com/entry/2019/12/30/012435
// https://ushumpei.hatenablog.com/entry/2020/05/27/011731
*/
