import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new Schema(
    {
        name: { type: String, required: false },
        email: { type: String, required: true, unique: true, index: true },
        avatar:String,
        password: { type: String , sparse:true },
        role: { type: String, required: true, enum: ["admin", "user" , "superadmin"], default: 'user' },
        yearOfGraduation:{type:String, default:""},
        specialisation:{type:String,default:0},
        program:{type:String, default:""},
        university:{type:String , default: ""},
        semester:{type:String,default:""},
        phone:{type:String, default:""},
        rankId:{
            type:String,
            default:"",
            ref:'Rank'
        },
        profileCompleted: { type: Boolean, default: false },
        
        isVerified:{type:Boolean , default:false},
        verificationToken: { type: String },

        googleId:String,

       
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    try {
        if(!this.password) next();
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        this.email =  this.email = this.email.toLowerCase();
        next();
    } catch (err) {
        next(err);
    }
});



const Users = model("Users", userSchema);

export default Users;
