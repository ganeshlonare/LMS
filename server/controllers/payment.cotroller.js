import { razorPay } from "../server.js";
import dotenv from 'dotenv'
import crypto from 'crypto'
import { errorhandler } from "../utils/errorHandler.js";
import User from "../models/user.model.js";
import Payment from "../models/payment.model.js";
dotenv.config()
export const getRazorpayKey=async(req,res,next)=>{
    try{
            res.status(200).json({
            success:true,
            message:"RazorPay api key fetched",
            key:process.env.RAZORPAY_KEY_ID
         })
    }
    catch(error){
        return next(errorhandler(400,error.message))
    }
}
export const BuySubscription=async(req,res,next)=>{
    try{
          // Extracting ID from request obj
        const {id}=req.user
        // Finding the user based on the ID
        const user=await User.findById(id)
        if(!user){
            return next(errorhandler(400,"unauthenticated user"))
        }
        // Checking the user role
        if(user.role=='ADMIN'){
            return next(errorhandler(400,"Admin cant buy the courses or subscription"))
        }
        // Creating a subscription using razorpay that we imported from the server
        const subscription=await razorPay.subscriptions.create({
            plan_id:process.env.RAZORPAY_PLAN_ID, // The unique plan ID
            customer_notify: 1, // 1 means razorpay will handle notifying the customer, 0 means we will not notify the customer
            total_count: 12 // 12 means it will charge every month for a 1-year sub.
        })
        console.log(subscription)
        // Adding the ID and the status to the user account
        user.subscription.id=subscription.id
        user.subscription.status=subscription.status

        //saving the user
        await user.save()
        res.status(200).json({
            success:true,
            message:"subscribed successfully",
            subscription_id:subscription.id
        })


    }
    catch(error){
        console.log(error)
        return next(errorhandler(400,error.message))
    }
}
export const verifySubscription=async(req,res,next)=>{
    try{
        //Get the Id of the user
        const{id}=req.user
        //Get payment details of razorpay such as id, subscription_id and signature from the body
        //This stuff we will get when the user hit on to the payment
        const{razorpay_payment_id,razorpay_subscription_id,razorpay_signature}=req.body
        //Find the user 
        const user=await User.findById(id)
        //Get subscription id of the user from db
        const Subscription_Id=user.subscription.id
        //Create the new signature using the subscription id of the user and payment id we took from
        //the body 
        const generatedSignature=await crypto
              .createHmac('sha256',process.env.RAZORPAY_SECRET)
              .update(`${razorpay_payment_id}|${Subscription_Id}`)
              .digest('hex')
        //Check whether the generatedSignature is same as to that of the payment signature
        //If its not same then return Payment not verified
        if(!razorpay_signature==generatedSignature){
            return next(errorhandler(400,"Payment not verified,please try again"))
        }
        //Here if the payMent is verified i.e our generatedSignature==razorpay_signature then
        //just create the payment in the database as shown below
        await Payment.create({
            razorpay_payment_id,
            razorpay_subscription_id,
            razorpay_signature
        })
        //change the subscription status of the user as active
        user.subscription.status='active'
        //at the send save the user in the database 
        await user.save()

        return res.status(200).json({
            success:true,
            message:"Payment is verified"
        })

    }
    catch(error){
        return next(errorhandler(400,error.message))
    }
}
export const cancelSubscription=async(req,res,next)=>{
    //Take the id of the user
    const{id}=req.user
    try{
        //Find the user with the given id
       const user=await User.findById(id)
       //Check who is trying to unsubscribe the subscription
       if(user.role=='ADMIN'){
        return next(errorhandler(400,"Admin cant unsubscribe"))
       }
       //Find out the subscription id from the user
       const SubscriptionId=user.subscription.id
       //Delete the subscription of the user with given subscription_id
       const Subscription=await razorPay.subscriptions.cancel(
        SubscriptionId
       )
       //Update the subscription status
       user.subscription.status=Subscription.status
       //save the user with updated status
       await user.save()
       //Now find the payment corresponding to given subscriptionId
       const payment=await Payment.findOne({
        razorpay_subscription_id:SubcriptionId
       })
       //Find the time subscribed 
       const timeSubscribed=Date.now()-createdAt
       const refundPeriod=14*24*60*60*1000
       //Check whether the refund period is less or greater than timeSubscribed 
       if(refundPeriod<=timeSubscribed){
        return next(errorhandler(400,"Refund not available as the refund period is over"))
       }
       //if the timeSubscribed is in the refundPeriod then just initiate the refund
       await razorPay.payments.refund(payment.razorpay_payment_id)({
        speed:'optimum'
       })
       user.subscription.id=undefined
       user.subscription.status=undefined

       await user.save()
       await payment.remove()
       return res.status(200).json({
            success:true,
            message:"Unsubscribe successfully"
        })
    }
    catch(error){
        console.log(error)
        return next(errorhandler(error.statusCode,error.error.description))
    }
}
export const allPayments=async(req,res,next)=>{
    try{

    }
    catch(error){
        return next(errorhandler(400,error.message))
    }
}   