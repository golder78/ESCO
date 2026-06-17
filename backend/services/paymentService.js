const axios = require("axios");

class DarajaPaymentService {
  constructor() {
    this.consumerKey = process.env.DARAJA_CONSUMER_KEY;
    this.consumerSecret = process.env.DARAJA_CONSUMER_SECRET;
    this.passkey = process.env.DARAJA_PASSKEY;
    this.environment = process.env.DARAJA_ENVIRONMENT || "sandbox";
    this.businessShortCode = process.env.DARAJA_BUSINESS_SHORT_CODE;
    this.callbackUrl = process.env.DARAJA_CALLBACK_URL;

    this.baseUrl =
      this.environment === "production"
        ? "https://api.safaricom.co.ke"
        : "https://sandbox.safaricom.co.ke";

    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async getAccessToken() {
    try {
      if (this.accessToken && this.tokenExpiry > Date.now()) {
        return this.accessToken;
      }

      const auth = Buffer.from(
        `${this.consumerKey}:${this.consumerSecret}`
      ).toString("base64");

      const response = await axios.get(
        `${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + 3599000; // 59 minutes and 59 seconds

      return this.accessToken;
    } catch (error) {
      console.error("Error getting access token:", error.message);
      throw new Error("Failed to authenticate with Daraja API");
    }
  }

  async initiateSTKPush(phoneNumber, amount, orderId, accountReference) {
    try {
      const token = await this.getAccessToken();

      const timestamp = new Date()
        .toISOString()
        .replace(/[^0-9]/g, "")
        .slice(0, -3);

      const password = Buffer.from(
        `${this.businessShortCode}${this.passkey}${timestamp}`
      ).toString("base64");

      const payload = {
        BusinessShortCode: this.businessShortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(amount),
        PartyA: phoneNumber,
        PartyB: this.businessShortCode,
        PhoneNumber: phoneNumber,
        CallBackURL: this.callbackUrl,
        AccountReference: accountReference || orderId,
        TransactionDesc: `Payment for order ${orderId}`,
      };

      const response = await axios.post(
        `${this.baseUrl}/mpesa/stkpush/v1/processrequest`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return {
        success: response.data.ResponseCode === "0",
        checkoutRequestId: response.data.CheckoutRequestID,
        customerMessage: response.data.CustomerMessage,
        responseCode: response.data.ResponseCode,
      };
    } catch (error) {
      console.error("Error initiating STK push:", error.message);
      throw new Error("Failed to initiate payment");
    }
  }

  async queryTransactionStatus(checkoutRequestId) {
    try {
      const token = await this.getAccessToken();

      const timestamp = new Date()
        .toISOString()
        .replace(/[^0-9]/g, "")
        .slice(0, -3);

      const password = Buffer.from(
        `${this.businessShortCode}${this.passkey}${timestamp}`
      ).toString("base64");

      const payload = {
        BusinessShortCode: this.businessShortCode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      };

      const response = await axios.post(
        `${this.baseUrl}/mpesa/stkpushquery/v1/query`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return {
        success: response.data.ResponseCode === "0",
        resultCode: response.data.ResultCode,
        resultDescription: response.data.ResultDesc,
        checkoutRequestId: response.data.CheckoutRequestID,
      };
    } catch (error) {
      console.error("Error querying transaction status:", error.message);
      throw new Error("Failed to query payment status");
    }
  }

  validateCallback(callback) {
    try {
      const result = callback.Body?.stkCallback?.CallbackMetadata?.Item;

      if (!result) {
        return {
          success: false,
          message: "Invalid callback structure",
        };
      }

      const resultCode = callback.Body?.stkCallback?.ResultCode;
      const resultDescription = callback.Body?.stkCallback?.ResultDesc;

      if (resultCode === 0) {
        const data = {};
        result.forEach((item) => {
          data[item.Name] = item.Value;
        });

        return {
          success: true,
          transactionId: data.MpesaReceiptNumber,
          amount: data.Amount,
          phoneNumber: data.PhoneNumber,
          resultDescription: resultDescription,
        };
      } else {
        return {
          success: false,
          resultCode: resultCode,
          resultDescription: resultDescription,
        };
      }
    } catch (error) {
      console.error("Error validating callback:", error.message);
      return {
        success: false,
        message: "Error validating callback",
      };
    }
  }
}

module.exports = new DarajaPaymentService();
