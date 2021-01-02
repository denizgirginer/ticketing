import {useEffect, useState} from 'react';
import Router from 'next/router'
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/user-request'

const OrderShow = ({ order, currentUser}) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const {doRequest, errors} = useRequest({
        url:'/api/payments',
        method:'post',
        body:{
            orderId:order.id,
        },
        onSuccess:(payment)=>{
            Router.push('/orders')
        }
    })

    useEffect(()=>{
        const findTimeLeft= ()=>{
            const msLeft = new Date(order.expiresAt) - new Date();

            setTimeLeft(Math.round(msLeft/1000))
        }

        findTimeLeft();

        const timerId=setInterval(findTimeLeft, 1000)

        //if leave page stop timer
        return ()=>{
            clearInterval(timerId)
        }
    },[order])

    if(timeLeft<0) {
        return <div>Order Expired</div>
    }

    return <div>
        {errors}
        <div>Time left to pay:{timeLeft} left</div>
        <StripeCheckout 
            token={({id})=>doRequest({token:id})} 
            amount={order.ticket.price*100}
            email={currentUser.email}
            stripeKey="pk_test_51I4QwfILHqxf6eLFJZfrEz3fUeUix4lOZFTpJJ97BGtRjFLV9TfOHyWvRYNJx1AHcANJgZZa5I8QJM8h6Y2eifax00jMIVtyIr" />
    </div>
}

OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query;

    const { data } = await client.get(`/api/orders/${orderId}`);

    return {
        order: data
    }
}

export default OrderShow;