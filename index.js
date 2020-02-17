const express=require('express')

const contributor_router=require('./src/routers/contributor_router')
const document_router=require('./src/routers/document_router')
require('./src/db/mongoose')


const port=process.env.PORT
const app=express() 

app.use(express.json())
app.use(contributor_router)
app.use(document_router)
app.listen(port,()=>{
    console.log('Server is on at port '+port)
})