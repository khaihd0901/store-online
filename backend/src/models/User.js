import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
const UserSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      trim: true,
    },
    addresses: [
      {
        fullName: String,
        phone: String,
        street: String,

        provinceCode: String,
        provinceName: String,

        districtCode: String,
        districtName: String,

        wardCode: String,
        wardName: String,

        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
    avatarUrl: {
      type: String,
    },
    wishList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    isLocked: {
      type: Boolean,
      default: false,
    },
    lockReason: {
      type: String,
    },
    lockedAt: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
    passWordChangedAt: Date,
    passWordResetExpires: Date,
    passWordResetOTP: String,

    accountVerifyToken: String,
    accountVerifyExpires: Date,
  },
  {
    timestamps: true,
  },
);
// Hash password
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});
UserSchema.methods.createOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits

  this.passWordResetOTP = crypto.createHash("sha256").update(otp).digest("hex");
  this.passWordResetExpires = Date.now() + 5 * 60 * 1000; // 5 minutes

  return otp;
};

UserSchema.methods.createAccountVerifyToken = function () {
  const verifyToken = crypto.randomBytes(32).toString("hex");
  this.accountVerifyToken = crypto
    .createHash("sha256")
    .update(verifyToken)
    .digest("hex");

  this.accountVerifyExpires = Date.now() + 24 * 60 * 60 * 1000; // 1 day
};
UserSchema.index({ accountVerifyExpires: 1 }, { expireAfterSeconds: 0 });

const User = mongoose.model("User", UserSchema);
export default User;
