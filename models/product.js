const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const { Schema } = mongoose;

const productSchema = new Schema({
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
    summary: {
        type: String,
        required: false,
        maxLength: 250,
    },
    description: String,
    price: {
        type: Number,
        default: 0.0,
    },
    discount: {
        type: Number,
        default: 0.0,
    },
    priceAfterDiscount: {
        type: Number,
        default: 0.0,
    },
    images: [String],
    thumbnailImage: {
        type: String,
        required: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
    },
    subcategory: {
        type: Schema.Types.ObjectId,
        ref: 'SubCategory',
    },
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'Brand',
    },
    quantity: {
        type: Number,
        default: 10,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
