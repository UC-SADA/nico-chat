"use strict";
const path = require('path');
const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const extend = require('util')._extend

http.listen(process.env.PORT || 2525, function(){
  console.log("PORT : " + process.env.PORT || 2525);
});


var getIP = function (req) {
  if (req.headers['x-forwarded-for']) {
    return req.headers['x-forwarded-for'];
  }
  if (req.connection && req.connection.remoteAddress) {
    return req.connection.remoteAddress;
  }
  if (req.connection.socket && req.connection.socket.remoteAddress) {
    return req.connection.socket.remoteAddress;
  }
  if (req.socket && req.socket.remoteAddress) {
    return req.socket.remoteAddress;
  }
  return '0.0.0.0';
};


require('date-utils') //現在時刻の取得に必要
//LOG用の変数
var good = 0
var bad =0
var warai =0
var question =0
var setsubun =0

//入力側画面指定
app.use("/controller",express.static(path.join(__dirname, 'public')))

//出力側画面指定
app.get("/display", function(req, res){
  res.sendFile(__dirname + '/index_nico-Display.html');
});
//出力側画面指定 チャット画面
app.get("/chat", function(req, res){
  res.sendFile(__dirname + '/index_chat.html');
});
//出力側画面指定　グラフ画面
app.get("/chart", function(req, res){
  res.sendFile(__dirname + '/index_chart.html');
});


//require('console-stamp')(console, '[HH:MM:ss.l]')

app.get('/comment', function (req, res) {
  const msg = extend({}, req.query)
//  var dt = new Date()
  console.log("/IP:" + getIP(req) +'/comment: ' + JSON.stringify(msg))
  if (msg.body == "Counter_Reset")
    {
      good = 0;
      bad = 0;
      warai =0;
      setsubun = 0;
      question = 0;
    }
    else {
      io.emit('comment', msg);
      io.emit('chat', msg.body);
    }
      res.end()
})

app.get('/like', function (req, res) {
  const msg = extend({}, req.query);
  var dt = new Date()
  console.log("/IP:" + getIP(req) +'/like: ' + JSON.stringify(msg))
  switch ( JSON.stringify(msg) )
{
    case '{"image":"Good"}' : good++;
     console.log(dt + "/IP:" + getIP(req) +"/Good : " + good);
     break;
    case '{"image":"Bad"}' : bad++;
     console.log(dt + "/IP:" + getIP(req) +"/Bad : " + bad);
     break;
    case '{"image":"Warai"}' : warai++;
     console.log(dt + "/IP:" + getIP(req) +"/Warai : " + warai);
     break;
    case '{"image":"Setsubun"}' : setsubun++;
     console.log(dt + "/IP:" + getIP(req) +"/Setsubun : " + setsubun);
     break;
    case '{"image":"Question"}' : question++;
     console.log(dt + "/IP:" + getIP(req) +"/Question : " + question);
     break;
    case '{"image":"Reset"}' : good=bad=warai=setsubun=question=0;
     break;
    default:
     console.log("etc")
     break;
}
  var stamp_cnt = [[good],[bad],[warai],[setsubun]]
  io.emit('like', msg)
  io.emit('chart', stamp_cnt)
  console.log(stamp_cnt)
  res.end()
})
