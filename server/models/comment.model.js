import mongoose,{ Schema } from "mongoose";

const commentSchema=new Schema({
    courseId:{
        type:Schema.Types.ObjectId,
        ref:'courses',
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'users'
    },
    comment:{
        type:String,
        required:true,
        min:[2,"Comment must be greater than 2 characters"],
        max:[200,"Comment must be smaller than 200 characters"]
    },
    commented_by:{
        type:Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    isReply:{
        type:Boolean,
        default:false
    },
    parent:{
        type:Schema.Types.ObjectId,
        ref:'comments'
    },
    children:{
        type:[Schema.Types.ObjectId],
        ref:'comments'
    }
},{
    timestamps:true
})

const Comment=mongoose.model('Comment',commentSchema)

export default Comment