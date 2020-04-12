"use strict";

const Service = use("App/Services");

const Account = use("App/Models/Account");
const Subscription = use("App/Models/Subscription");
const User = use("App/Models/User");

/**
 * !!! CAUTION !!!
 * Contains methods for deleting large amounts
 * of data in the database. Proceed with caution.
 */
class DataIncinerator extends Service {
  static async deleteFakeUsersAndTheirAccounts() {
    console.log("=== DELETING FAKE USERS AND THEIR ACCOUNTS ===");

    const results = await User.query().where("is_fake", true).fetch();
    const fakeUsers = results.rows;

    fakeUsers.forEach(async (user) => {
      const acct = await user.account().fetch();
      const acctId = acct.id; // Copying this in case account is deleted before subscriptions are done being deleted

      await Promise.all([
        Subscription.query().where("account_id", acctId).delete(),
        acct.delete(),
        user.delete(),
      ]).catch((err) => {
        console.log(err);
      });
    });
  }
}

module.exports = DataIncinerator;
