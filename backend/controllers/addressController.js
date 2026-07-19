const Address = require("../models/Address");

// Add New Address
const addAddress = async (req, res) => {
  try {
    const {name,mobile,house,area,landmark,city,state,pincode,country,isDefault} = req.body;

    // Agar new address default hai to purane default ko hata do
    if (isDefault) {
      await Address.updateMany(
        { user: req.user.id },
        { $set: { isDefault: false } }
      );
    }

    const address = await Address.create({user: req.user.id,name,mobile,house,area,
      landmark,city,state,pincode,country,isDefault,});

    res.status(201).json({
      success: true,
      message: "Address Added Successfully",
      address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Addresses
const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({
      user: req.user.id,
    }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Address
const updateAddress = async (req, res) => {
  try {
    const {
      name,
      mobile,
      house,
      area,
      landmark,
      city,
      state,
      pincode,
      country,
      isDefault,
    } = req.body;

    if (isDefault) {
      await Address.updateMany(
        { user: req.user.id },
        { $set: { isDefault: false } }
      );
    }

    const address = await Address.findOneAndUpdate(
      {_id: req.params.id,user: req.user.id},

      {name,mobile,house,area,landmark,city,state,pincode,country,isDefault},

      {new: true}

    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address Updated Successfully",
      address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Address
const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {addAddress,getAddresses,updateAddress,deleteAddress};