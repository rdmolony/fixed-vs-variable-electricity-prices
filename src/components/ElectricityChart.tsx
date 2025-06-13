import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useState } from 'react';

type Scenario = 'fixed' | 'windy' | 'sunny' | 'volatile';

interface ElectricityChartProps {
  scenario: Scenario;
}

// Generate EV charging demand data (11kW for ~2.5 hours to charge 28kWh battery)
const generateDemandForHour = (hour: number) => {
  // EV charges from 01:00 to 03:30 (2.5 hours at 11kW = 27.5kWh ≈ 28kWh)
  if (hour >= 1 && hour < 4) {
    if (hour === 3) {
      // Last 30 minutes of charging (partial hour)
      return 5.5; // 11kW for 0.5 hours
    }
    return 11; // Full 11kW charging
  }
  return 0; // No demand during other hours
};

// Generate fixed tariff price for comparison
const generateFixedPriceForHour = (hour: number) => {
  return (hour >= 23 || hour < 8) ? 20 : 30;
};

// Generate price data based on scenario
const generatePriceForHour = (hour: number, scenario: Scenario) => {
  switch (scenario) {
    case 'fixed':
      // Original fixed tariff
      return (hour >= 23 || hour < 8) ? 20 : 30;
    
    case 'windy':
      // Windy night: very cheap 00:00-06:00, normal daytime
      if (hour >= 0 && hour < 6) return 5 + Math.random() * 3; // 5-8p
      if (hour >= 6 && hour < 8) return 15 + Math.random() * 5; // 15-20p
      if (hour >= 8 && hour < 18) return 25 + Math.random() * 5; // 25-30p
      if (hour >= 18 && hour < 22) return 30 + Math.random() * 5; // 30-35p
      return 20 + Math.random() * 5; // 20-25p
    
    case 'sunny':
      // Sunny day: cheap 10:00-16:00 due to solar
      if (hour >= 0 && hour < 8) return 25 + Math.random() * 5; // 25-30p
      if (hour >= 8 && hour < 10) return 30 + Math.random() * 5; // 30-35p
      if (hour >= 10 && hour < 16) return 8 + Math.random() * 7; // 8-15p
      if (hour >= 16 && hour < 19) return 35 + Math.random() * 10; // 35-45p
      if (hour >= 19 && hour < 22) return 40 + Math.random() * 5; // 40-45p
      return 30 + Math.random() * 5; // 30-35p
    
    case 'volatile':
      // Volatile prices with spikes
      const basePrice = 25;
      const volatility = Math.sin(hour * 0.5) * 15 + Math.random() * 20;
      const spikes = [6, 8, 17, 19].includes(hour) ? Math.random() * 30 : 0;
      return Math.max(5, basePrice + volatility + spikes);
    
    default:
      return 25;
  }
};

// Generate 24-hour data with cost calculations
const generateHourlyData = (scenario: Scenario) => {
  const data = [];
  let totalDailySpend = 0;
  let fixedTariffSpend = 0;
  
  for (let hour = 0; hour < 24; hour++) {
    const price = Math.round(generatePriceForHour(hour, scenario) * 10) / 10;
    const demand = generateDemandForHour(hour);
    const fixedPrice = generateFixedPriceForHour(hour);
    
    // Calculate hourly cost in pence (price per kWh × demand in kWh)
    const hourlyCost = Math.round((price * demand) * 10) / 10;
    const fixedHourlyCost = Math.round((fixedPrice * demand) * 10) / 10;
    
    totalDailySpend += hourlyCost;
    fixedTariffSpend += fixedHourlyCost;

    data.push({
      hour: `${hour.toString().padStart(2, '0')}:00`,
      price,
      demand,
      fixedPrice,
      hourlyCost,
      isPeakPrice: price > 30
    });
  }
  
  // Round total daily spend
  totalDailySpend = Math.round(totalDailySpend * 10) / 10;
  fixedTariffSpend = Math.round(fixedTariffSpend * 10) / 10;
  
  return { data, totalDailySpend, fixedTariffSpend };
};

const ElectricityChart = ({ scenario }: ElectricityChartProps) => {
  const [chartData] = useState(() => generateHourlyData(scenario));
  const { data, totalDailySpend, fixedTariffSpend } = chartData;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const priceData = payload.find((p: any) => p.dataKey === 'price');
      const demandData = payload.find((p: any) => p.dataKey === 'demand');
      const fixedPriceData = payload.find((p: any) => p.dataKey === 'fixedPrice');
      
      // Find the hour's cost data
      const hourData = data.find((d) => d.hour === label);
      
      return (
        <div className="bg-white/95 backdrop-blur border border-gray-200 rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-gray-800">{`Time: ${label}`}</p>
          {priceData && (
            <p className="text-blue-600">
              {`Wholesale Price: ${priceData.value}p/kWh`}
            </p>
          )}
          {fixedPriceData && scenario !== 'fixed' && (
            <p className="text-gray-500">
              {`Fixed Tariff: ${fixedPriceData.value}p/kWh`}
            </p>
          )}
          {demandData && (
            <p className="text-green-600">
              {`EV Charging: ${demandData.value} kW`}
            </p>
          )}
          {hourData && hourData.hourlyCost > 0 && (
            <p className="text-orange-600 font-medium">
              {`Hourly Cost: ${hourData.hourlyCost}p`}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      {/* Daily spend summary */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Daily Electricity Spend
            </h3>
            <p className="text-2xl font-bold text-blue-600">
              {totalDailySpend}p
            </p>
            {scenario !== 'fixed' && (
              <p className="text-sm text-gray-600">
                Fixed tariff would cost: <span className="font-medium">{fixedTariffSpend}p</span>
                {totalDailySpend < fixedTariffSpend && (
                  <span className="text-green-600 ml-2">
                    (Save {Math.round((fixedTariffSpend - totalDailySpend) * 10) / 10}p)
                  </span>
                )}
                {totalDailySpend > fixedTariffSpend && (
                  <span className="text-red-600 ml-2">
                    (Extra {Math.round((totalDailySpend - fixedTariffSpend) * 10) / 10}p)
                  </span>
                )}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[500px]">
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
              domain={[0, 60]}
              label={{ value: 'Price (p/kWh)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
            />
            <YAxis 
              yAxisId="demand"
              orientation="right"
              tick={{ fontSize: 12 }}
              stroke="#10b981"
              domain={[0, 12]}
              label={{ value: 'EV Charging (kW)', angle: 90, position: 'insideRight', style: { textAnchor: 'middle' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom"
              height={36}
              iconType="line"
              wrapperStyle={{ paddingTop: '20px', fontSize: '14px' }}
            />
            
            {/* Main price line */}
            <Line
              yAxisId="price"
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              name={scenario === 'fixed' ? 'Fixed Tariff Price (p/kWh)' : 'Wholesale Price (p/kWh)'}
            />
            
            {/* Fixed tariff overlay for wholesale scenarios */}
            {scenario !== 'fixed' && (
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="fixedPrice"
                stroke="#9ca3af"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                activeDot={{ r: 4, stroke: '#9ca3af', strokeWidth: 2 }}
                name="Fixed Tariff (reference)"
              />
            )}
            
            {/* EV Charging line */}
            <Line
              yAxisId="demand"
              type="monotone"
              dataKey="demand"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
              name="EV Charging Power (kW)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ElectricityChart;
