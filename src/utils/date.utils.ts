export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function parseExpiresTime(expiresInDuration: string) {
  const currentTimeInSeconds = Math.floor(Date.now() / 1000);
  const expiresInSeconds = (() => {
    const matches = expiresInDuration.match(/^(\d+)([smhd])$/);
    if (!matches) return null;

    const value = parseInt(matches[1]);
    const unit = matches[2];

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 24 * 60 * 60;
      default:
        return null;
    }
  })();

  if (expiresInSeconds === null) {
    throw new Error('fail to parse expiresIn');
  } else {
    const expirationTimeInSeconds = currentTimeInSeconds + expiresInSeconds;
    return {
      currentTimeInSeconds,
      expirationTimeInSeconds,
    };
  }
}
