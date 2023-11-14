import { Provider } from '@vacay-planner/models';
import Account from '../models/account';
import User from '../models/user';

class UserRepository {
  static async createUser(
    username: string,
    email: string,
    provider: Provider,
    accountid: string
  ): Promise<User> {
    try {
      const user = new User({
        username: username,
        email: email,
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
  ): Promise<Account> {
    try {
      const account = new Account({
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
  ): Promise<User | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const accountEntry = await Account.findOne({
          where: { provider: provider, accountid: profileid },
        });

        const existingUser = accountEntry
          ? await User.findByPk(accountEntry.userid)
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

  static async findUserByEmail(email: string): Promise<User | null> {
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
}

export default UserRepository;
