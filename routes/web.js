const router = require('express').Router()
const {Home,Homepost, webcreate,createacc, checkuserexists, homemiddleware, gethome,logout}=require('../views/web')
router.get('/',Home)
router.post('/',Homepost)   
router.get('/create',webcreate)
router.post('/createacc',checkuserexists,createacc)
router.get('/home',homemiddleware,gethome)
router.get('/logout',logout)
module.exports=router
