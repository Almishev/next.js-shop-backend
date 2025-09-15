import {mongooseConnect} from "@/lib/mongoose";
import {Order} from "@/models/Order";

export default async function handler(req,res) {
  await mongooseConnect();
  if (req.method === 'GET') {
    return res.json(await Order.find().sort({createdAt:-1}));
  }
  if (req.method === 'DELETE') {
    const {id} = req.query;
    if (!id) {
      return res.status(400).json({error: 'Missing order id'});
    }
    await Order.deleteOne({_id:id});
    return res.json({success:true});
  }
  res.status(405).json({error:'Method Not Allowed'});
}