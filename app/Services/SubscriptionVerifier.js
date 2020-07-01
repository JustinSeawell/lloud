"use strict";

const axios = require("axios");

const Env = use("Env");
const Service = use("App/Services");

class SubscriptionVerifier extends Service {
  static async verifyUserIsSubscribed(userId) {
    const response = await this.getSubscriber(userId);
    if (response.status != 200) {
      return false;
    }

    const subscriber = response.data.subscriber;
    const subscriptions = subscriber.subscriptions;

    // TODO: Make this logic more robust
    if (
      Object.keys(subscriptions).length === 0 &&
      subscriptions.constructor === Object
    ) {
      return false; // Subscriptions is empty
    }

    return true;
  }

  static async getSubscriber(userId) {
    const revCatUrl = `https://api.revenuecat.com/v1/subscribers/${userId}`;
    const revCatApiKey = Env.get("REVENUECAT_API_KEY");

    const request = {
      headers: {
        "x-platform": "ios",
        "content-type": "application/json",
        authorization: `Bearer ${revCatApiKey}`,
      },
    };

    return await axios.get(revCatUrl, request);
  }
}

module.exports = SubscriptionVerifier;
