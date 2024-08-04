import Stripe from "stripe";
import { ordersValidator } from "../validator/ordersValidator.js";
import { UserModel } from "../models/usersModel.js";
import { OrdersModel } from "../models/ordersModel.js";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const placedOrder = async (req, res, next) => {
    try {
        const { error, value } = ordersValidator.validate(req.body);

        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const userSessionID = req.session?.user?.id || req.user?.id;

        const findUser = await UserModel.findById(userSessionID);

        if (!findUser) {
            return res.status(404).json({ message: "User not found" })
        }

        const newOrder = await OrdersModel.create({
            ...value,
            user: userSessionID
        })

        await newOrder.save();

        // res.status(201).json({ message: "Order created" });

        // after order has been placed user's cart has to be cleared
        await UserModel.findByIdAndUpdate(userSessionID, { cartData: {} });

        const line_items = value.foodItem.map((item) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }));

        // to add delivery charges
        line_items.push({
            price_data: {
                currency: "usd",
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: 2 * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            success_url: `${frontend_url}/verify?success=true&orderID=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderID=${newOrder._id}`
        })

        res.status(200).json({ url: session.url })

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