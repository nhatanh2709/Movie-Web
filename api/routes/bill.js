const router = require("express").Router();
const Bill = require("../models/Bill");
const User = require("../models/User");
const verify = require("../verifyToken");
const CryptoJS = require("crypto-js");
const moment = require("moment");
const bodyParser = require('body-parser');
const qs = require('qs');
const axios = require('axios');
router.post("/", verify, async (req, res) => {
    if (req.user.isAdmin) {
        try {
            const newBill = new Bill(req.body);
            try {
                const SavedBill = await newBill.save();
                res.status(200).json(SavedBill);
            } catch (err) {
                res.status(500).json(err);
            }
        } catch (err) {
            res.status(403).json(err);
        }
    } else {
        res.status(403).json("You are not allowed!");
    }
})

router.get("/getAll", verify, async (req, res) => {
    try {
        const bills = await Bill.find();
        res.status(200).json(bills);
    } catch (err) {
        res.status(500).json(err);
    }
})

const config = {
    app_id: "2554",
    key1: "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn",
    key2: "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf",
    endpoint: "https://sb-openapi.zalopay.vn/v2/create"
}

router.post("/payment", verify, async (req, res) => {
    const embed_data = {
        redirecturl: "https://movieclient.netlify.app"
    };
    const items = [{
        UserID: req.body.UserID,
        PackageID: req.body.PackageID,
    }];
    const Package = await Bill.findById(req.body.PackageID);
    const amount = Package.price;
    const transID = Math.floor(Math.random() * 1000000);
    const order = {
        app_id: config.app_id,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
        app_user: "user123",
        app_time: Date.now(), // miliseconds
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: amount,
        description: `Movie Web Tranfer for the order #${transID}`,
        bank_code: "",
        callback_url: "https://041b-125-235-232-136.ngrok-free.app/api/bills/callback"
    };
    const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
    
    try {
        const result = await axios.post(config.endpoint, null, { params: order });
        res.status(200).json(result.data);
    } catch (err) {
        res.status(500).json(err);
    }
})

let result = {};
router.post('/callback', (req, res) => {
    try {
        let dataStr = req.body.data;
        let reqMac = req.body.mac;

        let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();


        if (reqMac !== mac) {
            result.return_code = -1;
            result.return_message = "mac not equal";
        }
        else {

            let dataJson = JSON.parse(dataStr, config.key2);
            const data = JSON.parse(dataJson["item"]);
            result.return_data = data;
            //console.log(data[0]["UserID"], data[0]["PackageID"])
            updateUserPackage(data[0]["UserID"], data[0]["PackageID"])

        }
    } catch (ex) {
        result.return_code = 0;
        result.return_message = ex.message;
    }
    
    try {
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
});

async function updateUserPackage(userID, PackageID) {
    try {
        const Package = await Bill.findById(PackageID);
        const expire = Package.expire;
        const promotion = Package.promotion;
        const userBuyPackage = await User.findById(userID);
        let info;
        let timestamp = new Date();
        timestamp.setMonth(timestamp.getMonth() + expire + promotion);
        if (userBuyPackage.BuyPackage === false) {
            info = await User.findByIdAndUpdate(
                userID, {
                $set: {
                    BuyPackage: true,
                    ExpireDate: timestamp
                }
            }
            )
        } else {
            const LastBuy = userBuyPackage.ExpireDate;
            const newExpire = new Date(LastBuy);
            newExpire.setMonth(newExpire.getMonth() + expire + promotion);

            if (timestamp < newExpire) {
                timestamp = newExpire;
            }
            info = await User.findByIdAndUpdate(
                userID, {
                $set: {
                    ExpireDate: timestamp
                }
            }
            )
        }
    } catch (err) {
        console.log(err);
    }
}

router.get("/getPackage/:id", verify, async(req, res) => {
    try{
        const ResponseBill = await Bill.findById(req.params.id);
        res.status(200).json(ResponseBill);
    } catch(err) {
        res.status(500).json(err);
    }
})
router.post("/updateUser/:id", async (req, res) => {
    try {
        const Package = await Bill.findById(req.params.id);
        const expire = Package.expire;
        const promotion = Package.promotion;
        const userBuyPackage = await User.findById(req.body.UserID);
        let info;
        let timestamp = new Date();
        timestamp.setMonth(timestamp.getMonth() + expire + promotion);
        if (userBuyPackage.BuyPackage === false) {

            info = await User.findByIdAndUpdate(
                req.body.UserID, {
                $set: {
                    BuyPackage: true,
                    ExpireDate: timestamp
                }
            }
            )
        } else {
            const LastBuy = userBuyPackage.ExpireDate;
            const newExpire = new Date(LastBuy);
            newExpire.setMonth(newExpire.getMonth() + expire + promotion);

            if (timestamp < newExpire) {
                timestamp = newExpire;
            }
            info = await User.findByIdAndUpdate(
                req.body.UserID, {
                $set: {
                    ExpireDate: timestamp
                }
            }
            )
        }
        res.status(200).json(info);
    } catch (err) {
        res.status(403).json(err);
    }
})

router.get("/check/:id", verify, async (req, res) => {
    try {
        const user = await Bill.findOne(
            {
                'ListUser': {
                    $elemMatch: { 'UserID': req.body.UserID }
                }
            }
        )
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router