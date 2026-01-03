import mongoose, { Schema } from "mongoose";

const PasswordSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    website: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      required: true,
    },

    encryptedPassword: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Password ||
  mongoose.model("Password", PasswordSchema);
