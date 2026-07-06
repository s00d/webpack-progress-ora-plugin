export function mockTtyStream(stream: NodeJS.WriteStream): void {
  Object.defineProperty(stream, 'isTTY', {
    configurable: true,
    value: true,
  });

  stream.clearLine = (() => true) as NodeJS.WriteStream['clearLine'];
  stream.cursorTo = (() => true) as NodeJS.WriteStream['cursorTo'];
  stream.moveCursor = (() => true) as NodeJS.WriteStream['moveCursor'];
}

export function restoreStreamIsTTY(
  stream: NodeJS.WriteStream,
  originalIsTTY: boolean | undefined,
): void {
  Object.defineProperty(stream, 'isTTY', {
    configurable: true,
    value: originalIsTTY,
  });
}
