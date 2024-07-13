import Router from 'express'
import { isAuthorized, isUserLoggedIn } from '../middlewares/authMiddleware.js'
import { allPayments, BuySubscription, cancelSubscription, getRazorpayKey, verifySubscription } from '../controllers/payment.cotroller.js'

const router=Router()
router.route('/razorpay-key').get(isUserLoggedIn,getRazorpayKey)
router.route('/subscription').post(isUserLoggedIn,BuySubscription)
router.route('/verify').post(isUserLoggedIn,verifySubscription)
router.route('/unsubscribe').post(isUserLoggedIn,cancelSubscription)
router.route('/').get(isUserLoggedIn,isAuthorized('ADMIN'),allPayments)

export default router