const size = 16;
// 16バイトの空き容量の確保
const buf = Buffer.alloc(size);
const arr = [1, 2, 3, 4, 5];

// バッファの生成
const arrayBuf = Buffer.from(arr);
const str = "sample";
const strBuf = Buffer.from(str);

console.log(buf);
console.log(arrayBuf);

// エンコーディング
console.log(arrayBuf.toString("base64"));
console.log(str);
