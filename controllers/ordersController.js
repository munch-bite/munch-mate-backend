import { ordersValidator } from "../validators/ordersValidator.js";
import { UserModel } from "../models/usersModel.js";
import { OrdersModel } from "../models/ordersModel.js";
import https from "https";



export const placedOrder = async (req, res, next) => {
    try {
        const { error, value } = ordersValidator.validate(req.body);

        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const userSessionID = req.session?.user?.id || req.user?.id;

        const user = await UserModel.findById(userSessionID);

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        await OrdersModel.create({
            ...value,
            user: userSessionID
        })

        // res.status(201).json({ message: "Order created" });

        // after order has been placed user's cart has to be cleared
        await UserModel.findByIdAndUpdate(userSessionID, { cartData: {} });

        // initialize transaction
        const params = JSON.stringify({
            "email": user.email,
            "amount": "1000"
        })

        const options = {
            hostname: 'api.paystack.co',
            port: 443,
            path: '/transaction/initialize',
            method: 'POST',
            headers: {
                Authorization: process.env.PAYSTACK_SECRET_KEY,
                'Content-Type': 'application/json'
            }
        }

        //initialize Paystack transaction
        const req = https.request(options, res => {
            let data = ''

            res.on('data', (chunk) => {
                data += chunk
            });

            res.on('end', () => {
                console.log(JSON.parse(data))
            })
        }).on('error', error => {
            console.error(error)
        })

        req.write(params)
        req.end()



    } catch (error) {
        next(error);
    }
}



export const confirmPayment = async (req, res, next) => {
    try {
        const { paymentIntentId, paymentMethodId } = req.body;

        // Confirm the PaymentIntent
        const confirmedPaymentIntent = await stripe.paymentIntents.confirm(
            paymentIntentId,
            {
                payment_method: paymentMethodId,
            }
        );

        if (confirmedPaymentIntent.status === 'succeeded') {
            // Update order status to paid
            await OrdersModel.findByIdAndUpdate(
                confirmedPaymentIntent.metadata.order_id,
                { payment: true },
                { new: true }
            );

            res.status(200).json({ message: 'Payment Confirmed' });
        } else {
            res.status(400).json({ message: 'Payment Failed' });
        }
    } catch (error) {
        next(error);
    }
};

// export const verifyPayment = async (req, res, next) => {
//     try {

//     } catch (error) {

//     }
// }

// const https = require('https')

// const options = {
//     hostname: 'api.paystack.co',
//     port: 443,
//     path: '/transaction/verify/:reference',
//     method: 'GET',
//     headers: {
//         Authorization: 'Bearer SECRET_KEY'
//     }
// }

// https.request(options, res => {
//     let data = ''

//     res.on('data', (chunk) => {
//         data += chunk
//     });

//     res.on('end', () => {
//         console.log(JSON.parse(data))
//     })
// }).on('error', error => {
//     console.error(error)
// })