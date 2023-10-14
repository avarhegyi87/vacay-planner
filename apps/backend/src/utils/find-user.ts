import { Provider } from '@vacay-planner/models';
import { AccountsTable, UsersTable } from '../config';
import { createUserAccount } from './create-user-account';

export async function findUserByProfileId(
  profileid: string,
  email: string,
  provider: Provider
): Promise<UsersTable> {
  return new Promise(async (resolve, reject) => {
    try {
      const accountEntry = await AccountsTable.findOne({
        where: { provider: provider, accountid: profileid },
      });

      const existingUser = accountEntry
        ? await UsersTable.findByPk(accountEntry.userid)
        : await findUserByEmail(email).then(async user => {
            await createUserAccount(user.id, provider, profileid);
            return user;
          });
      if (existingUser) return resolve(existingUser);
    } catch (error) {
      console.error(`Error while finding user: ${error}`);
      return reject(error);
    }
  });
}

export async function findUserByEmail(email: string): Promise<UsersTable> {
  return new Promise(async (resolve, reject) => {
    await UsersTable.findOne({ where: { email: email } })
      .then(user => {
        if (user instanceof UsersTable) return resolve(user);
        else throw new Error('User not found');
      })
      .catch(error => {
        return reject(error);
      });
  });
}
