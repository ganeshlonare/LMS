import {model,Schema} from 'mongoose'

const courseSchema=new Schema({
    title:{
        type:String,
        required:[true,'title is required '],
        minLength:[8,'Title must be atleast 8 characters'],
        maxLength:[60,'Title should be less than 60 characters'],
        trim:true
    },
    description:{
        type:String,
        required:[true,'Description is required '],
        minLength:[8,'Title must be atleast 8 characters'],
        maxLength:[200,'Title should be less than 60 characters']
    },
    category:{
        type:String,
        required:[true,"Category is required"]
        
    },
    thumbnail:{
        public_id:{
            type:String,
            
        },
        secure_url:{
            type:String,
          
        }

    },
    lectures:[
        {
            title:String,
            description:String,
            lecture:{
                public_id:{
                    type:String
                },
                secure_url:{
                    type:String
                }
            }
        }
    ],
    NumberOfLectures:{
        type:Number,
        default:0
    },
    createdBy:{
        type:String,
        required:true
    },
    createdById:{
        type:String,
        required:true
    },
},{
    timestamps:true
})

const Course=model('Course',courseSchema)

export default Course