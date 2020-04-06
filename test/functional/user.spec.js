"use strict";

const { test, trait, before } = use("Test/Suite")("User");
const User = use("App/Models/User");

trait("Test/ApiClient");
trait("DatabaseTransactions"); // Rolls back DB after each test

before(async () => {});

// Login
test("a failed login response has status 401", async ({ client }) => {
  const response = await client
    .post("/login")
    .send({
      email: "lloud_user_does_NotExist@gmail.com",
      password: "not_a_real_password",
    })
    .end();

  response.assertStatus(401);
});

test("a successful login response has status 200", async ({ client }) => {
  const fakeEmail = "testguy@gmail.com";
  const fakePW = "test";

  const testUser = await User.findOrCreate(
    { email: fakeEmail },
    {
      email: fakeEmail,
      password: fakePW,
    }
  );

  const response = await client
    .post("/login")
    .send({
      email: fakeEmail,
      password: fakePW,
    })
    .end();

  response.assertStatus(200);
});

test("a successful login response returns a valid token", async ({
  client,
  assert,
}) => {
  const fakeEmail = "testguy@gmail.com";
  const fakePW = "test";

  const testUser = await User.findOrCreate(
    { email: fakeEmail },
    {
      email: fakeEmail,
      password: fakePW,
    }
  );

  const response = await client
    .post("/login")
    .send({
      email: fakeEmail,
      password: fakePW,
    })
    .end();

  assert.property(response.body, "type");
  assert.property(response.body, "token");
  assert.property(response.body, "refreshToken");

  const token = response.body.token;

  const response2 = await client
    .get("/me")
    .header("accept", "application/json")
    .header("Authorization", `Bearer ${token}`)
    .end();

  response2.assertStatus(200);
});

// Registration
test("a new user is saved to the database", async ({ client, assert }) => {
  const fakeCreds = {
    email: "fakeEmail@gmail.com",
    username: "fakeUserName",
    password: "fake",
  };

  const response = await client.post("/users").send(fakeCreds).end();

  response.assertStatus(200);
  assert.property(response.body, "success");
  assert.property(response.body, "message");

  const newUser = response.body.message;

  try {
    await User.findOrFail(newUser.id);
  } catch (error) {
    assert.fail("Created user not found.");
  }
});
