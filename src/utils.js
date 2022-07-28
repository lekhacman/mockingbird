export function defer(ctx, response, timeout) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      ctx.body = response;
      resolve(ctx);
    }, timeout || 1000);
  });
}
