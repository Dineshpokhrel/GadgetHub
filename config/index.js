// import * as dotenv from 'dotenv';
const dotenv = require('dotenv');

dotenv.config();

const config={
    app:{
        NAME:process.env.APP_NAME || 'api',
        ENV:process.env.NODE_ENV || 'dev',
        PORT:process.env.PORT || 3000,
        API_URL:process.env.API_URL || 'http://localhost:5000',
        MONGO_URI:process.env.MONGO_URI || "mongodb+srv://dinesh:dinesh123@dinesh.tfbmsg5.mongodb.net/gadgetHub?retryWrites=true&w=majority",
    },
    
    jwt:{
        SECRET:process.env.JWT_SECRET || "lfakjfslfkaslkdfjlksjfsfdskfjls",
        ISSUER:process.env.JWT_ISSUER || 'Gadget',
        TOKEN_TTL:process.env.JWT_TOKEN_TTL || "1d",
    },
    
    mail:{
        api_key:process.env.SENDER_API_KEY || "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"
    }
}


module.exports = config;

// export default config;