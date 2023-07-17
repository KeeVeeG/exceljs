const {SaxesParser} = require('saxes');
const {PassThrough} = require('readable-stream');
const {bufferToString} = require('./browser-buffer-decode');

module.exports = async function* (iterable) {
  // TODO: Remove once node v8 is deprecated
  // Detect and upgrade old streams
  if (iterable.pipe && !iterable[Symbol.asyncIterator]) {
    iterable = iterable.pipe(new PassThrough());
  }
  const saxesParser = new SaxesParser();
  let error;
  saxesParser.on('error', err => {
    error = err;
  });
  let events = [];
  let contents = [];
  saxesParser.on('opentag', value => events.push({eventType: 'opentag', value}));
  saxesParser.on('text', value => events.push({eventType: 'text', value}));
  saxesParser.on('closetag', value => events.push({eventType: 'closetag', value}));
  for await (const chunk of iterable) {
    // chunks of stream can break a character,
    // which causes a replacement character to appear on start and end of two chunks
    let string;
    if (Buffer.isBuffer(chunk)) {
      contents.push(chunk);
      string = bufferToString(Buffer.concat(contents));
      if (string.at(-1) === '�') continue;
    } else {
      string = bufferToString(chunk);
    }

    saxesParser.write(string);
    // saxesParser.write and saxesParser.on() are synchronous,
    // so we can only reach the below line once all events have been emitted
    if (error) throw error;
    // As a performance optimization, we gather all events instead of passing
    // them one by one, which would cause each event to go through the event queue
    yield events;
    events = [];
    contents = [];
  }
};
