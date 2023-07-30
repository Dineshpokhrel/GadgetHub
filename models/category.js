const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const { Schema } = mongoose;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    slug: {
        type: String,
        slug: 'name',
        unique: true,
        index: true,
    },
    description: String,
    image: String,
    subcategory: [
        {
            type: Schema.Types.ObjectId,
            ref: 'SubCategory',
        }
    ],
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

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
