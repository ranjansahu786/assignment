const mongoose=require('mongoose')
const validator=require('validator')


//creating document schema 
const documentSchema=new mongoose.Schema({
    document_version:{
        type:Number,
        required:true
    },
    remarks:{
        type:String,
        required:true,
        trim:true
    },
    contributor:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
        ref:'Contributor'
    }
},{
        timestamps:true
})


const Document=mongoose.model('Document',documentSchema)
module.exports=Document
