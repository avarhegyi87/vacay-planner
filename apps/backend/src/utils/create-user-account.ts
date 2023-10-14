import { Provider } from '@vacay-planner/models';
import { AccountsTable } from '../config';

export const createUserAccount = async (userid: number, provider: Provider, accountid: string): Promise<AccountsTable> => {
  try {
    const account = new AccountsTable({
      userid: userid,
      provider: provider,
      accountid: accountid,
    });
    await account.save();
    return account;
  } catch (error: any) {
    console.error(`Error while adding account: ${error}`);
    throw new Error(error.message);
  }
}
