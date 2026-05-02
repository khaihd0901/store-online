import express from 'express'
import { getUsers,getUserById, updateUser,updatePassword, forgotPasswordOTP, resetPassword, getWishlist, userCart, getUserCart, emptyCart, applyCoupon, createOrder, getAllOrders,getOrderById, getOrderbyUser, authMe, verifyOTP, addToWishlist, removeFromWishlist, toggleUserLock, softDeleteUser, restoreUser, getDeletedUsers, removeFromCart, updateCartItemQuantity, addAddress, setDefaultAddress, deleteAddress, getAddresses, mergeCart, removeCoupon, adminSearch, changeOrderStatus } from '../controllers/userController.js';
import {protectedRoute, isAdmin} from '../middlewares/authMiddleware.js';


const router = express.Router();
router.get('/',protectedRoute,isAdmin,getUsers);
router.get('/me',protectedRoute, authMe);
router.put('/update/:id',protectedRoute, updateUser);
router.delete("/:id", protectedRoute, isAdmin, softDeleteUser);
router.put("/restore/:id", protectedRoute, isAdmin, restoreUser);
router.get("/deleted/all", protectedRoute, isAdmin, getDeletedUsers);
router.put("/toggle-lock/:id", protectedRoute, isAdmin, toggleUserLock);
router.put('/password',protectedRoute, updatePassword);
router.post('/forgot-password', forgotPasswordOTP);
router.post('/reset-password', resetPassword );
router.post('/verify-otp', verifyOTP)
router.post('/add-wishlist', protectedRoute, addToWishlist);
router.put('/remove-wishlist', protectedRoute,removeFromWishlist)
router.get('/wishlist',protectedRoute, getWishlist);
router.post("/merge-cart", protectedRoute, mergeCart);
router.post('/cart',protectedRoute, userCart);
router.get('/get-cart',protectedRoute, getUserCart);
router.post('/delete-item', protectedRoute, removeFromCart)
router.put('/update-quantity', protectedRoute, updateCartItemQuantity)
router.post('/empty-cart',protectedRoute, emptyCart);
router.post('/apply-coupon',protectedRoute, applyCoupon );
router.put('/remove-coupon', protectedRoute,removeCoupon)
router.post('/create-order',protectedRoute, createOrder );
router.get('/get-order',protectedRoute, getOrderbyUser)
router.get('/orders/:id',protectedRoute, getOrderById);
router.patch("/orders/:id/status",protectedRoute,isAdmin, changeOrderStatus);
router.post('/add-address',protectedRoute, addAddress)
router.put('/address/default/:id',protectedRoute, setDefaultAddress)
router.delete('/address/:id',protectedRoute, deleteAddress)
router.get('/address',protectedRoute, getAddresses)
router.get("/search/:type",protectedRoute,isAdmin, adminSearch);



router.get('/get-all-orders',protectedRoute,isAdmin, getAllOrders)

router.get('/:id',protectedRoute, getUserById);



export default router;