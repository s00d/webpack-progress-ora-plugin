export function mockTtyStream(stream) {
  Object.defineProperty(stream, 'isTTY', {
    configurable: true,
    value: true,
  });

  stream.clearLine = () => true;
  stream.cursorTo = () => true;
  stream.moveCursor = () => true;
}

export function mockNonTtyStream(stream) {
  Object.defineProperty(stream, 'isTTY', {
    configurable: true,
    value: false,
  });
}
