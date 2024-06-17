import { User } from '../../database/schema/user.schema';

export const forgotPasswordTemplate = (user: User, url: string) => {
  return `<p>Hey ${user.name}!</p> <p>You can reset your password by visiting this link: <a href="${url}">${url}</a>.</p> <p>But hurry, because it will expire in 30 minutes.</p>`;
};
