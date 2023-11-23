import { Provider } from '@vacay-planner/models';
import PostgresAccount from '../models/account';
import PostgresUser from '../models/user';

class UserRepository {
  static async createUser(
    username: string,
    email: string,
    provider: Provider,
    accountid: string
  ): Promise<PostgresUser> {
    try {
      const user = new PostgresUser({
        username: username,
        email: email,
        is_verified: true,
      });
      await user
        .save()
        .then(
          async user =>
            await this.createUserAccount(user.id, provider, accountid)
        );
      return user;
    } catch (error: any) {
      console.error(`Error while adding user: ${error}`);
      throw new Error(error);
    }
  }

  static async createUserAccount(
    userid: number,
    provider: Provider,
    accountid: string
  ): Promise<PostgresAccount> {
    try {
      const account = new PostgresAccount({
        userid: userid,
        provider: provider,
        accountid: accountid,
      });
      await account.save();
      return account;
    } catch (error: any) {
      console.error(error.message);
      throw new Error(error.message);
    }
  }

  static async findUserByProfileId(
    profileid: string,
    email: string,
    provider: Provider
  ): Promise<PostgresUser | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const accountEntry = await PostgresAccount.findOne({
          where: { provider: provider, accountid: profileid },
        });

        const existingUser = accountEntry
          ? await PostgresUser.findByPk(accountEntry.userid)
          : await this.findUserByEmail(email)
              .then(async user => {
                if (user) {
                  await this.createUserAccount(user.id, provider, profileid);
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

  static async findUserByEmail(email: string): Promise<PostgresUser | null> {
    return new Promise(async (resolve, reject) => {
      await PostgresUser.findOne({ where: { email: email } })
        .then(user => {
          if (user instanceof PostgresUser) {
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
}

export default UserRepository;
