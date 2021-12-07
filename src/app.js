require("./db/mongoose");
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const Customer = require("./models/customer");
const Account = require("./models/account");
const Transaction = require("./models/transaction");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/api/customer", async function (req, res) {
    
    try {
        if(!req.body.name || !req.body.address || !req.body.ac_number || !req.body.balance){
            res.status(400).send("Please enter details");
            return;
        }

        if(req.body.balance < 5000){
            res.status(400).send("Initial deposit must be above 5000");
            return;
        }

        var cusObj = {
            name: req.body.name,
            address: req.body.address
        }

        var customer = new Customer(cusObj);
        await customer.save();

        var accObj = {
            ac_number: req.body.ac_number,
            balance: req.body.balance,
            type: req.body.type || "SAVING",
            customer_id: customer._id
        }

        var account = new Account(accObj);
        await account.save();

        res.status(201).send({
            msg: "Account created successfully!",
            account,
            customer
        });

    } catch (e) {
        console.log(e)
        res.status(500).send("Unable to create account!");
    }
})

app.post("/api/account", async function (req, res) {
    try{
        if(!req.body.ac_number || !req.body.balance || !req.body.type || !req.query.customer_id){
            res.status(400).send("Please enter required details");
            return;
        }

        req.body.customer_id= req.query.customer_id;

        var account = new Account(req.body);
        await account.save();
        res.status(201).send({
            msg : "Account created successfuly!",
            account
        });
    } catch (e) {
        res.status(500).send("Unable to create the account!")
    }
})

app.put("/api/transfer", async function (req, res) {
    try{
        if(!req.body.from_ac || !req.body.to_ac || !req.body.amount){
            res.status(400).send("Please enter required details");
            return;
        }

        var fromAcc =  await Account.findOne({ac_number:req.body.from_ac});

        if(fromAcc.balance < req.body.amount){
            res.status(400).send("Insufficiant balance!");
            return;
        }

        var toAcc =  await Account.findOne({ac_number:req.body.to_ac});

        await Account.findOneAndUpdate({_id :fromAcc._id}, {$inc : {'balance' :-req.body.amount}});
        await Account.findOneAndUpdate({_id :toAcc._id}, {$inc : {'balance' :req.body.amount}});

        var transaction = new Transaction(req.body);
        await transaction.save();
        res.status(201).send({
            msg : "Amount transfered successfuly!"
        });
    } catch (e) {
        console.log("error:",e)
        res.status(500).send("Unable to transfer the account!")
    }
})

app.get("/api/history",async function (req,res){
    try{
        var history = await Transaction.find({
            $or: [
              { 'from_ac': req.query.ac_number },
              { 'to_ac': req.query.ac_number }
            ]
          })
        res.status(200).send({
            msg: "transaction history",
            history: history
        })
    } catch (e) {

    }
})

app.get("/api/balance", async function (req, res) {
    try{
        var account = await Account.findOne(req.query);
        res.status(200).send({
            msg: "Account balance",
            balance: account.balance
        })
    } catch (e) {
        res.status(500).send("Unable to show the balance!")
    }
})

app.listen(8080, function () {
    console.log("The server runs at port : 8080");
})

