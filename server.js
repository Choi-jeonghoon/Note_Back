const express = require("express");
const app = express();
const port = 3000; // 또는 원하는 포트 번호

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

///TEST
// 라우트 설정
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
