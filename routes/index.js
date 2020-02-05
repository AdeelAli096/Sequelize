const cors = require('cors');
const bodyParser = require('body-parser');
//route controller
const users = require('./Controllers/users');
const products = require('./Controllers/products');
const admin = require('./Controllers/admin');
const commonBLL = require('./BLL/commonBLL');
const adminBLL = require('./BLL/adminBLL');
const verifyToken = require('../util/verifyToken');


exports = module.exports = (app) => {
    try {
        // middlewares
        //bodyParser as a parsing middleware
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
        //CORS
        app.use(cors());

        // middleware to use for all requests
        // app.use(function (req, res, next) {
        //     console.log('middleware going on...');
        //     next();
        // });
        // Test server is runing endpoint
        app.get("/", (req, res) => {
            res.end("ok")
        });
      // admin login
      app.post('/api/login', adminBLL.validateLoginFields, admin.login);
      // create admin
      app.post("/api/createAdmin", commonBLL.validateFields, admin.createAdmin);
      // token validator
      app.get("/api/validate-token", verifyToken, admin.validateToken);
       
        // customers crud
        app.get('/api/users', verifyToken, users.all);
        app.post('/api/users', verifyToken, users.create);
        app.delete('/api/users/:id', verifyToken, users.delete);
        app.get('/api/users/:id', verifyToken, users.getOne);
        app.put('/api/users/:id', verifyToken, users.update);

        //products 
        app.get('/api/products', verifyToken, products.all);
        app.get('/api/products/:userId', verifyToken, products.getByUserId);
        app.post('/api/products', verifyToken, products.create);
        app.delete('/api/products/:id', verifyToken, products.delete);
        //app.get('/api/products/:id', verifyToken, products.getOne);
        app.put('/api/products/:id', verifyToken, products.update);

    } catch (e) {
        console.log("across api catch err", e);
    }
};