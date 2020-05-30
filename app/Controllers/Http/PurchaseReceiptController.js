"use strict";

const { validate } = use("Validator");
const PurchaseReceipt = use("App/Models/PurchaseReceipt");

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
      email: "required|platform",
      email: "required|product_id",
      email: "required|verification_data",
      email: "required|serialized_purchase_details",
    };

    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return validation.messages();
    }

    const receiptData = request.only([
      "platform",
      "product_id",
      "verification_data",
      "serialized_purchase_details",
    ]);

    receiptData.user_id = auth.user.id;

    const verified = await ReceiptVerification.verifyAndSave(receiptData);
    if (!verified) {
      // Return err response
    }

    // Return success response
  }
}

module.exports = PurchaseReceiptController;
