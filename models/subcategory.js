const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const { Schema } = mongoose;

const subCategorySchema = new Schema({
    name: {
        type: String,
        unique: true,
        index: true,
        required: true,
    },
    slug: {
        type: String,
        slug: 'name',
        index: true,
        unique: true,
    },
    description: String,
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product',
        }
    ],
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    }
}, { timestamps: true });

const SubCategory = mongoose.model('SubCategory', subCategorySchema);

module.exports = SubCategory;
