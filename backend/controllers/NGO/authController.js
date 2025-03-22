import ngo from "../../models/ngo.js";
import bcrypt from "bcrypt";
import organizationModel from "../../models/organizationModel.js.js";

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
