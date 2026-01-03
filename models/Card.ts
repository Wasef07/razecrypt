import mongoose, { Schema } from "mongoose";

const CardSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    cardName: {
      type: String,
      required: true,
    },

    expiryMonth: {
      type: String,
      required: true,
    },

    expiryYear: {
      type: String,
      required: true,
    },

    encryptedCardNumber: {
      type: String,
      required: true,
    },

    encryptedCvv: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Card || mongoose.model("Card", CardSchema);
