'use strict';

const assert = require('assert');

const WebSocket = require('../index');

describe('WebSocket', () => {
  it('communicates successfully with echo service (ws)', (done) => {
    const ws = new WebSocket('ws://echo.websocket.org/', {
      origin: 'http://www.websocket.org',
      protocolVersion: 13
    });
    const str = Date.now().toString();

    let dataReceived = false;

    ws.on('open', () => ws.send(str));
    ws.on('close', () => {
      assert.ok(dataReceived);
      done();
    });
    ws.on('message', (data) => {
      dataReceived = true;
      assert.strictEqual(data, str);
      ws.close();
    });
  });

  it('communicates successfully with echo service (wss)', (done) => {
    const ws = new WebSocket('wss://echo.websocket.org/', {
      origin: 'https://www.websocket.org',
      protocolVersion: 13
    });
    const str = Date.now().toString();

    let dataReceived = false;

    ws.on('open', () => ws.send(str));
    ws.on('close', () => {
      assert.ok(dataReceived);
      done();
    });
    ws.on('message', (data) => {
      dataReceived = true;
      assert.strictEqual(data, str);
      ws.close();
    });
  });
});
