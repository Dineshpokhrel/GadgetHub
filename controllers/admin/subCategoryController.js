const { Request, Response } = require('express');
const Category = require('../../models/category');
const SubCategory = require('../../models/subcategory');
const { unlinkFile } = require('../../utils/file');

const getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find()
      .sort({ "_id": -1 })
      .populate("category", "_id name")
      .lean();

    res.status(200).json({
      data: subCategories,
      status: true,
      message: "Subcategory successfully retrieved.",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, message: "Something went wrong." });
  }
};

const getSubCategoriesOfCategory = async (req, res) => {
  try {
    const subCategories = await SubCategory.find({
      "category": req.params.id,
    })
      .sort({ "_id": -1 })
      .populate("category", "_id name")
      .lean();

    res.status(200).json({
      data: subCategories,
      status: true,
      message: "Subcategory successfully retrieved.",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, message: "Something went wrong." });
  }
};

const addSubCategory = async (req, res) => {
  try {
    const { name, description, image, category, status } = req.body;
    const subCategory = await SubCategory.create({ name, description, image, category, status });

    const cat = await Category.findByIdAndUpdate(
      category?._id, {
      $push: {
        subcategory: subCategory
      }
    }, { new: true }
    ).select("name");

    subCategory.category = cat;

    return res.status(201).json({ status: true, data: subCategory, message: "Subcategory successfully created." });
  } catch (error) {
    
    console.error("add error", error);
    if (error.message && error.message.includes("duplicate key error collection")) {
      return res.status(400).json({ status: false, message: "Subcategory with duplicate name." });
    }
    return res.status(400).json({ status: false, message: "Something went wrong while creating subcategory." });
  }
};

//  exports.updateSubcategory = async (req, res) => {
//   try {
//     const { name, description, category, status } = req.body;
//     const subcategory = await SubCategory.findById(req.params.id).exec();

//     console.log(subcategory);
//     if (subcategory) {
//       const newSubCategory = await SubCategory.findByIdAndUpdate(req.params.id, { name, description, category, status }, { new: true })
//         .populate("category", "_id name");

//       if (subcategory?.category._id !== newSubCategory?.category?._id) {
//         await Category.findByIdAndUpdate(subcategory?.category._id, {
//           $pull: {
//             subcategory: subcategory?._id,
//           }
//         });
//         await Category.findByIdAndUpdate(category?._id, {
//           $push: {
//             subcategory: subcategory?._id,
//           }
//         });
//       }
//       res.status(200).json({
//         status: true, message: "Subcategory successfully updated.", data: newSubCategory
//       });
//       return;
//     }
//     res.status(404).json({ status: false, message: "Subcategory not found." });

//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ status: false, message: "Something went wrong when updating Subcategory." });
//   }
// };

exports.updateSubcategory =  function(req, res) {
  return  res.json({ message:"Hi"}) ;
}

const deleteSubcategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.findByIdAndDelete(req.params.id);
    if (subCategory) {
      // try{
      //     if(subCategory.image){
      //         const filePath=subCategory.image.substring(1);
      //         unlinkFile(filePath);
      //     }

      // }
      // catch(error){
      //     console.error(error);
      // }

      await Category.findByIdAndUpdate(subCategory.category, {
        $pull: {
          subcategory: subCategory._id
        }
      }).exec();
      return res.status(200).json({
        status: true, data: subCategory, message: "Subcategory successfully deleted."
      });
    }
    else {
      return res.status(404).send({
        status: false, message: "Subcategory not found",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: false, message: "Something went wrong when trying to delete." });
  }
};

// module.exports = {
//   getSubCategories,
//   getSubCategoriesOfCategory,
//   addSubCategory,
//   updateSubcategory,
//   deleteSubcategory
// };
module.exports = {
  getSubCategories,
  getSubCategoriesOfCategory,
  addSubCategory,
  deleteSubcategory
};
