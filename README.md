# TicToe
Mô tả
  - Game chơi caro, với các bàn chơi được fix sẵn (có thể update sau).
  - Bao gồm các tính năng cơ bản. Chủ yếu tập trung vào luồng chơi game trong bàn cờ của player.
  - Bàn chơi chỉ được start khi có đủ 2 người chơi.
  - Các tính năng sẽ được phát triển ở phiên bản tiếp theo.
  
Sử dụng:
  - Express.
  - SocketIO.
  - Mongo, mongoose.
  - mongodb-memory-server.
  - RestfulAPI.
  - Passport.
  - D3js.

> Sử dụng mongodb-memory-server để chạy db trên môi trường dev, không cần cài đặt mongo server

> dữ liệu tạo ra sẽ lưu trên máy local

> để có thể lưu dữ liệu lâu dài, thì bạn sẽ cần phải cài đặt thêm mongo server và sửa lại đường dẫn connection.
  
Chạy project trên local:

```sh
$ git clone https://github.com/dathust/TicToe.git
$ cd TicToe
$ npm install
$ npm start
```

> Bật thêm trình duyệt thứ 2 và chạy npm start để chơi 2 người.