import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../config";

const AdminOrders = () => {

const [orders,setOrders] = useState([]);

const steps = [
"Processing",
"Packed",
"Shipped",
"Out for Delivery",
"Delivered"
];

useEffect(()=>{

fetchOrders();

},[]);

const fetchOrders = async ()=>{

try{

const token = localStorage.getItem("token");

const {data} = await axios.get(
`${API}/api/orders`,
{
headers:{Authorization:`Bearer ${token}`}
}
);

setOrders(data);

}catch(error){
console.error(error);
}

};

const updateStatus = async (id,status)=>{

try{

const token = localStorage.getItem("token");

await axios.put(
`${API}/api/orders/${id}/status`,
{status},
{
headers:{Authorization:`Bearer ${token}`}
}
);

fetchOrders();

}catch(error){
console.error(error);
}

};

return(

<div style={{padding:40}}>

<h2>Admin Orders</h2>

{orders.map((order)=>(

<div
key={order._id}
style={{
border:"1px solid #ddd",
padding:20,
marginBottom:30,
borderRadius:10
}}
>

<p><strong>Order ID:</strong> {order._id}</p>

<p><strong>User:</strong> {order.user?.name}</p>

<p><strong>Total:</strong> ₹{order.totalPrice}</p>

<p><strong>Status:</strong> {order.status}</p>

<div style={{
display:"flex",
gap:10,
flexWrap:"wrap",
marginTop:10
}}>

{steps.map((step)=>(

<button
key={step}
onClick={()=>updateStatus(order._id,step)}
style={{
padding:"6px 12px",
background: order.status === step ? "black" : "#eee",
color: order.status === step ? "white" : "black",
border:"none",
cursor:"pointer"
}}
>

{step}

</button>

))}

</div>

</div>

))}

</div>

);

};

export default AdminOrders;
