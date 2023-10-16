import { Provider } from '@vacay-planner/models';
import Account from '../sql/models/account';

export const createUserAccount = async (
  userid: number,
  provider: Provider,
  accountid: string
): Promise<Account> => {
  try {
    const account = new Account({
      userid: userid,
      provider: provider,
      accountid: accountid,
    });
    await account.save();
    return account;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
