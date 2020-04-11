"use strict";

const { test, trait } = use("Test/Suite")("User Controller");

const Factory = use("Factory");
const User = use("App/Models/User");

trait("Test/ApiClient");
trait("DatabaseTransactions");

test("a user can register in the system", async ({ client, assert }) => {
  const fakeUser = await Factory.model("App/Models/User").make();
  const userData = {
    username: fakeUser.username,
    email: fakeUser.email,
    password: "jello",
    is_fake: true,
  };

  const response = await client.post("/users").send(userData).end();

  response.assertStatus(201);
  response.assertJSONSubset({
    success: true,
    message: {
      username: userData.username,
      email: userData.email,
    },
  });
});

test("a user can not register with a username that's already taken", async ({
  client,
  assert,
}) => {
  const fakeUser = await Factory.model("App/Models/User").make();
  const userData = {
    username: fakeUser.username,
    email: fakeUser.email,
    password: "jello",
    is_fake: true,
  };

  const user = await User.create(userData);

  const response = await client.post("/users").send(userData).end();
  response.assertError([
    {
      message: "unique validation failed on username",
      field: "username",
      validation: "unique",
    },
  ]);
});

test("a user can not register with an email that's already taken", async ({
  client,
  assert,
}) => {
  const fakeUser = await Factory.model("App/Models/User").make();
  const userData = {
    username: fakeUser.username,
    email: fakeUser.email,
    password: "jello",
    is_fake: true,
  };

  const user = await User.create(userData);
  userData.username = "someOtherUserName";

  const response = await client.post("/users").send(userData).end();
  response.assertError([
    {
      message: "unique validation failed on email",
      field: "email",
      validation: "unique",
    },
  ]);
});

test("a user needs a password to register", async ({ client, assert }) => {
  const fakeUser = await Factory.model("App/Models/User").make();
  const userData = {
    username: fakeUser.username,
    email: fakeUser.email,
    // password: "jello",
    is_fake: true,
  };

  const response = await client.post("/users").send(userData).end();
  response.assertError([
    {
      message: "required validation failed on password",
      field: "password",
      validation: "required",
    },
  ]);
});

test("a user needs an account to login", async ({ client, assert }) => {
  const fakeUser = await Factory.model("App/Models/User").make();
  const userData = {
    username: fakeUser.username,
    email: fakeUser.email,
    // password: "jello",
    is_fake: true,
  };

  const response = await client.post("/login").send(userData).end();
  response.assertError([
    {
      message: "Cannot find user with provided email",
      field: "email",
    },
  ]);
});
