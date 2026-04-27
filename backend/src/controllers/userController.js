import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Session from "../models/Session.js";
import Category from "../models/Category.js";
import {
  sendResetPasswordOTP,
  sendOrderConfirmation,
} from "../utils/emailHandler.js";
import Cart from "../models/Cart.js";
import Coupon from "../models/Coupon.js";
import Order from "../models/Order.js";
import crypto from "crypto";
import mongoose from "mongoose";

const generateOrderCode = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${date}-${random}`;
};
// ============================
// GET ALL USERS
// ============================
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ isAdmin: false, isDeleted: false }).select(
    "-hashedPassword",
  );

  res.status(200).json(users);
});

export const authMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});
// ============================
// GET USER BY ID
// ============================
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-hashedPassword");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user);
});

// ============================
// UPDATE USER
// ============================
export const updateUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, phone } = req.body;

  const updateData = {
    firstName,
    lastName,
    phone,
    fullName: `${firstName} ${lastName}`,
  };

  const user = await User.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user);
});
export const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user.addresses.length >= 3) {
    return res.status(400).json({ message: "Max 3 addresses" });
  }

  const newAddress = req.body;

  if (user.addresses.length === 0) {
    newAddress.isDefault = true;
  }

  user.addresses.push(newAddress);
  await user.save();

  res.json(user.addresses);
});
export const setDefaultAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  user.addresses.forEach((addr) => {
    addr.isDefault = addr._id.toString() === req.params.id;
  });

  await user.save();
  res.json(user.addresses);
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user.addresses.length <= 1) {
    return res.status(400).json({ message: "Must have at least 1 address" });
  }
  const wasDefault = user.addresses.find(
    (a) => a._id.toString() === req.params.id,
  )?.isDefault;

  user.addresses = user.addresses.filter(
    (addr) => addr._id.toString() !== req.params.id,
  );

  if (wasDefault) {
    user.addresses[0].isDefault = true;
  }

  await user.save();
  res.json(user.addresses);
});

export const getAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user.addresses);
});
// ============================
// SOFT DELETE USER
// ============================
export const softDeleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      isLocked: true,
      isDeleted: true,
      deletedAt: new Date(),
    },
    { new: true },
  );

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({ message: "User deleted (soft)", user });
});

// ============================
// RESTORE USER
// ============================
export const restoreUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      isLocked: false,
      isDeleted: false,
      deletedAt: null,
    },
    { new: true },
  );

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({ message: "User restored", user });
});

// ============================
// GET DELETED USERS (ADMIN)
// ============================
export const getDeletedUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ isDeleted: true });

  res.status(200).json(users);
});

// ============================
// PERMANENT DELETE (DANGER)
// ============================
export const hardDeleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({ message: "User permanently deleted" });
});
// ============================
// LOCK USER
// ============================
export const toggleUserLock = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.isLocked = !user.isLocked;

  if (user.isLocked) {
    user.lockedAt = new Date();
  } else {
    user.lockReason = undefined;
    user.lockedAt = undefined;
  }

  await user.save();

  res.status(200).json({
    success: true,
    isLocked: user.isLocked,
  });
});
// ============================
// UPDATE PASSWORD
// ============================
export const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  const token = req.cookies?.refreshToken;

  const user = await User.findById(_id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!password) {
    res.status(400);
    throw new Error("Password is required");
  }

  user.password = password;
  await user.save();

  if (token) {
    await Session.deleteOne({ refreshToken: token });
    res.clearCookie("refreshToken");
  }

  res.status(200).json({ message: "Password updated successfully" });
});

// ============================
// FORGOT PASSWORD TOKEN
// ============================
export const forgotPasswordOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const OTP = await user.createOTP();
  await user.save();
  await sendResetPasswordOTP(email, OTP);

  res.status(200).json({ message: "Email sent successfully" });
});
export const verifyOTP = asyncHandler(async (req, res) => {
  const { OTP, email } = req.body;
  const hashedOTP = crypto.createHash("sha256").update(OTP).digest("hex");

  const user = await User.findOne({
    email,
    passWordResetOTP: hashedOTP,
    passWordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired OTP");
  }
  res.json({ message: "OTP verified successfully" });
});
// ============================
// RESET PASSWORD
// ============================
export const resetPassword = asyncHandler(async (req, res) => {
  const { password, OTP, email } = req.body;
  console.log(req.body);
  const hashedOTP = crypto.createHash("sha256").update(OTP).digest("hex");

  const user = await User.findOne({
    email: email,
    passWordResetOTP: hashedOTP,
    passWordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired token");
  }

  user.password = password;
  user.passWordResetOTP = undefined;
  user.passWordResetExpires = undefined;
  await user.save();

  res.status(200).json({ message: "Password reset successfully" });
});

// ============================
// ADD / REMOVE WISHLIST
// ============================
export const addToWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;

  if (!prodId) {
    return res.status(400).json({
      success: false,
      message: "Product ID required",
    });
  }
  const user = await User.findById(_id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  const alreadyAdded = user.wishList.some((id) => id.equals(prodId));
  const update = alreadyAdded
    ? { $pull: { wishList: prodId } }
    : { $addToSet: { wishList: prodId } };

  const updatedUser = await User.findByIdAndUpdate(_id, update, {
    new: true,
  }).populate("wishList");

  res.status(200).json({
    success: true,
    wishList: updatedUser.wishList,
  });
});

// ============================
// REMOVE FROM WISHLIST
// ============================
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;
  if (!mongoose.Types.ObjectId.isValid(prodId)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    { $pull: { wishList: prodId } },
    { new: true },
  ).populate("wishList");

  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    success: true,
    message: "Product removed from wishlist",
    wishList: updatedUser.wishList,
    count: updatedUser.wishList.length,
  });
});
// ============================
// GET WISHLIST
// ============================
export const getWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const wishList = await User.findById(_id).select("wishList").populate({
    path: "wishList",
    model: "Product",
  });
  res.status(200).json(wishList);
});

// ============================
// USER CART
// ============================
export const userCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId, quantity } = req.body;

  // ✅ Validate
  if (!prodId || !quantity) {
    res.status(400);
    throw new Error("prodId and quantity are required");
  }

  // ✅ Get product price
  const product = await Product.findById(prodId).select("price");

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // ✅ Find or create cart
  let userCart = await Cart.findOne({ orderBy: _id });

  if (!userCart) {
    userCart = new Cart({
      orderBy: _id,
      items: [],
      cartTotal: 0,
    });
  }

  // ✅ Check existing item
  const index = userCart.items.findIndex((i) => i.prodId.toString() === prodId);

  if (index > -1) {
    // 🔥 Update quantity
    userCart.items[index].quantity += quantity;
    userCart.items[index].price = product.price;
  } else {
    // 🔥 Add new item
    userCart.items.push({
      prodId: prodId,
      quantity: quantity,
      price: product.price,
    });
  }

  // ✅ Recalculate total
  userCart.cartTotal = userCart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  await userCart.save();

  const populatedCart = await Cart.findOne({ orderBy: _id }).populate(
    "items.prodId",
  );

  res.status(200).json(populatedCart);
});
// ============================
// MERGE CART
// ============================
export const mergeCart = async (req, res) => {
  const userId = req.user._id;
  const guestCart = req.body;

  if (!guestCart || guestCart.length === 0) {
    return res.json({ message: "No guest cart" });
  }

  let cart = await Cart.findOne({ orderBy: userId });

  if (!cart) {
    cart = new Cart({
      orderBy: userId,
      items: [],
    });
  }

  guestCart.forEach((guestItem) => {
    const existing = cart.items.find(
      (item) => item.prodId.toString() === guestItem.prodId,
    );

    if (existing) {
      existing.quantity += guestItem.quantity;
    } else {
      cart.items.push({
        prodId: guestItem.prodId,
        quantity: guestItem.quantity,
        price: guestItem.price,
      });
    }
  });

  // 🔥 recalc total
  cart.cartTotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  await cart.save();

  const populatedCart = await Cart.findOne({ orderBy: userId }).populate(
    "items.prodId",
  );

  res.status(200).json(populatedCart);
};
// ============================
// GET USER CART
// ============================
export const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  const cart = await Cart.findOne({ orderBy: _id }).populate("items.prodId");
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  res.status(200).json(cart);
});
// ============================
// UPDATE CART QUANTITY
// ============================
export const updateCartItemQuantity = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId, quantity } = req.body;
  const product = await Product.findById(prodId);

  if (!mongoose.Types.ObjectId.isValid(prodId)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  if (quantity > product.stock) {
    return res.status(400).json({
      message: `Only ${product.stock} items in stock`,
    });
  }
  if (quantity < 1) {
    return res.status(400).json({ message: "Quantity must be >= 1" });
  }

  const cart = await Cart.findOne({ orderBy: _id });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.prodId.toString() === prodId,
  );

  if (itemIndex === -1) {
    return res.status(404).json({ message: "Item not in cart" });
  }

  cart.items[itemIndex].quantity = quantity;

  // 🔄 Recalculate total
  cart.cartTotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // reset coupon
  cart.totalAfterDiscount = undefined;
  cart.appliedCoupon = undefined;

  await cart.save();

  res.status(200).json(cart);
});
// ============================
// REMOVE ITEM FROM CART
// ============================
export const removeFromCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(prodId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
  }

  const cart = await Cart.findOne({ orderBy: _id });
  if (!cart) {
    return res.status(404).json({
      success: false,
      message: "Cart not found",
    });
  }

  const initialLength = cart.items.length;
  cart.items = cart.items.filter((item) => !item.prodId.equals(prodId));

  cart.cartTotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  cart.totalAfterDiscount = undefined;
  cart.appliedCoupon = undefined;

  await cart.save();

  res.status(200).json(cart);
});
// ============================
// EMPTY CART
// ============================
export const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  await Cart.findOneAndDelete({ orderBy: _id });

  res.status(200).json({
    success: true,
    message: "Cart emptied successfully",
  });
});

// ============================
// APPLY COUPON
// ============================
export const applyCoupon = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { coupon } = req.body;

  if (!coupon) {
    res.status(400);
    throw new Error("Coupon code is required");
  }

  const couponCode = coupon.trim().toUpperCase();

  // ✅ GET CART FIRST
  const cart = await Cart.findOne({ orderBy: _id });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  if (!cart.items || cart.items.length === 0) {
    res.status(400);
    throw new Error("Cart is empty");
  }

  // ✅ CHECK already applied
  if (cart.appliedCoupon === couponCode) {
    res.status(400);
    throw new Error("Coupon already applied");
  }

  // ✅ FIND COUPON
  const validCoupon = await Coupon.findOne({ code: couponCode });
  const alreadyUsed = validCoupon.usedBy.some(
    (id) => id.toString() === _id.toString(),
  );

  if (alreadyUsed) {
    res.status(400);
    throw new Error("You have already used this coupon");
  }
  if (!validCoupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }

  if (!validCoupon.isActive) {
    res.status(400);
    throw new Error("Coupon is inactive");
  }

  if (validCoupon.expiryDate < new Date()) {
    res.status(400);
    throw new Error("Coupon expired");
  }

  if (validCoupon.maxUses && validCoupon.currentUses >= validCoupon.maxUses) {
    res.status(400);
    throw new Error("Coupon usage limit reached");
  }

  if (cart.cartTotal < validCoupon.minPurchaseAmount) {
    res.status(400);
    throw new Error(
      `Minimum purchase amount is ${validCoupon.minPurchaseAmount}`,
    );
  }

  // ✅ REMOVE OLD COUPON (if switching)
  if (cart.appliedCoupon && cart.appliedCoupon !== couponCode) {
    const oldCoupon = await Coupon.findOne({ code: cart.appliedCoupon });
    if (oldCoupon) {
      oldCoupon.currentUses -= 1;
      await oldCoupon.save();
    }
  }

  // ✅ CALCULATE DISCOUNT
  let discount = 0;

  if (validCoupon.discountType === "percentage") {
    discount = (cart.cartTotal * validCoupon.discountValue) / 100;

    if (validCoupon.maxDiscount) {
      discount = Math.min(discount, validCoupon.maxDiscount);
    }
  } else {
    discount = validCoupon.discountValue;
  }

  discount = Math.round(discount);

  const totalAfterDiscount = Math.max(0, Math.round(cart.cartTotal - discount));

  // ✅ SAVE CART
  cart.totalAfterDiscount = totalAfterDiscount;
  cart.appliedCoupon = couponCode;
  await cart.save();

  // ✅ INCREASE USAGE
  validCoupon.currentUses += 1;
  await validCoupon.save();

  res.status(200).json({
    success: true,
    coupon: couponCode,
    discount,
    totalAfterDiscount,
  });
});
// removeCoupon.js
export const removeCoupon = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  const cart = await Cart.findOne({ orderBy: _id });
  if (!cart) throw new Error("Cart not found");

  cart.appliedCoupon = null;
  cart.totalAfterDiscount = null;

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Coupon removed",
  });
});
// ============================
// CREATE ORDER
// ============================
export const createOrder = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { addressId } = req.body;
    const { _id } = req.user;

    // =========================
    // 1. USER + ADDRESS
    // =========================
    const user = await User.findById(_id).session(session);
    if (!user) throw new Error("User not found");

    const address = user.addresses.id(addressId);
    if (!address) throw new Error("Address not found");

    // =========================
    // 2. CART
    // =========================
    const cart = await Cart.findOne({ orderBy: _id }).session(session);
    if (!cart || !cart.items.length) {
      throw new Error("Cart is empty");
    }

    // =========================
    // 3. FETCH PRODUCTS
    // =========================
    const productIds = cart.items.map((i) => i.prodId);

    const products = await Product.find({
      _id: { $in: productIds },
    }).session(session);

    const productMap = {};
    products.forEach((p) => {
      productMap[p._id.toString()] = p; // ✅ FIX
    });

    // =========================
    // 4. STOCK CHECK
    // =========================
    for (const item of cart.items) {
      const product = productMap[item.prodId.toString()]; // ✅ FIX

      if (!product || product.stock < item.quantity) {
        throw new Error(`Not enough stock for ${product?.title}`);
      }
    }

    // =========================
    // 5. CALCULATE TOTAL
    // =========================
    const shippingFee = 5;

    const hasCoupon =
      cart.appliedCoupon && typeof cart.totalAfterDiscount === "number";

    const subtotal = cart.cartTotal;

    const finalAmount = hasCoupon
      ? cart.totalAfterDiscount + shippingFee
      : subtotal + shippingFee;

    // =========================
    // 6. CREATE ORDER
    // =========================
    const orderCode = generateOrderCode();
    const orderDocs = await Order.create(
      [
        {
          orderCode,
          orderBy: _id,
          items: cart.items,
          totalAmount: finalAmount,
          status: "processing",

          // ✅ match schema ONLY
          shippingAddress: {
            street: address.street,
            ward: address.wardName,
            district: address.districtName,
            province: address.provinceName,
          },

          paymentIntent: {
            amount: finalAmount,
            status: "processing",
            method: "cod",
          },
        },
      ],
      { session },
    );

    const order = orderDocs[0]; // ✅ FIX

    // =========================
    // 7. UPDATE STOCK
    // =========================
    const bulkOps = cart.items.map((item) => ({
      updateOne: {
        filter: {
          _id: item.prodId,
          stock: { $gte: item.quantity },
        },
        update: {
          $inc: {
            stock: -item.quantity,
            sold: item.quantity,
          },
        },
      },
    }));

    const bulkResult = await Product.bulkWrite(bulkOps, { session });

    // ✅ OPTIONAL strict check
    if (bulkResult.modifiedCount !== cart.items.length) {
      throw new Error("Stock update failed");
    }

    // =========================
    // 8. COUPON UPDATE
    // =========================
    if (cart.appliedCoupon) {
      await Coupon.updateOne(
        { code: cart.appliedCoupon },
        {
          $inc: { currentUses: 1 },
          $addToSet: { usedBy: _id },
        },
        { session },
      );
    }

    // =========================
    // 9. CLEAR CART
    // =========================
    await Cart.deleteOne({ orderBy: _id }).session(session);

    // =========================
    // 10. COMMIT
    // =========================
    await session.commitTransaction();
    await order.populate("items.prodId");

    // ✅ send email (non-blocking)
    sendOrderConfirmation(user.email, order).catch((err) =>
      console.error("Email error:", err),
    );
    res.status(200).json({
      success: true,
      message: "Order created successfully",
      order, // ✅ single object
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

// ============================
// GET ORDER BY USER
// ============================
export const getOrderbyUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ orderBy: _id })
      .populate("items.prodId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Order.countDocuments({ orderBy: _id }),
  ]);

  res.status(200).json({
    data: orders,
    pagination: {
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  });
});

// ============================
// GET ALL ORDERS
// ============================
export const getAllOrders = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const status = req.query.status;

  const filter = {};

  if (status) {
    filter.status = status;
  }

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate("orderBy")
      .populate("items.prodId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Order.countDocuments(filter),
  ]);

  res.status(200).json({
    data: orders,
    pagination: {
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  });
});

// ============================
// UPDATE ORDER STATUS
// ============================
export const changeOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatus = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (!allowedStatus.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const order = await Order.findById(id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.status = status;
  await order.save();

  res.status(200).json({
    success: true,
    message: "Order status updated",
    order,
  });
});


export const adminSearch = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) return res.json({});

    const regex = new RegExp(q, "i");

    const [products, orders, categories, users] = await Promise.all([
      Product.find({
        $or: [
          { title: regex },
          { author: regex },
        ],
      })
        .select("title price images")
        .limit(5),

      Order.find({
        orderCode: regex,
      })
        .select("orderCode totalAmount status createdAt")
        .limit(5),

      Category.find({
        categoryName: regex,
      })
        .limit(5),

      User.find({
        $or: [
          { email: regex },
          { fullName: regex },
        ],
      })
        .select("email name")
        .limit(5),
    ]);

    res.json({
      products,
      orders,
      categories,
      users,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};