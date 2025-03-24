import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({
    SNo:{
        type:Number,
        required:true
    },
    FileNo:{
        type:Number,
        required:true
    },
    NameOfOrganization:{
        type:String,
        required:true
    },
    RegistrationNumber:{
        type:String,
        required:true
    },
    Address:{
        type:String,
        required:true
    },
    KeyContactPerson:{
        Name:{
            type:String,
            required:true
        },
        PhoneNumber:{
            type:String,
            required:true
        }
    },
    ContactDetails:{
        Landline:{
            type:String,
            required:false
        },
        Email:{
            type:String,
            required: true,
            unique: true,  // Ensure uniqueness for the email
            lowercase: true // Store email in lowercase
        }
    },
    password:{
        type:String,
        required:true
    },
    role: {
        type: String,
        required: true,
        default: 'organization'
    }
})

export default mongoose.model("Organization",organizationSchema);