import {mongooseConnect} from "@/lib/mongoose";
import {Order} from "@/models/Order";

function getRange(date) {
  const start = new Date(date);
  start.setHours(0,0,0,0);
  const end = new Date(date);
  end.setHours(23,59,59,999);
  return {start, end};
}

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day; // Monday as first day
  d.setDate(d.getDate() + diff);
  d.setHours(0,0,0,0);
  return d;
}

function endOfWeek(date) {
  const s = startOfWeek(date);
  const e = new Date(s);
  e.setDate(e.getDate() + 6);
  e.setHours(23,59,59,999);
  return e;
}

function startOfMonth(date) {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0,0,0,0);
  return d;
}

function endOfMonth(date) {
  const d = new Date(date);
  d.setMonth(d.getMonth()+1,0);
  d.setHours(23,59,59,999);
  return d;
}

export default async function handler(req,res) {
  await mongooseConnect();

  const now = new Date();
  const {start: todayStart, end: todayEnd} = getRange(now);
  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const [todayOrders, weekOrders, monthOrders] = await Promise.all([
    Order.find({createdAt: {$gte: todayStart, $lte: todayEnd}}),
    Order.find({createdAt: {$gte: weekStart, $lte: weekEnd}}),
    Order.find({createdAt: {$gte: monthStart, $lte: monthEnd}}),
  ]);

  const calcRevenue = (orders) => orders.reduce((sum, o) => {
    // line_items: [{quantity, price_data: {unit_amount}}] where unit_amount is in cents
    const total = (o.line_items || []).reduce((s, li) => {
      const ua = li?.price_data?.unit_amount || 0; // cents for the WHOLE line already
      return s + ua;
    }, 0);
    return sum + total;
  }, 0) / 100; // BGN

  res.json({
    orders: {
      today: todayOrders.length,
      week: weekOrders.length,
      month: monthOrders.length,
    },
    revenue: {
      today: calcRevenue(todayOrders),
      week: calcRevenue(weekOrders),
      month: calcRevenue(monthOrders),
    }
  });
}


