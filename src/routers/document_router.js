const express = require('express')
const Document = require('../models/document')
const auth = require('../middleware/auth')

const router = new express.Router()

//Requesting to create document 
router.post('/document', auth, async (req, res) => {
    try {
        const document1 =new Document({
            ...req.body,
            contributor: req.contributor.id
        })
        await document1.save()
        res.send(document1)
    } catch (e) {
        res.send(e)
    }
})

//to update the document
router.patch('/document/update',auth,async (req,res)=>{
    const updates=Object.keys(req.body)
    const allowedupdates=['remarks','document_version']
    const isvalidoperation=updates.every((update)=>{
        return allowedupdates.includes(update)
    })
    if(!isvalidoperation){
        res.send('Invalid operation!!!')
    }
    try{
        const document=await Document.findOne({contributor:req.contributor._id})
        if(!document){
            res.status(404).send('Document not Found!')
        }
    updates.forEach((update)=>{
        document[update]=req.body[update]
    })
    document.save()
    res.send(document)
    }catch(e){
        res.status(500).send('error'+e)
    }
})

// Read the document of authorized contributor
router.get('/document/me',auth,async (req,res)=>{
    try{
        await req.contributor.populate({
            path:'documents',
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip)
            } 
        }).execPopulate()        
        res.send(req.contributor.documents)
    }catch(e){
        res.status(500).send('error'+e)
    }
   
})

//delete the specific document by their ID
router.delete('/document/delete/:id',auth,async (req,res)=>{
    try{
        const document=await Document.findByIdAndDelete(req.params.id)
        if(!document){
            res.status(404).send('no document exist')
        }
        res.send(document)
    }catch(e){
        res.status(501).send('error'+e)
    }

})


module.exports = router