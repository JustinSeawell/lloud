"use strict";

const apn = require("apn");

const Env = use("Env");
const Database = use("Database");
const Notification = use("App/Models/Notification");
const Song = use("App/Models/Song");
const User = use("App/Models/User");

const Like = (exports = module.exports = {});

Like.created = async (likeData, otherUsersWhoLikedSong, authUser) => {
  const notificationData = otherUsersWhoLikedSong.map((userId) => {
    return { user_id: userId, type: 1 };
  });

  const notifications = await Notification.createMany(notificationData);

  const notificationSubjectData = [];

  const song = await Song.find(likeData.song_id);
  const artist = await song.artists().first();

  for (let notification of notifications) {
    // User
    notificationSubjectData.push({
      notification_id: notification.id,
      entity_type_id: 2,
      entity_id: authUser.id,
    });

    // Song
    notificationSubjectData.push({
      notification_id: notification.id,
      entity_type_id: 3,
      entity_id: likeData.song_id,
    });

    // Artist
    notificationSubjectData.push({
      notification_id: notification.id,
      entity_type_id: 1,
      entity_id: artist.id,
    });
  }

  await Database.from("notification_subjects").insert(notificationSubjectData);

  var options = {
    token: {
      key: Env.get("APN_KEY_PATH"),
      keyId: Env.get("APN_KEY_ID"),
      teamId: Env.get("APPLE_DEV_TEAM_ID"),
    },
    production: Env.get("NODE_ENV") === "production",
  };

  var apnProvider = new apn.Provider(options);

  const users = await User.query()
    .has("apnTokens")
    .with("apnTokens")
    .withCount("unreadNotifications")
    .whereIn("id", otherUsersWhoLikedSong)
    .fetch();

  if (!users) return;

  var note = new apn.Notification();

  note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
  note.sound = "ping.aiff";
  // note.payload = { messageFrom: "John Appleseed" }; // Not sure we even need this??
  note.topic = Env.get("APPLE_BUNDLE_ID");

  users.rows.forEach((user) => {
    const { unreadNotifications_count: unread } = user.$sideLoaded;
    const limit = 10;
    if (unread > limit) return;

    note.alert =
      unread === limit
        ? `Your points are blowing up!! 😎 Check your score!`
        : `@${authUser.username} gave you a point. Check your score! 💿`;
    note.badge = unread;

    const apnTokens = user.getRelated("apnTokens");
    apnTokens.rows.forEach(
      async (row) => await apnProvider.send(note, row.token)
    );
  });
};
