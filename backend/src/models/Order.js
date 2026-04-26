import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    orderBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        prodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    // ✅ store address snapshot (recommended)
    shippingAddress: {
      street: String,
      ward: String,
      district: String,
      province: String,
    },

    // ✅ payment info
    paymentIntent: {
      id: String,

      method: {
        type: String,
        enum: ["cod", "internet banking"],
        default: "cod",
        required: true,
      },

      amount: {
        type: Number,
        required: true,
      },

      status: {
        type: String,
        enum: [
          "requires_payment_method",
          "requires_confirmation",
          "processing",
          "succeeded",
          "canceled",
        ],
        default: "processing",
      },

      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true, // ✅ auto createdAt & updatedAt
  }
);

export default mongoose.model("Order", OrderSchema);