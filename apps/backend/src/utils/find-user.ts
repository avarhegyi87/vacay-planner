import { Provider } from '@vacay-planner/models';
import { createUserAccount } from './create-user-account';
import User from '../sql/models/user';
import Account from '../sql/models/account';

export async function findUserByProfileId(
  profileid: string,
  email: string,
  provider: Provider
): Promise<User | null> {
  return new Promise(async (resolve, reject) => {
    try {
      const accountEntry = await Account.findOne({
        where: { provider: provider, accountid: profileid },
      });

      const existingUser = accountEntry
        ? await User.findByPk(accountEntry.userid)
        : await findUserByEmail(email)
            .then(async user => {
              if (user) {
                await createUserAccount(user.id, provider, profileid);
                return user;
              } else {
                return null;
              }
            })
            .catch(error => {
              throw new Error(error);
            });
      return resolve(existingUser);
    } catch (error) {
      return reject(error);
    }
  });
}

export async function findUserByEmail(email: string): Promise<User | null> {
  return new Promise(async (resolve, reject) => {
    await User.findOne({ where: { email: email } })
      .then(user => {
        if (user instanceof User) {
          return resolve(user);
        } else {
          return resolve(null);
        }
      })
      .catch(error => {
        return reject(error);
      });
  });
}
