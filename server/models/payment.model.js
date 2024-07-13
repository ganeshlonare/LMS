import { Schema , model} from 'mongoose'

const paymentSchema=new Schema({
    Payment_id:{
        type:String,
        required:true
    },
    subscription_id:{
        type:String,
        required:true
    },
    signature:{
        type:String,
        required:true
    }

},{
    timestamps:true
})

const Payment = model('Payment', paymentSchema)

export default Payment