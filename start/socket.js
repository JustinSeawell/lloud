"use strict";

/*
|--------------------------------------------------------------------------
| Websocket
|--------------------------------------------------------------------------
|
| This file is used to register websocket channels and start the Ws server.
| Learn more about same in the official documentation.
| https://adonisjs.com/docs/websocket
|
| For middleware, do check `wsKernel.js` file.
|
*/

const Ws = use("Ws");

Ws.channel("notifications:*", async ({ socket, auth }) => {
  const user = auth.user;

  const unreadNotifications = await user.unreadNotifications().getCount();
  socket.emit("notification_count", {
    unread_notifications: unreadNotifications,
  });
}).middleware(["auth"]);
