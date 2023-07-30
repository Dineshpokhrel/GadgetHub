const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const { Schema } = mongoose;

const brandSchema = new Schema({
  name: {
    type: String,
    unique: true,
    index: true,
    required: true,
  },
  slug: {
    type: String,
    slug: 'name',
    unique: true,
    index: true,
  },
  logo: String,
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
}, { timestamps: true });

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
