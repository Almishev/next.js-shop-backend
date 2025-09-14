import {mongooseConnect} from "@/lib/mongoose";
import {isAdminRequest} from "@/pages/api/auth/[...nextauth]";
import {Settings} from "@/models/Settings";

export default async function handle(req, res) {
  await mongooseConnect();
  await isAdminRequest(req,res);

  if (req.method === 'GET') {
    const settings = await Settings.find();
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.name] = setting.value;
    });
    res.json(settingsObj);
  }

  if (req.method === 'POST') {
    const {featuredProductId, shippingPrice} = req.body;
    
    // Update or create featured product setting
    await Settings.findOneAndUpdate(
      {name: 'featuredProductId'},
      {value: featuredProductId},
      {upsert: true}
    );
    
    // Update or create shipping price setting
    await Settings.findOneAndUpdate(
      {name: 'shippingPrice'},
      {value: shippingPrice},
      {upsert: true}
    );
    
    res.json({success: true});
  }
}
