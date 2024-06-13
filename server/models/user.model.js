import {Schema , model} from 'mongoose'

const userSchema=new Schema({
    fullName:{
        type:String,
        required:[true,"Name is required"],
        minLength:[2,"Name must be grater than 2 characters"],
        minLength:[30,"Name must be less than 30 characters"],
        lowercase:true,
        trim:true
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        lowercase:true,
        trim:true,
        match:[
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Enter a valid email address'
        ]
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minLength:[8,"Password must be grater than 8 characters"],
        maxLength:[100,"Password must be less than 100 characters"],
        select:false
    },
    avatar:{
        public_id:{
            type:String
        },
        secure_url:{
            type:String
        }
    },
    role:{
        type:String,
        enum:['USER','ADMIN'],
        default:'USER'
    },
    forgotPasswordToken:String,
    forgotPasswordTokenExpiry:Date
},{
    timestamps:true
})

const User = model('User',userSchema)

export default User