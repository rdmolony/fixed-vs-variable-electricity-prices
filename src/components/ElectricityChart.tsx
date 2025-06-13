
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Legend } from 'recharts';
import { useState } from 'react';

// Generate 24-hour data
const generateHourlyData = () => {
  const data = [];
  for (let hour = 0; hour < 24; hour++) {
    // Price logic: 20p between 23:00-08:00, 30p between 08:00-23:00
    const price = (hour >= 23 || hour < 8) ? 20 : 30;
    
    // Demand logic for EV owner working from home
    let demand;
    if (hour >= 0 && hour < 7) {
      // Night: EV charging (high demand)
      demand = 6 + Math.sin((hour * Math.PI) / 6) * 2; // 4-8 kWh
    } else if (hour >= 7 && hour < 9) {
      // Morning routine (medium demand)
      demand = 3 + Math.random() * 1; // 3-4 kWh
    } else if (hour >= 9 && hour < 17) {
      // Work from home (low-medium demand)
      demand = 1.5 + Math.sin((hour - 9) * Math.PI / 8) * 0.8; // 0.7-2.3 kWh
    } else if (hour >= 17 && hour < 20) {
      // Evening peak (cooking, etc.)
      demand = 3.5 + Math.random() * 1.5; // 3.5-5 kWh
    } else {
      // Late evening (medium demand)
      demand = 2 + Math.random() * 0.5; // 2-2.5 kWh
    }

    data.push({
      hour: `${hour.toString().padStart(2, '0')}:00`,
      price,
      demand: Math.round(demand * 10) / 10,
      isPeakPrice: price === 30
    });
  }
  return data;
};

const ElectricityChart = () => {
  const [data] = useState(generateHourlyData);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const priceData = payload.find((p: any) => p.dataKey === 'price');
      const demandData = payload.find((p: any) => p.dataKey === 'demand');
      
      return (
        <div className="bg-white/95 backdrop-blur border border-gray-200 rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-gray-800">{`Time: ${label}`}</p>
          {priceData && (
            <p className="text-blue-600">
              {`Price: ${priceData.value}p/kWh`}
            </p>
          )}
          {demandData && (
            <p className="text-green-600">
              {`Demand: ${demandData.value} kWh`}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 80, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="hour" 
            tick={{ fontSize: 12 }}
            stroke="#64748b"
          />
          <YAxis 
            yAxisId="price"
            orientation="left"
            tick={{ fontSize: 12 }}
            stroke="#3b82f6"
            domain={[15, 35]}
            label={{ value: 'Price (p/kWh)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
          />
          <YAxis 
            yAxisId="demand"
            orientation="right"
            tick={{ fontSize: 12 }}
            stroke="#10b981"
            domain={[0, 'dataMax']}
            label={{ value: 'Demand (kWh)', angle: 90, position: 'insideRight', style: { textAnchor: 'middle' } }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom"
            height={36}
            iconType="line"
            wrapperStyle={{ paddingTop: '20px', fontSize: '14px' }}
          />
          
          {/* Price line with area fill */}
          <Area
            yAxisId="price"
            type="stepAfter"
            dataKey="price"
            stroke="#3b82f6"
            strokeWidth={3}
            fill="url(#priceGradient)"
            fillOpacity={0.2}
            name="Electricity Price (p/kWh)"
          />
          
          {/* Demand line */}
          <Line
            yAxisId="demand"
            type="monotone"
            dataKey="demand"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
            name="Household Demand (kWh)"
          />
          
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ElectricityChart;
