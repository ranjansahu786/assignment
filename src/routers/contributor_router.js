const express = require('express')
const Contributor = require('../models/contributor')
const auth = require('../middleware/auth')

const router = new express.Router()

//Requesting to create new Contributor 
router.post('/contributor', async (req, res) => {
    try {
        const contributor = new Contributor(req.body)
        await contributor.save()
        const token=await contributor.generateAuthToken()
        res.send({contributor,token})
    } catch (e) {
        res.send(e)
    }
})

//loging in as existing contributor
router.post('/login', async (req, res) => {
    try {
        const contributor1 = await Contributor.findByCredentials(req.body.Email, req.body.password)
        const token = await contributor1.generateAuthToken()
        res.send({ contributor1, token })
    } catch (error) {
        res.status(400).send(error)
    }

})


//reading the contributor profile
router.get('/contributor/me',auth,async (req,res)=>{
    try{
        res.send(req.contributor)
    }catch(e){
        res.status(500).send(e)
    }
})


//updating the contributor profile
router.patch('/contributor/update', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedupdates = ['Email', 'Role', 'location', 'password', 'Concerned_poC']
    const isvalidupdate =
        updates.every((update) => {
            return allowedupdates.includes(update)
        })
    if (!isvalidupdate) {
        res.status(400).send('Invalid Operation!!')
    }
    try {
        updates.forEach((update) => {
            req.contributor[update] = req.body[update]
        })
        await req.contributor.save()
        res.send(req.contributor)
    } catch (e) {
        res.status(500).send('error'+e)
    }
})



//loging out from one device 
router.post('/logout',auth,async (req,res)=>{
    try{
        req.contributor.tokens=req.contributor.tokens.filter((token)=>{
            return token.token!==req.token
        })
        await req.contributor.save()
        res.send(req.contributor)
    }catch(e){
        res.status(500).send(e)
    }
})


//loging out from all the devices 
router.post('/logoutall',auth,async(req,res)=>{
    try{
        req.contributor.tokens=[]
        await req.contributor.save()
        res.send(req.contributor)
    }catch(e){
        res.status(500).send(e)
    }
    
})

//deleting the contributor account
router.delete('/contributor/delete',auth,async (req,res)=>{
    try{
        const contributor=await req.contributor.remove()
        res.send(contributor)
    }catch(e){
        res.status(500).send('cannot delete contributor')
    }
})


module.exports = router