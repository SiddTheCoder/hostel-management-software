import { Schema, model, models } from "mongoose";

/**
 * Key/value store for platform-owner-editable configuration that the public
 * website renders (hero copy, city list, pricing plans, legal text, flags…).
 *
 * One document per config section. `value` is deliberately Mixed — each section
 * has its own zod schema in the web app, which is where validation belongs; the
 * collection just persists the already-validated shape.
 */
const platformSettingSchema = new Schema(
  {
    key: { index: true, required: true, trim: true, type: String, unique: true },
    updatedBy: { ref: "User", type: Schema.Types.ObjectId },
    value: { required: true, type: Schema.Types.Mixed },
  },
  { minimize: false, timestamps: true },
);

export const PlatformSettingModel =
  models.PlatformSetting || model("PlatformSetting", platformSettingSchema);
