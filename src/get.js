/*
 * Minimal, binary safe HTTP(s) get request.
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 jorrit.duin@gmail.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * EXAMPLE:
 *
 * var get = require('./get.js');
 *
 * get('https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
 *   function(err,res){
 *    console.log(res.statusCode);
 *    console.log(res.headers);
 *    var data = res.body.toString('base64');
 *    console.log(data);
 *  }
 * );
 *
 */
var url = require('url');
var http = require('http');
var https = require('https');
var Stream = require('stream').Transform;

var startHttpGet = function(uri,cb){
  'use strict';
  var options = url.parse(uri);
  var response = {};
  if(!options.port && options.protocol === 'http:'){
    options.port = 80;
  }else if(!options.port && options.protocol === 'https:'){
    options.port = 443;
  }
  options.method = 'GET';
  var _http;
  if(options.protocol === 'https:'){
    _http = https;
    // Added both certificate 'IGNORE' checks
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    options.rejectUnhauthorized = false;
  }else{
    _http = http;
  }
  var req = _http.request(options, function createHttpRequest(res) {
    var data = new Stream();
    response.statusCode = res.statusCode;
    response.headers = res.headers;
    res.on('data', function (chunk) {
      data.push(chunk);
    });
    res.on('end', function (x) {
      response.body = data.read();
      cb(null, response);
    });
    req.on('error', function catchError(e) {
      cb(e, null);
    });
  });
  req.end();
};
var get = function(url,cb){
  startHttpGet(url,cb);
};
module.exports = get;
