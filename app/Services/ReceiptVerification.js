"use strict";

const axios = require("axios");

const Env = use("Env");
const Service = use("App/Services");

class ReceiptVerification extends Service {
  static APPLE_PROD() {
    return "https://buy.itunes.apple.com/verifyReceipt";
  }

  static APPLE_SANDBOX() {
    return "https://sandbox.itunes.apple.com/verifyReceipt";
  }

  static APPSTORE_SHARED_SECRET() {
    return Env.get("APPSTORE_SHARED_SECRET");
  }

  static verify(receipt) {
    const req = {};
    req["receipt-data"] = receipt.verification_data;
    req["password"] = this.APPSTORE_SHARED_SECRET();
    req["exclude-old-transactions"] = true;

    let success, environment;

    success = this.appleProdVerify(req);
    isSandbox = false;

    // TODO: Make this more sophisticated than just a boolean
    if (!success) {
      success = this.appleSandboxVerify(req);
      isSandbox = true;
    }

    return { verified: success, sandbox: isSandbox };
  }

  static appleProdVerify(reqBody) {
    return axios.post(this.APPLE_PROD(), reqBody).then((response) => {
      return false;
    });
  }

  static appleSandboxVerify(reqBody) {
    return axios.post(this.APPLE_SANDBOX(), reqBody).then((response) => {
      return false;
    });
  }

  static async save(receipt) {
    return await PurchaseReceipt.create(receiptData);
  }

  static async verifyAndSave(receiptData) {
    const { verified, sandbox } = this.verify(receiptData);
    receiptData.verified = verified;
    receiptData.is_sandbox = sandbox;

    await this.save(receiptData);

    return verified;
  }
}

module.exports = ReceiptVerification;
