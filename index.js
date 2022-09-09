const express = require('express');
const app = express();
const cors = require('cors');
const braintree = require('braintree');


// braintree
app.use(cors({origin: 'http://localhost:3000'}));
app.use(express.json());

// braintree
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    // res.header("Access-Control-Allow-Methods", "GET", "POST", "DELETE")
    next();
});



const config = {
    environment:braintree.Environment.Sandbox,
    merchantId: process.env.merchantId,
    publicKey: process.env.publicKey,
    privateKey: process.env.privateKey
    
};



const gateway = new braintree.BraintreeGateway(config)

app.get('/tokenGenerate', async(req, res)=>{
    try {
        gateway.clientToken.generate({}, (err, resdata)=>{
          if(err){
              return res.send({'error':err})
          }else{
              console.log(resdata)
              return res.json({'status':'success', 'message':resdata.clientToken})
          }
        })
        
    } catch (error) {
        return res.json({'status':'failed', 'message':error.message})
    }
})




app.post('/transaction', async(req, res)=>{
     try {
         const paymentDetail = gateway.transaction.sale({
             amount: req.body.amount,
             paymentMethodNonce: req.body.paymentMethodNonce,
            //  deviceData: req.body.deviceData,
             options: {
                 submitForSettlement: true
             }
         },(err, resData)=>{
             if(resData.success){
                console.log('resData',resData.transaction.id)
                 return res.json({'status':'success', 'message':resData.transaction})
                
             }else{
                return res.send({err:err})
             }
        })
    } catch (error) {
         return res.json({'status':'failed', 'message':error.message})
         
     }
})



// app.post('/refund', async(req, res)=>{
//     try {
//         const paymentDetails = gateway.transaction.submitForPartialSettlement(
//             'transaction_id',
//             'cancellation_fees',
//             (err, resData)=>{
//                 if(resData.success){
//                     return res.json({'status':'success', 'message':resData.transaction})
//                 }else{
//                     return res.send({err:err})
//                 }
//             }
//         )

//     } catch (error) {
//         return res.json({'status':'failed', 'message':error.message})
        
//     }
// })



app.listen(7070, ()=>{
    console.log("Started...")
})

//http://localhost:7070
