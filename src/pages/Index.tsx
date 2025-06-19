import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, BarChart, Bar, ReferenceLine } from 'recharts';

const Index = () => {
  const [hoveredHour, setHoveredHour] = useState<string | null>(null);
  const [useFlexiblePricing, setUseFlexiblePricing] = useState(false);
  const [scenario, setScenario] = useState<'windy-night' | 'sunny-day' | 'grid-stress'>('windy-night');
  const [useEnergyOptimization, setUseEnergyOptimization] = useState(false);

  // Generate flexible market prices based on scenario
  const generateFlexiblePrices = () => {
    if (scenario === 'windy-night') {
      // Simulated wholesale prices for a windy night - very cheap overnight due to excess wind generation
      return [
        2, 1, 0.5, 0.2, -1, -2, -0.5, 0.8, // 00:00-07:00 (very cheap/negative due to wind)
        5, 8, 12, 15, 18, 22, 25, 28, // 08:00-15:00 (morning/afternoon peak)
        32, 35, 30, 25, 18, 12, 8, 4  // 16:00-23:00 (evening peak then declining)
      ];
    } else if (scenario === 'sunny-day') {
      // Sunny day - cheap solar during midday, expensive at peak times
      return [
        25, 22, 20, 18, 16, 15, 18, 22, // 00:00-07:00 (overnight rates)
        28, 25, 20, 15, 8, 5, 3, 6, // 08:00-15:00 (cheap solar midday)
        12, 25, 35, 42, 38, 35, 30, 28  // 16:00-23:00 (expensive evening peak)
      ];
    } else {
      // Grid stress day - extremely volatile with unpredictable spikes and crashes
      return [
        45, 12, 58, 3, 67, 8, 52, 15, // 00:00-07:00 (chaotic overnight)
        38, 72, 18, 65, 25, 83, 9, 71, // 08:00-15:00 (wild swings)
        44, 19, 89, 35, 76, 14, 62, 41  // 16:00-23:00 (continued volatility)
      ];
    }
  };

  // Optimize charging schedule based on prices
  const optimizeChargingSchedule = (prices: number[]) => {
    const totalEnergyNeeded = 39.6; // kWh
    const maxChargeRate = 3.6; // kW per hour
    const hoursNeeded = Math.ceil(totalEnergyNeeded / maxChargeRate); // 11 hours
    
    // Create array of hours with their prices and sort by cheapest first
    const hourPrices = prices.map((price, hour) => ({ hour, price }))
      .sort((a, b) => a.price - b.price);
    
    // Select the cheapest hours for charging
    const selectedHours = new Set(hourPrices.slice(0, hoursNeeded).map(hp => hp.hour));
    
    return selectedHours;
  };

  // Generate demonstration data
  const generateScenarioData = () => {
    const data = [];
    const flexiblePrices = generateFlexiblePrices();
    
    // Get optimized charging schedule if optimization is enabled
    const optimizedHours = useEnergyOptimization && useFlexiblePricing ? 
      optimizeChargingSchedule(flexiblePrices) : new Set();
    
    for (let hour = 0; hour < 24; hour++) {
      // Manual EV charging between 00:00 and 11:00 (11 hours total)
      let manualConsumption = 0;
      if (hour >= 0 && hour < 11) {
        manualConsumption = 3.6; // Full 3.6kW charging
      }
      
      // Optimized charging only during cheapest hours
      let optimizedConsumption = 0;
      if (optimizedHours.has(hour)) {
        optimizedConsumption = 3.6;
      }
      
      // Choose consumption based on optimization setting
      const consumption = (useEnergyOptimization && useFlexiblePricing) ? 
        optimizedConsumption : manualConsumption;
      
      // Fixed price
      const fixedRate = (hour >= 23 || hour < 8) ? 20 : 30;
      
      // Choose pricing based on toggle
      const unitRate = useFlexiblePricing ? flexiblePrices[hour] : fixedRate;
      
      // Calculate costs for all scenarios
      const fixedCost = manualConsumption * fixedRate;
      const flexibleCost = Math.max(0, manualConsumption * flexiblePrices[hour]);
      const optimizedCost = Math.max(0, optimizedConsumption * flexiblePrices[hour]);
      const cost = (useEnergyOptimization && useFlexiblePricing) ? optimizedCost : 
                   useFlexiblePricing ? flexibleCost : fixedCost;
      
      data.push({
        hour: `${hour.toString().padStart(2, '0')}:00`,
        consumption,
        manualConsumption,
        optimizedConsumption,
        unitRate,
        fixedRate,
        flexibleRate: flexiblePrices[hour],
        cost,
        fixedCost,
        flexibleCost,
        optimizedCost,
        isCharging: consumption > 0,
        isOptimalPeriod: optimizedHours.has(hour),
        isCheapPeriod: useFlexiblePricing ? unitRate < 10 : (hour >= 23 || hour < 8),
        isNegativePrice: useFlexiblePricing && unitRate < 0
      });
    }
    return data;
  };

  // Generate simple demonstration data for intro charts (always fixed pricing)
  const generateIntroData = () => {
    const data = [];
    for (let hour = 0; hour < 24; hour++) {
      // EV charging between 00:00 and 11:00 (11 hours total)
      let consumption = 0;
      if (hour >= 0 && hour < 11) {
        consumption = 3.6; // Full 3.6kW charging
      }
      
      // Fixed price: 20p night (23:00-08:00), 30p day (08:00-23:00)
      const unitRate = (hour >= 23 || hour < 8) ? 20 : 30;
      
      // Calculate cost (pence per hour)
      const cost = consumption * unitRate;
      
      data.push({
        hour: `${hour.toString().padStart(2, '0')}:00`,
        consumption,
        unitRate,
        cost,
        isCharging: consumption > 0,
        isCheapPeriod: (hour >= 23 || hour < 8)
      });
    }
    return data;
  };

  const introData = generateIntroData();
  
  // Generate market price example for Learn section (using windy night as example)
  const generateMarketPriceExample = () => {
    const data = [];
    const marketPrices = [
      2, 1, 0.5, 0.2, -1, -2, -0.5, 0.8, // 00:00-07:00 (very cheap/negative due to wind)
      5, 8, 12, 15, 18, 22, 25, 28, // 08:00-15:00 (morning/afternoon peak)
      32, 35, 30, 25, 18, 12, 8, 4  // 16:00-23:00 (evening peak then declining)
    ];
    
    for (let hour = 0; hour < 24; hour++) {
      // EV charging between 00:00 and 11:00 (11 hours total)
      let consumption = 0;
      if (hour >= 0 && hour < 11) {
        consumption = 3.6; // Full 3.6kW charging
      }
      
      // Fixed vs market rates
      const fixedRate = (hour >= 23 || hour < 8) ? 20 : 30;
      const marketRate = marketPrices[hour];
      
      // Calculate costs
      const fixedCost = consumption * fixedRate;
      const marketCost = Math.max(0, consumption * marketRate); // Don't go below 0 for display
      
      data.push({
        hour: `${hour.toString().padStart(2, '0')}:00`,
        consumption,
        fixedRate,
        marketRate,
        fixedCost,
        marketCost,
        isCharging: consumption > 0,
      });
    }
    return data;
  };
  
  const marketPriceData = generateMarketPriceExample();
  const scenarioData = generateScenarioData();

  // Calculate total costs for display
  const totalFixedCost = scenarioData.reduce((sum, hour) => sum + hour.fixedCost, 0);
  const totalFlexibleCost = scenarioData.reduce((sum, hour) => sum + hour.flexibleCost, 0);
  const totalOptimizedCost = scenarioData.reduce((sum, hour) => sum + hour.optimizedCost, 0);
  const totalCost = (useEnergyOptimization && useFlexiblePricing) ? totalOptimizedCost :
                   useFlexiblePricing ? totalFlexibleCost : totalFixedCost;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How does flexible electricity prices compare to fixed?
          </h1>
          <div className="text-xl text-gray-600 max-w-4xl mx-auto mb-6">
            <p className="pb-4">
              Let's explore a number of scenarios to get a feel for how 
              switching to time-of-use electricity prices might impact electricity spend and demand.
            </p>
            <p>But first some background.</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 text-sm text-amber-800 rounded-lg p-4 max-w-4xl mx-auto mb-6">
            <p>
              <span className="font-semibold">Caveat:</span> This tool is intended as a storytelling device. 
              It is based on illustrative, fictitious data. 
              For real historic data and trends go to{" "}
              <a 
                href="https://agile.octopushome.net/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-amber-900 underline hover:text-amber-700"
              >
                https://agile.octopushome.net/
              </a>
            </p>
          </div>
        </div>

        <Tabs defaultValue="learn" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="learn">📚 Learn the Basics</TabsTrigger>
            <TabsTrigger value="scenarios">🔧 Explore Scenarios</TabsTrigger>
          </TabsList>

          <TabsContent value="learn">
            {/* Intro Section */}
            <div className="max-w-6xl mx-auto mb-16">
              <div className="max-w-4xl mx-auto mb-12">
              </div>

              <div className="space-y-8 text-left max-w-4xl mx-auto">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">What does charging my EV cost me?</h3>
              <p className="text-gray-700">
                Let's imagine I have an electric vehicle that is charged from empty at night between 00:00 and 11:00.
              </p>
            </div>


            <div className="space-y-4">
              <div className="bg-white rounded-lg p-6 border">
                <p className="text-lg font-semibold text-gray-800 mb-4 text-center">
                  Hourly Energy Consumption
                </p>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={introData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                      <YAxis 
                        domain={[0, 12]} 
                        tick={{ fontSize: 12 }}
                        label={{ value: 'Consumption (kW)', angle: -90, position: 'outside' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="consumption"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

          <div className="text-center text-sm text-gray-400 px-24">
            <p>
              * Assuming the car battery's charge power is 3.6kW (i.e. single-phase * 230V * 16A) & the battery is 40kWh, and so it takes 11 hours or so to charge from empty.
            </p>
          </div>
              
              <div>
                <p className="text-gray-700 mb-4 mt-8">
                  And I'm on a fixed price of 20p/kWh during the night and 30p/kWh during the day.
                </p>
                <div className="bg-white rounded-lg p-6 border">
                  <p className="text-lg font-semibold text-gray-800 mb-4 text-center">
                    Hourly Unit Rates
                  </p>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={introData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                        <YAxis 
                          domain={[0, 35]} 
                          tick={{ fontSize: 12 }}
                          label={{ value: 'Unit Rate (p/kWh)', angle: -90, position: 'outside' }}
                        />
                        <Line
                          type="monotone"
                          dataKey="unitRate"
                          stroke="#3b82f6"
                          strokeWidth={3}
                          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-gray-700">
              Multiply these two together, and we get our cost of electricity consumption. 
              </p>
            </div>

            <div className="space-y-6">
              {/* Primary Cost Chart */}
              <div className="bg-white rounded-lg p-6 border-2 shadow-lg">
                <p className="text-lg font-semibold text-gray-800 mb-4 text-center">
                  💰 Hourly Electricity Cost (This is what matters!)
                </p>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart 
                      data={introData}
                      onMouseMove={(e) => e?.activeLabel && setHoveredHour(e.activeLabel)}
                      onMouseLeave={() => setHoveredHour(null)}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                      <YAxis 
                        domain={[0, 120]} 
                        tick={{ fontSize: 12 }}
                        label={{ value: 'Cost (pence/hour)', angle: -90, position: 'outside' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="cost"
                        stroke="#ef4444"
                        fill="#fef2f2"
                        fillOpacity={0.8}
                        strokeWidth={3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-center text-sm text-gray-600 mt-2">
                  <span className="font-semibold text-red-600">Total daily cost: 792 pence (£7.92)</span> - This is what you pay for charging your EV
                </p>
              </div>

            </div>
            
            {/* New section: Market Price Volatility */}
            <div className="mt-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">But what if I switch to market-based pricing?</h3>
              <p className="text-gray-700 mb-6">
                What if instead of a fixed price, I switch to a time-of-use price based on electricity market prices? 
                My hourly unit rates would become much more volatile...
              </p>
              
              <div className="bg-white rounded-lg p-6 border border-orange-200">
                <p className="text-lg font-semibold text-gray-800 mb-4 text-center">
                  📈 Market Price Volatility (Example: Windy Night)
                </p>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={marketPriceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                      <YAxis 
                        domain={[-5, 40]} 
                        tick={{ fontSize: 12 }}
                        label={{ value: 'Unit Rate (p/kWh)', angle: -90, position: 'outside' }}
                      />
                      <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="2 2" />
                      
                      {/* Fixed rate baseline */}
                      <Line
                        type="monotone"
                        dataKey="fixedRate"
                        stroke="#6b7280"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        dot={{ fill: "#6b7280", strokeWidth: 1, r: 2 }}
                        name="Fixed Prices"
                      />
                      
                      {/* Volatile market rates */}
                      <Line
                        type="monotone"
                        dataKey="marketRate"
                        stroke="#ea580c"
                        strokeWidth={3}
                        dot={{ fill: "#ea580c", strokeWidth: 2, r: 3 }}
                        name="Market Price"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-center text-sm text-orange-700 mt-2">
                  Notice the dramatic price swings - from negative to 35p/kWh!
                </p>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">What does this do to my cost?</h3>
                <p className="text-gray-700 mb-6">
                  The same charging pattern (00:00-11:00) now results in very different costs depending on market conditions:
                </p>
                
                <div className="bg-white rounded-lg p-6 border-2 border-orange-200 shadow-lg">
                  <p className="text-lg font-semibold text-gray-800 mb-4 text-center">
                    💰 Fixed vs Market-Based Charging Costs
                  </p>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={marketPriceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                        <YAxis 
                          domain={[0, 120]} 
                          tick={{ fontSize: 12 }}
                          label={{ value: 'Cost (pence/hour)', angle: -90, position: 'outside' }}
                        />
                        
                        {/* Fixed cost baseline */}
                        <Line
                          type="monotone"
                          dataKey="fixedCost"
                          stroke="#6b7280"
                          strokeWidth={2}
                          strokeDasharray="4 4"
                          dot={{ fill: "#6b7280", strokeWidth: 1, r: 2 }}
                          name="Cost of Fixed Prices"
                        />
                        
                        {/* Market cost line - emphasized */}
                        <Line
                          type="monotone"
                          dataKey="marketCost"
                          stroke="#ea580c"
                          strokeWidth={4}
                          dot={{ fill: "#ea580c", strokeWidth: 2, r: 4 }}
                          name="Cost of Market Prices"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-center text-sm mt-2 space-y-1">
                    <p>
                      <span className="font-semibold text-gray-700">Fixed price total: £7.92</span> |
                      <span className="font-semibold text-orange-600 ml-2">Market price total: £{((marketPriceData.reduce((sum, hour) => sum + hour.marketCost, 0))/100).toFixed(2)}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
            </div>
          </TabsContent>

          <TabsContent value="scenarios">
            {/* Scenarios Section */}
            <div className="max-w-6xl mx-auto mb-16">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Scenarios
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                  Now let's compare fixed to time-of-use pricing for a number of scenarios
                </p>

                {/* Pricing Toggle */}
                <div className="bg-slate-300 rounded-xl p-6 border-2 shadow-md max-w-lg mx-auto">
                  <div className="flex items-center justify-center gap-6">
                    <span className={`text-xl font-semibold transition-colors ${!useFlexiblePricing ? 'text-green-600' : 'text-gray-500'}`}>
                      Fixed Price
                    </span>
                    <Switch
                      checked={useFlexiblePricing}
                      onCheckedChange={setUseFlexiblePricing}
                      className="data-[state=checked]:bg-green-500 scale-110"
                    />
                    <span className={`text-xl font-semibold transition-colors ${useFlexiblePricing ? 'text-green-600' : 'text-gray-500'}`}>
                      Flexible Market Prices
                    </span>
                  </div>
                </div>
                
                {useFlexiblePricing && (
                  <div className="space-y-4 mt-4">
                    {/* Scenario Selection */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200 max-w-lg mx-auto">
                      <p className="text-sm font-medium text-gray-700 mb-3 text-center">Choose Scenario:</p>
                      <RadioGroup value={scenario} onValueChange={(value: 'windy-night' | 'sunny-day' | 'grid-stress') => setScenario(value)} className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
                        <div className="flex items-center space-x-2 justify-center sm:justify-start">
                          <RadioGroupItem value="windy-night" id="windy-night" />
                          <Label htmlFor="windy-night" className="text-sm font-medium">🌬️ Windy Night</Label>
                        </div>
                        <div className="flex items-center space-x-2 justify-center sm:justify-start">
                          <RadioGroupItem value="sunny-day" id="sunny-day" />
                          <Label htmlFor="sunny-day" className="text-sm font-medium">☀️ Sunny Day</Label>
                        </div>
                        <div className="flex items-center space-x-2 justify-center sm:justify-start">
                          <RadioGroupItem value="grid-stress" id="grid-stress" />
                          <Label htmlFor="grid-stress" className="text-sm font-medium">⚡ Grid Stress</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    {/* Scenario Description */}
                    <div className={`border text-sm rounded-lg p-3 max-w-2xl mx-auto ${
                      scenario === 'grid-stress' 
                        ? 'bg-red-50 border-red-200 text-red-800' 
                        : 'bg-green-50 border-green-200 text-green-800'
                    }`}>
                      {scenario === 'windy-night' ? (
                        <p>
                          <span className="font-semibold">Windy Night:</span> High wind generation creates very cheap (even negative) wholesale prices overnight, perfect for EV charging!
                        </p>
                      ) : scenario === 'sunny-day' ? (
                        <p>
                          <span className="font-semibold">Sunny Day:</span> Solar generation makes midday electricity very cheap, but evening demand drives prices higher than usual.
                        </p>
                      ) : (
                        <p>
                          <span className="font-semibold">Grid Stress Day:</span> Extreme price volatility due to supply shortages, demand spikes, or grid instability. Prices swing wildly - risky without smart automation!
                        </p>
                      )}
                    </div>
                    
                    {/* Energy Optimization Toggle */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200 max-w-md mx-auto">
                      <p className="text-sm font-medium text-gray-700 mb-3 text-center">Charging Strategy:</p>
                      <div className="flex items-center justify-center gap-4">
                        <span className={`text-sm font-medium transition-colors ${!useEnergyOptimization ? 'text-blue-600' : 'text-gray-500'}`}>
                          Manual (00:00-11:00)
                        </span>
                        <Switch
                          checked={useEnergyOptimization}
                          onCheckedChange={setUseEnergyOptimization}
                          className="data-[state=checked]:bg-purple-500"
                        />
                        <span className={`text-sm font-medium transition-colors ${useEnergyOptimization ? 'text-purple-600' : 'text-gray-500'}`}>
                          🤖 Smart Optimization
                        </span>
                      </div>
                      {useEnergyOptimization && (
                        <p className="text-xs text-purple-700 text-center mt-2">
                          Automatically charges during the cheapest hours
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

          <div className="space-y-8 text-left max-w-5xl mx-auto">
            {/* Primary Cost Visualization - Emphasized */}
            <div className="bg-white rounded-lg p-8 border-2  shadow-xl">
              <p className="text-2xl font-bold text-gray-800 mb-6 text-center">
                💰 Hourly Electricity Cost
              </p>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={scenarioData}
                    onMouseMove={(e) => e?.activeLabel && setHoveredHour(e.activeLabel)}
                    onMouseLeave={() => setHoveredHour(null)}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="hour" tick={{ fontSize: 14 }} />
                    <YAxis 
                      domain={[0, scenario === 'grid-stress' ? 350 : 140]} 
                      tick={{ fontSize: 14 }}
                      label={{ value: 'Cost (pence/hour)', angle: -90, position: 'outside' }}
                    />
                    
                    {/* Fixed cost baseline - always shown in dark grey */}
                    <Line
                      type="monotone"
                      dataKey="fixedCost"
                      stroke="#374151"
                      strokeWidth={3}
                      dot={{ fill: "#374151", strokeWidth: 2, r: 3 }}
                      name="Cost of Fixed Price"
                    />
                    
                    {/* Manual flexible cost - shown when flexible but not optimized */}
                    {useFlexiblePricing && !useEnergyOptimization && (
                      <Line
                        type="monotone"
                        dataKey="flexibleCost"
                        stroke="#10b981"
                        strokeWidth={4}
                        dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                        name="Manual Market Price Cost"
                      />
                    )}
                    
                    {/* Show both manual and optimized when optimization is enabled */}
                    {useFlexiblePricing && useEnergyOptimization && (
                      <>
                        {/* Manual flexible cost - de-emphasized */}
                        <Line
                          type="monotone"
                          dataKey="flexibleCost"
                          stroke="#d1d5db"
                          strokeWidth={2}
                          strokeDasharray="4 4"
                          dot={{ fill: "#d1d5db", strokeWidth: 1, r: 2 }}
                          name="Manual Market Price Cost"
                        />
                        
                        {/* Optimized cost - emphasized */}
                        <Line
                          type="monotone"
                          dataKey="optimizedCost"
                          stroke="#8b5cf6"
                          strokeWidth={4}
                          dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                          name="Optimized Market Price Cost"
                        />
                      </>
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center mt-4">
                {useFlexiblePricing ? (
                  <div className="space-y-2">
                    {useEnergyOptimization ? (
                      <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto">
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Fixed Price</p>
                          <p className="text-sm font-semibold text-gray-700">
                            £{(totalFixedCost/100).toFixed(2)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Manual Flexible</p>
                          <p className={`text-sm font-semibold ${totalFlexibleCost < totalFixedCost ? 'text-green-600' : 'text-red-600'}`}>
                            £{(totalFlexibleCost/100).toFixed(2)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-600">🤖 Optimized</p>
                          <p className="text-lg font-semibold text-purple-600">
                            £{(totalOptimizedCost/100).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Fixed Price</p>
                          <p className="text-lg font-semibold text-gray-700">
                            £{(totalFixedCost/100).toFixed(2)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Market Price</p>
                          <p className={`text-lg font-semibold ${totalFlexibleCost < totalFixedCost ? 'text-green-600' : 'text-red-600'}`}>
                            £{(totalFlexibleCost/100).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    )}
                    {useEnergyOptimization ? (
                      <div className="space-y-1">
                        {totalOptimizedCost < totalFixedCost ? (
                          <p className="text-sm text-purple-700 font-medium">
                            🤖 Smart savings vs fixed: £{((totalFixedCost - totalOptimizedCost)/100).toFixed(2)}
                          </p>
                        ) : (
                          <p className="text-sm text-red-700 font-medium">
                            📈 Extra cost vs fixed: £{((totalOptimizedCost - totalFixedCost)/100).toFixed(2)}
                          </p>
                        )}
                        {totalOptimizedCost < totalFlexibleCost && (
                          <p className="text-xs text-purple-600">
                            ⚡ Optimization saves £{((totalFlexibleCost - totalOptimizedCost)/100).toFixed(2)} vs manual flexible
                          </p>
                        )}
                      </div>
                    ) : (
                      totalFlexibleCost < totalFixedCost ? (
                        <p className="text-sm text-green-700 font-medium">
                          💰 Savings: £{((totalFixedCost - totalFlexibleCost)/100).toFixed(2)}
                        </p>
                      ) : (
                        <p className="text-sm text-red-700 font-medium">
                          📈 Extra cost: £{((totalFlexibleCost - totalFixedCost)/100).toFixed(2)}
                        </p>
                      )
                    )}
                    <p className="text-xs text-gray-600">
                      {scenario === 'windy-night' ? 'With flexible market pricing on this windy night' :
                       scenario === 'sunny-day' ? 'With flexible market pricing on this sunny day' :
                       'With flexible market pricing during grid stress conditions'}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-semibold text-gray-700">
                      Total daily cost: £{(totalCost/100).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      With a fixed price baseline
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Secondary Visualizations - De-emphasized */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Unit Rate Chart - De-emphasized */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 opacity-75">
                <p className="text-sm font-medium text-gray-600 mb-3 text-center">
                  {useFlexiblePricing ? "Market vs Fixed Rates" : "Hourly Unit Rates"}
                </p>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={scenarioData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                      <YAxis 
                        domain={[-5, scenario === 'grid-stress' ? 100 : 40]} 
                        tick={{ fontSize: 10 }}
                        label={{ value: 'Unit Rate (p/kWh)', angle: -90, position: 'outside' }}
                      />
                      <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="2 2" />
                      
                      {/* Fixed rates - always shown as baseline in dark grey */}
                      <Line
                        type="monotone"
                        dataKey="fixedRate"
                        stroke="#374151"
                        strokeWidth={2}
                        dot={{ fill: "#374151", strokeWidth: 1, r: 2 }}
                        name="Fixed Price"
                      />
                      
                      {/* Flexible rates - overlaid in color when active */}
                      {useFlexiblePricing && (
                        <Line
                          type="monotone"
                          dataKey="flexibleRate"
                          stroke="#10b981"
                          strokeWidth={3}
                          dot={{ fill: "#10b981", strokeWidth: 2, r: 3 }}
                          name="Market Price"
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Consumption Chart - De-emphasized */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 opacity-75">
                <p className="text-sm font-medium text-gray-600 mb-3 text-center">
                  {useEnergyOptimization && useFlexiblePricing ? "Manual vs Optimized Charging" : "Hourly Energy Consumption"}
                </p>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={scenarioData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                      <YAxis 
                        domain={[0, 12]} 
                        tick={{ fontSize: 10 }}
                        label={{ value: 'Consumption (kW)', angle: -90, position: 'outside' }}
                      />
                      
                      {/* Manual charging pattern - always shown */}
                      <Line
                        type="monotone"
                        dataKey="manualConsumption"
                        stroke="#6b7280"
                        strokeWidth={2}
                        strokeDasharray={useEnergyOptimization && useFlexiblePricing ? "4 4" : "0"}
                        dot={{ fill: '#6b7280', strokeWidth: 1, r: 2 }}
                        name="Manual Charging"
                      />
                      
                      {/* Optimized charging pattern - when enabled */}
                      {useEnergyOptimization && useFlexiblePricing && (
                        <Line
                          type="monotone"
                          dataKey="optimizedConsumption"
                          stroke="#8b5cf6"
                          strokeWidth={3}
                          dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 3 }}
                          name="Optimized Charging"
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

              <div className="text-center text-sm text-gray-400 px-24">
                <p>* The cost visualization above shows the combined effect of consumption patterns and unit rates</p>
                <p>** These visualisations assume the car battery's charge power is 3.6kW (i.e. single-phase * 230V * 16A) & the battery is 40kWh, and so it takes 11 hours or so to charge from empty.</p>
              </div>
            </div>
          </div>
          <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-center w-full bg-slate-300 hover:bg-blue-100 rounded-lg p-4 mb-8 transition-colors">
                <span className="text-lg font-semibold  mr-2">Are flexible prices all I need?</span>
                <ChevronDown className="h-5 w-5" />
              </CollapsibleTrigger>
              <CollapsibleContent className="bg-white border border-blue-200 rounded-b-lg p-6 text-left">
                <div className="space-y-4 text-gray-700">
                  <div>
                    <p className="font-medium text-blue-800">X:</p>
                    <p className="ml-4">I have an EV, does it matter when I charge it?</p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-green-800">Me:</p>
                    <p className="ml-4">Well, it depends. Do you pay time-of-use rates for your electricity?</p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-blue-800">X:</p>
                    <p className="ml-4">What's that?</p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-green-800">Me:</p>
                    <p className="ml-4">Typically electricity suppliers will charge you a fixed rate on your electricity depending on when you use it. You might be charged a night time price between 23:00 and 08:00, and a day time price between 08:00 and 23:00. If you charge your EV during the cheaper period you'll save money. If instead, you have access to flexible electricity rates, you could save more again.</p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-blue-800">X:</p>
                    <p className="ml-4">How?</p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-green-800">Me:</p>
                    <p className="ml-4">Well, it all comes down to the wholesale electricity markets. If you have access to these prices, they may well be lower than your fixed rates. However, bear in mind that they may also be far higher!</p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-blue-800">X:</p>
                    <p className="ml-4">That sounds like a lot of hassle</p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-green-800">Me:</p>
                    <p className="ml-4">It is hassle. Deciding the right time to buy and sell is hard work. That's why it's better left in the hands of a competent 3rd party who employs a team full time to manage this.</p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-blue-800">X:</p>
                    <p className="ml-4">Okay, let's say I am bothered enough to take this risk, does such a 3rd party exist?</p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-green-800">Me:</p>
                    <div className="ml-4 space-y-2">
                      <p>This depends on where you live. Octopus Energy, a UK-based electricity supplier, first announced flexible prices (Agile Octopus) <a 
                          href="https://octopusgroup.com/newsroom/latest-news/agile-octopus-time-of-use-tariff-pays-customers-to-use-energy-for-first-time-ever/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 underline hover:text-blue-800"
                        >in 2018</a>, however, (as of the 18th of June 2025) they still caveat that this is still a "Beta Product".</p>
                      <p>They don't yet, however, <a 
                            href="https://octopus.energy/blog/agile-smart-home-diy/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 underline hover:text-blue-800"
                          >take control of your EV charging</a>. Your EV charger may well already connect to flexible prices. If not, then find one that can. If you want to customise this control beyond what your EV charger lets you do, and your charger lets other machines talk to it (ie it allows for API access), there are software products growing around this use case. You could rely on something purpose-built (like Axle Energy), a no-code automation tool (like <a 
                        href="https://octopus.energy/blog/ifttt/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-800"
                      >IFTTT</a>), or you could grow your own solution.</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-medium text-blue-800">X:</p>
                    <p className="ml-4">Is there a happy halfway house? Do I have to go all in on flexible prices?</p>
                  </div>

                  <div>
                    <p className="font-medium text-green-800">Me:</p>
                    <p className="ml-4">I don't know. I hope that as this idea becomes more mature, you'll have more options.</p>
                  </div>

                  <div>
                    <p className="font-medium text-blue-800">X:</p>
                    <p className="ml-4">Okay, so let's say that I'm bothered to switch to a smart electricity supplier & install a smart charger, how much would I save on this setup?</p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-green-800">Me:</p>
                    <p className="ml-4">This is a little tricky to work out in advance because your savings will depend on future energy prices which aren't knowable, however, for storytelling purposes one can use historic prices.</p>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </TabsContent>

          <TabsList className="grid w-full grid-cols-2 mt-8">
            <TabsTrigger value="learn">📚 Learn the Basics</TabsTrigger>
            <TabsTrigger value="scenarios">🔧 Explore Scenarios</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm text-gray-600">
            <p>
              Interested in the code behind this tool? 
              <a 
                href="https://github.com/rdmolony/fixed-vs-variable-electricity-prices" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800 ml-1"
              >
                Check out the open source repository
              </a>
            </p>
            <span className="hidden sm:inline text-gray-400">|</span>
            <p>
              Questions or feedback? 
              <a 
                href="mailto:rowanmolony@gmail.com" 
                className="text-blue-600 underline hover:text-blue-800 ml-1"
              >
                Email me
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
