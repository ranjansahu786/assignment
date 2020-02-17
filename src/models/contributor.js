const validator = require('validator')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Document=require('./document')

//creating Schema for Contributor account
const contributorSchema = new mongoose.Schema({
    Concerned_poC: {
        type: String,
        required: true,
        trim: true
    },
    Email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('provided email is invalid!')
            }
        }
    },
    Role: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        validate: function (value) {
            const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/
            return regex.test(value)
        }
    },
    location:{
        type: String,
        required:true
    },
    tokens: [{
        token: {
            required:true,
            type:String
        }
    }]
})
contributorSchema.virtual('documents',{
    ref:'Document',
    localField:'_id',
    foreignField:'contributor'
})
//method to generate token 
contributorSchema.methods.generateAuthToken = async function(){
    const contributor=this 
    const _id=contributor._id.toString()
    const token= jwt.sign({_id},process.env.JWT_SECRET)
    contributor.tokens=contributor.tokens.concat({token})
    await contributor.save()
    return token
    
}

//method to login as a user
contributorSchema.statics.findByCredentials = async (Email, password) => {
    const contributor = await Contributor.findOne( {Email} )
    if (!contributor) {
        throw new Error('unable to find contributor')
    }
    const ismatch = await bcrypt.compare(password, contributor.password)
    if (!ismatch) {
        throw new Error('please provide correct id and password!!')
    }
    return contributor
}

//Encrypting password through hash function
contributorSchema.pre('save', async function (next) {
    const contributor = this
    if (contributor.isModified('password')) {
        contributor.password = await bcrypt.hash(contributor.password, 8)
    }
    next()
})


//deleting all documents related to contributor before removing 
//the account of contributor
contributorSchema.pre('remove',async function(next){
    try{
        const contributor=this
        Document.deleteMany({contributor:contributor._id})
        next()
    }catch(e){
        throw new Error('cannot remove document')
    }
    
})


const Contributor = mongoose.model('Contributor', contributorSchema)
module.exports = Contributor