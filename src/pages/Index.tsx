import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, BarChart, Bar, ReferenceLine } from 'recharts';

const Index = () => {
  const [hoveredHour, setHoveredHour] = useState<string | null>(null);

  // Generate simple demonstration data for intro charts
  const generateIntroData = () => {
    const data = [];
    for (let hour = 0; hour < 24; hour++) {
      // EV charging between 00:00 and 11:00 (11 hours total)
      let consumption = 0;
      if (hour >= 0 && hour < 11) {
        consumption = 3.6; // Full 3.6kW charging
      }
      
      // Fixed tariff: 20p night (23:00-08:00), 30p day (08:00-23:00)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Flexible Energy Scenario Explorer
          </h1>
          <div className="text-xl text-gray-600 max-w-4xl mx-auto mb-6">
            <p className="pb-4">
              This dashboard let's us explore a number of scenarios to get a feeling for how 
              switching to flexible electricity tariffs might impact electricity spend and demand.
            </p>
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

        {/* Intro Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Intro
            </h2>
          </div>

          <div className="max-w-4xl mx-auto mb-12">
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-center w-full bg-blue-50 hover:bg-blue-100 rounded-lg p-4 transition-colors">
                <span className="text-lg font-semibold text-blue-900 mr-2">Need a refresher on electricity tariffs?</span>
                <ChevronDown className="h-5 w-5 text-blue-700" />
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
                    <p className="ml-4">Typically electricity suppliers will charge you a fixed rate on your electricity depending on when you use it. You might be charged a night time tariff between 23:00 and 08:00, and a day time tariff between 08:00 and 23:00. If you charge your EV during the cheaper period you'll save money. If instead, you have access to flexible electricity rates, you could save more again.</p>
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
                      <p>This depends on where you live. Octopus Energy, a UK-based electricity supplier, first announced flexible tariffs (Agile Octopus) <a 
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
                          >take control of your EV charging</a>. Your EV charger may well already connect to a flexible tariff. If not, then find one that can. If you want to customise this control beyond what your EV charger lets you do, and your charger lets other machines talk to it (ie it allows for API access), there are software products growing around this use case. You could rely on something purpose-built (like Axle Energy), a no-code automation tool (like <a 
                        href="https://octopus.energy/blog/ifttt/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-800"
                      >IFTTT</a>), or you could grow your own solution.</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-medium text-blue-800">X:</p>
                    <p className="ml-4">Okay, so let's say that I'm bothered to switch to a smart electricity supplier & install a smart charger, how much would I save on this setup?</p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-green-800">Me:</p>
                    <p className="ml-4">This is a little tricky to work out in advance because your savings will depend on future energy prices which aren't knowable. For storytelling purposes one can use historic prices.</p>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
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

          <div className="bg-blue-50 border-blue-200 text-sm text-gray-500 rounded-lg p-4 max-w-4xl mx-auto mb-6">
            <p>
              <span className="font-semibold">Note:</span> Assuming the car battery's charge power is 3.6kW (single-phase * 230V * 16A) & the battery is 40kWh. This means it takes 11 hours or so to charge from empty.
            </p>
          </div>
              
              <div>
                <p className="text-gray-700 mb-4">
                  Let's say I'm on a fixed tariff of 20p/kWh during the night and 30p/kWh during the day.
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
              My cost is the product of my consumption and unit rate (i.e. <code>Cost = Consumption × Unit Rate</code>)
              </p>
            </div>

            <div className="space-y-6">
              {/* Primary Cost Chart */}
              <div className="bg-white rounded-lg p-6 border-2 border-red-200 shadow-lg">
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
          </div>
        </div>

        {/* Scenarios Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Scenarios
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Compare different charging strategies and their impact on electricity costs
            </p>
          </div>

          <div className="space-y-8 text-left max-w-5xl mx-auto">
            {/* Primary Cost Visualization - Emphasized */}
            <div className="bg-white rounded-lg p-8 border-2 border-red-200 shadow-xl">
              <p className="text-2xl font-bold text-gray-800 mb-6 text-center">
                💰 Hourly Electricity Cost
              </p>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart 
                    data={introData}
                    onMouseMove={(e) => e?.activeLabel && setHoveredHour(e.activeLabel)}
                    onMouseLeave={() => setHoveredHour(null)}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="hour" tick={{ fontSize: 14 }} />
                    <YAxis 
                      domain={[0, 120]} 
                      tick={{ fontSize: 14 }}
                      label={{ value: 'Cost (pence/hour)', angle: -90, position: 'outside' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="cost"
                      stroke="#ef4444"
                      fill="#fef2f2"
                      fillOpacity={0.8}
                      strokeWidth={4}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center mt-4">
                <p className="text-lg font-semibold text-red-600">
                  Total daily cost: 792 pence (£7.92)
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  This is what you pay for charging your EV with a fixed tariff
                </p>
              </div>
            </div>

            {/* Secondary Visualizations - De-emphasized */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Unit Rate Chart - De-emphasized */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 opacity-75">
                <p className="text-sm font-medium text-gray-600 mb-3 text-center">
                  Hourly Unit Rates
                </p>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={introData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                      <YAxis 
                        domain={[0, 35]} 
                        tick={{ fontSize: 10 }}
                        label={{ value: 'Unit Rate (p/kWh)', angle: -90, position: 'outside' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="unitRate"
                        stroke="#6b7280"
                        strokeWidth={2}
                        dot={{ fill: '#6b7280', strokeWidth: 1, r: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Consumption Chart - De-emphasized */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 opacity-75">
                <p className="text-sm font-medium text-gray-600 mb-3 text-center">
                  Hourly Energy Consumption
                </p>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={introData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                      <YAxis 
                        domain={[0, 12]} 
                        tick={{ fontSize: 10 }}
                        label={{ value: 'Consumption (kW)', angle: -90, position: 'outside' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="consumption"
                        stroke="#6b7280"
                        strokeWidth={2}
                        dot={{ fill: '#6b7280', strokeWidth: 1, r: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-gray-500">
              <p>The cost visualization above shows the combined effect of consumption patterns and unit rates</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
