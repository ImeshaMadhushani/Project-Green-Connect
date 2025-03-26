import ngo from "../../models/ngo.js";
import bcrypt from "bcrypt";
import organizationModel from "../../models/organizationModel.js.js";
import jwt from "jsonwebtoken";

import nodemailer from 'nodemailer';


export const authController = async (req, res) => {
  try {
    const { registrationNumber, password, conformPassword } = req.body;

    // Validate input fields
    if (!registrationNumber || !password || !conformPassword) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    console.log(registrationNumber)
    // Find the NGO by RegistrationNumber
    const org = await ngo.findOne({ RegistrationNumber: registrationNumber });
    console.log(org)

    if (!org) {
      return res.status(400).json({ message: "Organization not found" });
    }

    // Check if passwords match
    if (password !== conformPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if the organization already exists in organizationModel
    const existingOrg = await organizationModel.findOne({ RegistrationNumber: registrationNumber });

    if (existingOrg) {
      return res.status(400).json({ message: "Organization already registered" });
    }

    // Create new organization entry in organizationModel
    const newOrganization = new organizationModel({
      SNo: org.SNo,
      FileNo: org.FileNo,
      NameOfOrganization: org.NameOfOrganization,
      RegistrationNumber: org.RegistrationNumber,
      Address: org.Address,
      KeyContactPerson: {
        Name: org.KeyContactPerson.Name,
        PhoneNumber: org.KeyContactPerson.PhoneNumber,
      },
      ContactDetails: {
        Landline: org.ContactDetails.Landline,
        Email: org.ContactDetails.Email,
      },
      password: hashedPassword, // Store the hashed password
    });

    // Save the new organization
    await newOrganization.save();

    res.status(201).json({
      success: true,
      message: "Organization registered successfully",
     /*  token, */
     data:newOrganization
    });

  } catch (error) {
    console.error("Error in NGO authentication:", error);
    res.status(500).json({
      success: false,
      message: "Error in NGO authentication",
      error: error.message,
    });
  }
};




export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    

    const org = await organizationModel.findOne({ "ContactDetails.Email": email.toLowerCase() });
    console.log("Searching for organization with email:", email.toLowerCase());

    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }

    console.log("Found organization:", org); 

    const isPasswordValid = await bcrypt.compare(password, org.password);

    console.log("Email:", email);
    console.log("Password check result:", isPasswordValid);


    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }


    const payload = {
                id: org._id,
                name: org.NameOfOrganization,
                email: org.ContactDetails.Email,
                role: org.role,
                profile_picture: org.profile_picture,
                regNo: org.RegistrationNumber,
                
            };
            const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '48h' });
    return res.json({ message: "Organization logged in successfully!", org, token });

  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Server error" });
  }
}


//get organization
export const getOrganization = async (req, res) => {
  try {
    if (!req.org) {
      return res.status(403).json({ message: "User not authenticated" });
    }

    res.status(200).json({ message: "Org found", org: req.org });
  } catch (error) {
    console.error("Error fetching organization:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//get all organizations
export const getAllOrganizations = async (req, res) => {
  try {
    const organizations = await organizationModel.find(); // Fetch all organizations
    if (!organizations.length) {
      return res.status(404).json({ message: "No organizations found" });
    }

    res.status(200).json({ message: "Organizations found", org: organizations });
  } catch (error) {
    console.error("Error fetching organizations:", error);
    res.status(500).json({ message: "Server error" });
  }
};


//update organization

export async function updateOrganization(req, res) { 
  try {
    const { id } = req.params;
    const { email } = req.body;

    const profile_picture = req.files?.profile_picture?.[0]?.path || null;

    // Check if the organization exists
    const org = await organizationModel.findById(id);
    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Update the organization details
    if (profile_picture) org.profile_picture = profile_picture;
    if (email) org.ContactDetails.Email = email;

    await org.save();

    res.status(200).json({ message: "Organization updated successfully", org });
  } catch (error) {
    console.error("Error updating organization:", error);
    res.status(500).json({ message: "Error updating organization" });
  }
}


// Forgot Password - Request OTP -Organization
export async function forgotPassword(req, res) {
  const { email } = req.body;
  console.log("Email:", email);  // Add this line to check email value


    try {
      const user = await organizationModel.findOne({ "ContactDetails.Email": email.toLowerCase() });

        if (!user) {
            return res.status(404).json({ message: 'Email not found' });
        }

        // Generate OTP
      const otp = Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit OTP


        // Set OTP expiration time (e.g., 10 minutes)
        const otpExpires = Date.now() + 10 * 60 * 1000;  // 10 minutes expiration

        user.passwordResetOtp = otp;
        user.passwordResetOtpExpires = otpExpires;
        await user.save();

        // Send OTP to user's email using nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL, // Your email
                pass: process.env.EMAIL_PASSWORD, // Your email password
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                return res.status(500).json({ message: "Error sending OTP email", errorDetails: error.response || error.message, });
            }
            res.status(200).json({ message: "OTP sent to email" });
        });
    } catch (error) {
        console.error("Error during forgot password:", error);
        res.status(500).json({ message: "Error processing request", error: error.message });
    }
}


// Verify OTP
export async function verifyOtp(req, res) {
  try {
    console.log("Request body:", req.body);

    const { email, otp } = req.body || {}; // Ensure `req.body` exists

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    console.log("Received email for OTP verification:", email);

    

    const user = await organizationModel.findOne({ "ContactDetails.Email": email.toLowerCase() });
    console.log("Found user:", user);
    if (!user) {
            return res.status(404).json({ message: "Email not found" });
        }

        if (!user.passwordResetOtp || !user.passwordResetOtpExpires) {
            return res.status(400).json({ message: "No OTP found. Request a new one." });
        }

        if (user.passwordResetOtp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (user.passwordResetOtpExpires < Date.now()) {
            return res.status(400).json({ message: "OTP has expired" });
        }

        res.status(200).json({ message: "OTP verified successfully" });

    } catch (error) {
        console.error("Error during OTP verification:", error);
        res.status(500).json({ message: "Error verifying OTP", error: error.message });
    }
}



// Reset Password
export async function resetPassword(req, res) {
    const { email, password, otpCode } = req.body;

    if (!email || !password || !otpCode) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }


    try {
        const user = await organizationModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Email not found' });
        }

        // Validate OTP and check expiry
        if (user.passwordResetOtp !== otpCode) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (user.passwordResetOtpExpires < Date.now()) {
            return res.status(400).json({ message: 'OTP has expired' });
        }

        // Hash new password
        const saltRound = 10;
        const hashedPassword = await bcrypt.hash(password, saltRound);

        user.password = hashedPassword;
        user.passwordResetOtp = undefined;  // Clear OTP field
        user.passwordResetOtpExpires = undefined;  // Clear OTP expiration field
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });

    } catch (error) {
        console.error("Error during password reset:", error);
        res.status(500).json({ message: "Error resetting password", error: error.message });
    }
}
