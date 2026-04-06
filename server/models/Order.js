import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
{
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  orderItems:[
    {
      product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
      },
      name:String,
      quantity:Number,
      price:Number,
      image:String
    }
  ],

  shippingAddress:{
    address:String,
    city:String,
    postalCode:String,
    country:String
  },

  totalPrice:{
    type:Number,
    required:true
  },

  isPaid:{type:Boolean,default:false},

  status:{
    type:String,
    enum:[
      "Processing",
      "Packed",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled"
    ],
    default:"Processing"
  },

  cancelReason:{
    type:String,
    default:""
  },

  isDelivered:{
    type:Boolean,
    default:false
  },

  /* ================= RETURN SYSTEM ================= */

  returnStatus:{
    type:String,
    enum:[
      "None",
      "Requested",
      "Approved",
      "Rejected",
      "Refunded"
    ],
    default:"None"
  },

  returnReason:{
    type:String,
    default:""
  },

  refundAmount:{
    type:Number,
    default:0
  }

},
{ timestamps:true }
);

export default mongoose.model("Order",orderSchema);
