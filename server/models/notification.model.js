import {Schema , model} from "mongoose";

const notificationSchema=new Schema({
    type:{
        type:String,
        enum:['like','comment','reply'],
        required:true
    },
    from:{
        type:Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    to:{
        type:Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: 'comments'
    },
    reply: {
        type: Schema.Types.ObjectId,
        ref: 'comments'
    }, 
    replied_on_comment:{
        type: Schema.Types.ObjectId,
        ref: 'comments'
    },
    seen: {
        type: Boolean,
        default: false
    }
},
{
    timestamps:true
})

const Notification= model("Notification",notificationSchema);

export default Notification;