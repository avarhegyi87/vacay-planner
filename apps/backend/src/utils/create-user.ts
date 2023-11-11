import { Provider } from '@vacay-planner/models';
import { createUserAccount } from './create-user-account';
import User from '../sql/models/user';

export const createUser = async (
  username: string,
  email: string,
  provider: Provider,
  accountid: string
): Promise<User> => {
  try {
    const user = new User({
      username: username,
      email: email,
    });
    await user
      .save()
      .then(
        async user => await createUserAccount(user.id, provider, accountid)
      );
    return user;
  } catch (error: any) {
    console.error(`Error while adding user: ${error}`);
    throw new Error(error);
  }
};
