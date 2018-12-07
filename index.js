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
var excelent =0
var question =0
var setsubun =0

//入力側画面指定
app.use("/controller",express.static(path.join(__dirname, 'public')))

//出力側画面指定
app.get("/display", function(req, res){
  res.sendFile(__dirname + '/index_nico-Display.html');
});
//出力側画面指定
app.get("/chat", function(req, res){
  res.sendFile(__dirname + '/index_chat.html');
});


//require('console-stamp')(console, '[HH:MM:ss.l]')

app.get('/comment', function (req, res) {
  const msg = extend({}, req.query)
//  var dt = new Date()
  console.log("/IP:" + getIP(req) +'/comment: ' + JSON.stringify(msg))
  if (msg.body == "SADASADA_counter_reset")
    {
      good = 0;
      bad = 0;
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
  if ( JSON.stringify(msg).match(/Good/) )
{
    good++;
    console.log("/IP:" + getIP(req) +"/Good : " + good);
}
else
{
    if ( JSON.stringify(msg).match(/Bad/) )
    {
        bad++;
        console.log("/IP:" + getIP(req) +"/Bad : " + bad);
    }
    else
{
  if ( JSON.stringify(msg).match(/Excellent/) )
  {
      excellent++;
      console.log("/IP:" + getIP(req) +"/Excellent : " + excellent);
  }
  else
{
  if ( JSON.stringify(msg).match(/Question/) )
  {
      question++;
      console.log("/IP:" + getIP(req) +"/Question : " + question);
  }
  else
{
      setsubun++;
      console.log("/IP:" + getIP(req) +"/Setsubun : " + setsubun);
  }

}
}
}
  io.emit('like', msg)
  res.end()
})
