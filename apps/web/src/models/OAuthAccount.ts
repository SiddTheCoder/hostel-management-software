import { Schema, model, models } from "mongoose";

const oauthAccountSchema = new Schema(
  {
    email: { lowercase: true, trim: true, type: String },
    isDeleted: { default: false, type: Boolean },
    linkedAt: { default: Date.now, type: Date },
    provider: { enum: ["google"], required: true, type: String },
    providerAccountId: { required: true, type: String },
    userId: { ref: "User", required: true, type: Schema.Types.ObjectId },
  },
  { timestamps: true },
);

oauthAccountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });
oauthAccountSchema.index({ userId: 1, provider: 1 });
oauthAccountSchema.index({ email: 1, provider: 1 });

export const OAuthAccountModel =
  models.OAuthAccount || model("OAuthAccount", oauthAccountSchema);
