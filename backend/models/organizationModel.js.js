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
            required:true
        },
        Email:{
            type:String,
            required:true
        }
    },
    password:{
        type:String,
        required:true
    }
})

export default mongoose.model("Organization",organizationSchema);