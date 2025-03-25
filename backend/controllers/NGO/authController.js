import ngo from "../../models/ngo.js";
import bcrypt from "bcrypt";
import organizationModel from "../../models/organizationModel.js.js";
import jwt from "jsonwebtoken";

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

    /* // Generate JWT token
    const payload = { registrationNumber: org.RegistrationNumber, id: newOrganization._id };
    const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "48h" });
 */
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
                profile_picture: org.profile_picture
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
  if (!req.org) {
    return res.status(403).json({ message: "User not authenticated" });
  }
  res.status(200).json({ message: "Org found", org: req.org });

}


//update organization

export async function updateOrganization(req, res) { 
  try {
    const { id } = req.params;
   
    const profile_picture = req.files?.profile_picture?.[0]?.path || null;

    // Check if the organization exists
    const org = await organizationModel.findById(id);
    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Update the organization details
    if (profile_picture) org.profile_picture = profile_picture;

    await org.save();

    res.status(200).json({ message: "Organization updated successfully", org });
  } catch (error) {
    console.error("Error updating organization:", error);
    res.status(500).json({ message: "Error updating organization" });
  }
}