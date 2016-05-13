#!/usr/bin/env node
var spawn = require('child_process').spawn
var Transform = require('stream').Transform
var networkInterfaces = require('os').networkInterfaces

var ifaces = networkInterfaces()
var ip

Object.keys(ifaces).filter(function(ifname) {
    if (/eth/.test(ifname)) {
      return true
    }
    return false
  }).forEach(function (ifname) {
  var alias = 0
  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      return
    }
    if (alias >= 1) {
      ip = iface.address
    } else {
      ip = iface.address
    }
    ++alias
  })
})

var nodeDebug = spawn('node_modules/.bin/babel-node-debug', process.argv.slice(2), {
  stdio: [0, 'pipe', 2]
})

var transform = new Transform({
  transform: function(chunk, encoding, next) {
    this.push(chunk
      .toString()
      .replace('http://127.0.0.1:8080/', 'http://' + ip + ':8080/'))
    next()
  }
})

nodeDebug.stdout.pipe(transform).pipe(process.stdout)