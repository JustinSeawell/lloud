"use strict";

const axios = require("axios");

const Env = use("Env");
const Service = use("App/Services");

const PurchaseReceipt = use("App/Models/PurchaseReceipt");

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

  static async verify(receipt) {
    /**
     * TODO:
     * Right now our receipt verification system
     * only works for iOS platform. This will need to
     * be refactored once we expand to Android.
     */
    // if (receipt.platform != 'ios') {
    //   // throw
    // }

    const req = {};
    req["receipt-data"] = receipt.verification_data;
    req["password"] = this.APPSTORE_SHARED_SECRET();
    req["exclude-old-transactions"] = true;

    let isSandbox = false;

    let response = await this.appleProdVerify(req);
    if (response.data.status == 21007) {
      response = await this.appleSandboxVerify(req);
      isSandbox = true;
    }

    const success = (response.data.status === 0);

    return { verified: success, sandbox: isSandbox, response: response.data };
  }

  static async appleProdVerify(reqBody) {
    return await axios.post(this.APPLE_PROD(), reqBody);
  }

  static async appleSandboxVerify(reqBody) {
    return await axios.post(this.APPLE_SANDBOX(), reqBody);
  }

  static async save(receiptData) {
    return await PurchaseReceipt.create(receiptData);
  }

  static async verifyAndSave(receiptData) {
    const { verified, sandbox, response } = await this.verify(receiptData);
    receiptData.verified = verified;
    receiptData.is_sandbox = sandbox;
    receiptData.original_transaction_id = response.latest_receipt_info[0].original_transaction_id;

    await this.save(receiptData);

    return verified;
  }
}

module.exports = ReceiptVerification;
