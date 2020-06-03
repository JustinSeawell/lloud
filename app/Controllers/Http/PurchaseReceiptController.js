"use strict";

const { validate } = use("Validator");

const ReceiptVerification = use("App/Services/ReceiptVerification");

/**
 * Resourceful controller for interacting with purchasereceipts
 */
class PurchaseReceiptController {
  async verify({ auth, request, response }) {
    /**
     * TODO:
     * x Validate the request
     * x Create model from request data
     * x Send to apple prod
     * x Send to apple sandbox
     * - Process the response
     * - Persist the response
     * - Return response to the iOS client
     */
    const rules = {
      platform: "required",
      product_id: "required",
      verification_data: "required"
    };

    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return validation.messages();
    }

    const receiptData = request.only([
      "platform",
      "product_id",
      "verification_data"
    ]);

    receiptData.platform = 1;
    receiptData.user_id = auth.user.id;

    const verified = await ReceiptVerification.verifyAndSave(receiptData);
    if (!verified) {
      return response.ok({ success: false, verified: false });
    }

    return response.ok({ success: true, verified: true });
  }
}

module.exports = PurchaseReceiptController;
