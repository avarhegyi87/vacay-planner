import { Provider } from '@vacay-planner/models';
import { UsersTable } from '../config';
import { createUserAccount } from './create-user-account';

export const createUser = async (
  username: string,
  email: string,
  provider: Provider,
  accountid: string
): Promise<UsersTable> => {
  try {
    const user = new UsersTable({
      username: username,
      email: email,
      created_at: new Date(),
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
