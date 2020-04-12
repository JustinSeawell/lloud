"use strict";

const { test, trait, before, after } = use("Test/Suite")("User Registration");

const Factory = use("Factory");
const Mail = use("Mail");

const User = use("App/Models/User");
const Account = use("App/Models/Account");
const Subscription = use("App/Models/Subscription");
const UserRegistration = use("App/Services/UserRegistration");

trait("DatabaseTransactions");

before(async () => {
  Mail.fake();
});

after(async () => {
  Mail.restore();
});

test("registering a listener user returns a user model instance", async ({
  assert,
}) => {
  const fakeUser = await Factory.model("App/Models/User").make();
  const userData = {
    username: fakeUser.username,
    email: fakeUser.email,
    password: "jello",
    is_fake: true,
  };

  const user = await UserRegistration.registerListenerDefaultAccount(userData);
  assert.equal(user.constructor.name, "User");
});

test("a listener cannot register with no data", async ({ assert }) => {
  assert.plan(1);

  try {
    await UserRegistration.registerListenerDefaultAccount({});
  } catch ({ message }) {
    assert.equal(message, "Listener user default registration failed");
  }
});

test("a listener user has a listener account", async ({ assert }) => {
  const fakeUser = await Factory.model("App/Models/User").make();
  const userData = {
    username: fakeUser.username,
    email: fakeUser.email,
    password: "jello",
    is_fake: true,
  };

  const user = await UserRegistration.registerListenerDefaultAccount(userData);
  const account = await user.account().fetch();
  assert.equal(account.constructor.name, "Account");
  assert.equal(account.account_type_id, 2);
});

test("a listener user starts with a month-free subscription", async ({
  assert,
}) => {
  const fakeUser = await Factory.model("App/Models/User").make();
  const userData = {
    username: fakeUser.username,
    email: fakeUser.email,
    password: "jello",
    is_fake: true,
  };

  const user = await UserRegistration.registerListenerDefaultAccount(userData);
  const account = await user.account().fetch();
  const sub = await account.activeSubscription().fetch();
  assert.equal(sub.plan_id, 2);
});
