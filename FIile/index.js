const fs = require("fs");

// ファイルへの書き込み
fs.writeFile("text.txt", "some data!!!!!", "utf-8", (err) => {
  if (err) throw err;
  // ファイルの読み込み（writeFile終了後確実に読み込みが行われる）
  fs.readFile("text.txt", "utf-8", (err, data) => {
    if (err) throw err;
    console.log(data);
  });
});

const rs = fs.createReadStream("text.txt", {
  encoding: "utf-8",
  bufferSize: 1,
});

rs.on("data", (chunk) => {
  console.log("読み込み開始", chunk);
});

rs.on("end", () => {
  console.log("read file end");
});

// const stdin = process.stdin;
// const file = process.argv[2];
const output = fs.createWriteStream("wrriteFile.txt");

// ファイルを何度もオープンして書き込んだり読み込んだりすることは不適切。その場合ファイル記述子を利用する
// ファイルの読み込みの種類は多数存在するので、以下のサイトを参考にする
// https://blog.katsubemakito.net/nodejs/file-read
fs.open("text.txt", "r+", (err, fd) => {
  if (err) throw err;

  const buffSize = Buffer.alloc(16);

  fs.read(fd, buffSize, 0, 3, 0, (err, bytesRead, buffer) => {
    if (err) throw err;
    console.log(buffer.toString("utf8", 0, 3));

    // ファイルを閉じる
    fs.close(fd, (err) => {
      if (err) throw err;
    });
  });
});

// nodeを使用したファイルやディrレクトりの操作
fs.rename("text.txt", "wrriteFile.txt", () => {
  console.log("ファイルの移動完了");
});

fs.mkdir("test", () => {
  console.log("ディレクトリの作成");
});

fs.rmdir("test", () => {
  console.log("ディrレクトリの削除");
});

fs.readdir(".", (err, files) => {
  console.log(files);
});
