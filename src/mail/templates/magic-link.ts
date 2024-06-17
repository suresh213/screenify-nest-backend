export const magicLinkTemplate = (url: string) => {
  return `<p>Hey!</p> <p>You can login by visiting this link: <a href="${url}">${url}</a>.</p> <p>But hurry, because it will expire in 30 minutes.</p>`;
};
