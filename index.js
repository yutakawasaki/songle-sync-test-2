
var express = require('express');
var SW = require('songle-widget');

// プレイヤー初期化
var tokens = {
      accessToken: '00000002-HHfe2jh' // アクセストークン
    , secretToken: 'ZHX9LpU6wr424kWmzVCe2kQuR9iL5KEW' // シークレットトークン

};

var player = new SW.Player(tokens);
player.useMedia(
  new SW.Media.Headless("https://www.youtube.com/watch?v=AS4q9yaWJkI")
);

// 再生開始
player.play();

// コンソールに時刻表示
setInterval(function () {
  console.log('server time:', player.position);
}, 100);

// 無限ループ
player.on('finish', function () {
  setTimeout(function () {
    player.seekTo(0);
    setTimeout(function () {
      player.play();
    }, 300);
  }, 300);
});

// HTTPサーバ
var app = express();
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));

app.get('/play', function (req, res) {
  player.play();
  res.json({ "message": "start playing" });
});

app.get('/pause', function (req, res) {
  player.pause();
  res.json({ "message": "pause playing" });
});

app.get('/', function (req, res) {
  res.render('index', tokens);
});

app.get('/json', function (req, res) {
  res.json({ "accessToken": tokens.accessToken });
});

app.listen(process.env.PORT || 8080);
