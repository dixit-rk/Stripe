const express=require('express')
const stripe=require('stripe')(process.env.key);
const fs=require('fs');
const StripeHtml=fs.readFileSync('./stripeHtml.html')

const app=express();

const checkOut=async(req,res)=>{

    const product=await stripe.products.create({
        name:'BMW Pencil'
    })

    const price=await stripe.prices.create({
        product:product.id,
        unit_amount:100,
        currency:'inr',
    })

    const session = await stripe.checkout.sessions.create({
        line_items: [
          {
          
            price: price.id,
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/success`,
        cancel_url: `${req.protocol}://${req.get('host')}/cancel`,
      });

      res.redirect(303, session.url);
}


app.get('/payment',(req,res)=>{
    res.end(StripeHtml)})

app.post('/checkOut',checkOut)
app.get('/success',(req,res)=>{
    res.end('<h1>Success<h1>')})
app.get('/fail',(req,res)=>{
    res.end('<h1>Fail<h1>')})


app.listen(3000,(err)=>{
    console.log('stripe server is listening')
})

