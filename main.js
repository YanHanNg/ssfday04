const { urlencoded } = require('express');
const express = require('express');
const hbs = require('express-handlebars');

//Express
const app = express();

app.engine('hbs', hbs({ defaultLayout: 'default.hbs'}));
app.set('view engine', 'hbs');

//Configure urlencoded and application json if needed(To Read POST Payload)
//app.use(express.urlencoded({ extended: true }));
//app.use(express.json());

//Configure PORT
const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000;

//Render /
app.get('/', (req, res) => {
    const cart = [];
    res.status(200);
    res.type('text/html');
    res.render('shoppingcart', {
        cartState: JSON.stringify(cart)
    });
})

app.post('/addShoppingCart',
    express.urlencoded({ extended: true }),
    (req, res) => {

    console.log(req.body.cartState);
    let shoppingCart = JSON.parse(req.body.cartState);

    if(shoppingCart.length > 0)
    {
        const updateCart = shoppingCart.filter( d => {
            if(d.item === req.body.item)
            {
                console.log('Updating');
                d.qty = parseInt(req.body.qty) + parseInt(d.qty),
                d.price = parseInt(d.price) + (parseInt(req.body.qty) * parseInt(req.body.unitPrice))
                return d;
            }
        })

        if(updateCart.length === 0)
        {
            shoppingCart.push({
                no: shoppingCart.length + 1,
                item: req.body.item,
                qty: req.body.qty,
                price: parseInt(req.body.qty) * parseInt(req.body.unitPrice)
            })
        }
    } 
    else
    {
        shoppingCart.push({
            no: shoppingCart.length + 1,
            item: req.body.item,
            qty: req.body.qty,
            price: parseInt(req.body.qty) * parseInt(req.body.unitPrice)
        })
    }   
    
    res.status(201);
    res.type('text/html');
    res.render('shoppingcart', {
        shoppingCart,
        cartState: JSON.stringify(shoppingCart)
    })
})

app.use(express.static(__dirname + '/public'));

//Configure Server
app.listen(PORT, ()=> {
    console.info(`Server Started on PORT ${PORT} at ${new Date()}`);
})
