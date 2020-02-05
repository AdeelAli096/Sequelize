const db = require("../../models");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const config = require("../../config/config.json");

const productsController = {

    //creating products 
    create: async (req, res) => {
        const response = {};
        let { productName, price, userId } = req.body;
        //let {  id: adminId } = req.decoded;
        db.products.create({

            productName: productName,
            price: price,
            userId: userId,
            
        }).then(async ress => {
            response.statusCode = 200;
            response.body = JSON.stringify({
                message: 'Products has been created',
                data: ress,
                
            }
            );
            await res.status(response.statusCode).send(response.body);
        }).catch(err => {
            console.log("err", err);
            response.statusCode = 500;
            response.body = JSON.stringify({ "errors: ": err });
            res.status(response.statusCode).send(response.body);
        })
    },
    //deleting one product details by id
    delete: async (req, res) => {
        let response = {};
        db.products.destroy({
            where: {
                id: req.params.id
            }
        }).then(async () => {
            response.statusCode = 200;
            response.body = JSON.stringify({
                message: 'product deleted',
                

            });
            res.status(200).send(response.body);

        })
            .catch(err => {
                response.statusCode = 500;
                response.body = JSON.stringify({ err });
                res.status(response.statusCode).send(response.body);
            });

    },
    //getting one product details by id
    getOne: async (req, res) => {
        
        const response = {};
        if ("undefined" !== req.params.id) {

            db.products.findOne({
                attributes: ['productName', 'price', 'userId'],
                where: { [Op.and]: [{ id: req.params.id }] }
            }).then(data => {
                response.statusCode = 200;
                response.body = JSON.stringify(
                    {
                        message: "ok",
                        data: data
                    }
                );
                res.status(response.statusCode).send(response.body);

            }).catch(err => {
                console.log("error", err);
                response.statusCode = 500;
                response.body = JSON.stringify({ err });
                res.status(response.statusCode).send(response.body);
            })
        }
    },
    //getting  all products 
    all: async (req, res) => {
        let { page, limit } = req.query;
        page = page ? parseInt(page) : 1;         //pagination
        limit = limit ? parseInt(limit) : 10;
        let response = {};
        db.products.findAndCountAll({
            attributes: ['id', 'productName', 'price', 'userId'],
           
            order: [['id', 'ASC']], // sorting fields by ascending and descending order
            offset: (page - 1) * limit, //declaring offset
            limit: limit
        }).then(async result => {
            response.statusCode = 200;
            response.body = JSON.stringify({
                success: true,
                products: await result.rows,
                totalProducts: await result.count,
                totalPages: await (parseInt((result.count / limit)) + 1),    //no of total pages
                currentPage: await page
            });
            res.status(response.statusCode).send(response.body);
        })
            .catch(err => {
                response.statusCode = 500;
                response.body = JSON.stringify({ err });
                res.status(response.statusCode).send(response.body);
                console.log(err);
            
            });
       
    },
    //updating information of a product by id
    update: async (req, res) => {
        const response = {};

        let { id } = req.params;

        try {
            let data = {};
            data["productName"] = req.body.productName;
            data["price"] = req.body.price;
            data["userId"] = req.body.userId;

            await db.products.update(data, {
                where: {
                    id
                }
            }).then(async data => {
                response.statusCode = 200;
                response.body = JSON.stringify({
                    message: 'product has been updated',
                    data: data

                });
                await res.status(response.statusCode).send(response.body);
            })
                .catch(err => {
                    response.statusCode = 506;
                    response.body = JSON.stringify({ err });
                    res.status(response.statusCode).send(response.body);
                });
        } catch (err) {
            response.statusCode = 500;
            response.body = JSON.stringify({ err });
            res.status(response.statusCode).send(response.body);
        }
    },
    //getting  all products by user id
    getByUserId: async (req, res) => {
        let { page, limit } = req.query;
        page = page ? parseInt(page) : 1;         //pagination
        limit = limit ? parseInt(limit) : 10;
        let response = {};
        db.products.findAndCountAll({
            
            attributes: ['id','userId', 'productName', 'price'],
            where: {    userId: req.params.userId },
            order: [['id', 'ASC']], // sorting fields by ascending and descending order
            offset: (page - 1) * limit, //declaring offset
            limit: limit
        }).then(async result => {
            response.statusCode = 200;
            response.body = JSON.stringify({
                success: true,
                products: await result.rows,
                totalProducts: await result.count,
                totalPages: await (parseInt((result.count / limit)) + 1),    //no of total pages
                currentPage: await page
            });
            res.status(response.statusCode).send(response.body);
        })
            .catch(err => {
                response.statusCode = 500;
                response.body = JSON.stringify({ err });
                res.status(response.statusCode).send(response.body);
                console.log(err);
            
            });
       
    }
    
}
module.exports = productsController;