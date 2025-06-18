import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import ElectricityChart from "@/components/ElectricityChart";
import { useState, useEffect } from "react";
import type { CarouselApi } from "@/components/ui/carousel";
import { ArrowDown, ChevronDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, BarChart, Bar, ReferenceLine } from 'recharts';
import { Button } from "@/components/ui/button";

const Index = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [visualizationOption, setVisualizationOption] = useState(1);
  const [hoveredHour, setHoveredHour] = useState<string | null>(null);

  const variableScenarios = [
    {
      id: "windy",
      title: "Windy Night Scenario",
      description: "High wind generation creates cheap nighttime electricity - perfect for EV charging",
      switchText: "Switch to Variable Pricing During a Windy Night"
    },
    {
      id: "sunny",
      title: "Sunny Day Scenario", 
      description: "High solar generation creates cheap daytime electricity - opportunity for daytime charging",
      switchText: "Switch to Variable Pricing During a Sunny Day"
    },
    {
      id: "volatile",
      title: "Grid Issues Scenario",
      description: "Volatile and expensive prices due to grid constraints - charging flexibility becomes crucial",
      switchText: "Switch to Variable Pricing During Grid Issues"
    }
  ];

  useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const getPreviousScenario = () => {
    const prevIndex = current === 0 ? variableScenarios.length - 1 : current - 1;
    return variableScenarios[prevIndex];
  };

  const getNextScenario = () => {
    const nextIndex = current === variableScenarios.length - 1 ? 0 : current + 1;
    return variableScenarios[nextIndex];
  };

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

  const renderVisualizationOption = () => {
    const commonProps = {
      data: introData,
      margin: { left: 40, right: 5, top: 5, bottom: 5 }
    };

    switch (visualizationOption) {
      case 1:
        // Option 1: Cost-Focused Line Chart
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
              <YAxis 
                yAxisId="cost"
                orientation="left"
                domain={[0, 120]} 
                tick={{ fontSize: 12 }}
                stroke="#ef4444"
                label={{ value: 'Cost (pence/hour)', angle: -90, position: 'outside' }}
              />
              <YAxis 
                yAxisId="components"
                orientation="right"
                domain={[0, 35]} 
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
                label={{ value: 'Rate/Consumption', angle: 90, position: 'outsideRight' }}
              />
              {/* De-emphasized component lines */}
              <Line
                yAxisId="components"
                type="monotone"
                dataKey="unitRate"
                stroke="#9ca3af"
                strokeWidth={1}
                strokeOpacity={0.5}
                dot={false}
              />
              <Line
                yAxisId="components"
                type="monotone"
                dataKey="consumption"
                stroke="#cbd5e1"
                strokeWidth={1}
                strokeOpacity={0.5}
                dot={false}
              />
              {/* Emphasized cost line */}
              <Line
                yAxisId="cost"
                type="monotone"
                dataKey="cost"
                stroke="#ef4444"
                strokeWidth={4}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 2:
        // Option 2: Stacked Area Chart
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
              <YAxis 
                domain={[0, 120]} 
                tick={{ fontSize: 12 }}
                label={{ value: 'Cost (pence/hour)', angle: -90, position: 'outside' }}
              />
              {/* Background areas for components (subtle) */}
              <Area
                type="monotone"
                dataKey="unitRate"
                stackId="1"
                stroke="#e2e8f0"
                fill="#f8fafc"
                fillOpacity={0.3}
              />
              {/* Prominent cost area */}
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
        );

      case 3:
        // Option 3: Bar Chart with Cost Focus
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
              <YAxis 
                yAxisId="cost"
                orientation="left"
                domain={[0, 120]} 
                tick={{ fontSize: 12 }}
                stroke="#ef4444"
                label={{ value: 'Cost (pence/hour)', angle: -90, position: 'outside' }}
              />
              <YAxis 
                yAxisId="components"
                orientation="right"
                domain={[0, 35]} 
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
                label={{ value: 'Rate/Consumption', angle: 90, position: 'outsideRight' }}
              />
              {/* Cost bars (main focus) */}
              <Bar
                yAxisId="cost"
                dataKey="cost"
                fill="#ef4444"
                fillOpacity={0.8}
                stroke="#dc2626"
                strokeWidth={1}
              />
              {/* Subtle line overlays */}
              <Line
                yAxisId="components"
                type="monotone"
                dataKey="unitRate"
                stroke="#9ca3af"
                strokeWidth={1}
                strokeOpacity={0.6}
                dot={false}
              />
              <Line
                yAxisId="components"
                type="monotone"
                dataKey="consumption"
                stroke="#cbd5e1"
                strokeWidth={1}
                strokeOpacity={0.6}
                dot={false}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 4:
        // Option 4: Dual-Focus with Cost Highlights
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
              <YAxis 
                yAxisId="cost"
                orientation="left"
                domain={[0, 120]} 
                tick={{ fontSize: 12 }}
                stroke="#ef4444"
                label={{ value: 'Cost (pence/hour)', angle: -90, position: 'outside' }}
              />
              <YAxis 
                yAxisId="components"
                orientation="right"
                domain={[0, 35]} 
                tick={{ fontSize: 12 }}
                stroke="#3b82f6"
                label={{ value: 'Rate/Consumption', angle: 90, position: 'outsideRight' }}
              />
              
              {/* Reference lines for cheap periods */}
              <ReferenceLine yAxisId="components" x="00:00" stroke="#10b981" strokeDasharray="2 2" strokeOpacity={0.5} />
              <ReferenceLine yAxisId="components" x="08:00" stroke="#10b981" strokeDasharray="2 2" strokeOpacity={0.5} />
              <ReferenceLine yAxisId="components" x="23:00" stroke="#10b981" strokeDasharray="2 2" strokeOpacity={0.5} />
              
              {/* Cost area (highlighted) */}
              <Area
                yAxisId="cost"
                type="monotone"
                dataKey="cost"
                stroke="#ef4444"
                fill="#fef2f2"
                fillOpacity={0.6}
                strokeWidth={3}
              />
              
              {/* Component lines (de-emphasized) */}
              <Line
                yAxisId="components"
                type="monotone"
                dataKey="unitRate"
                stroke="#3b82f6"
                strokeWidth={2}
                strokeOpacity={0.7}
                dot={false}
              />
              <Line
                yAxisId="components"
                type="monotone"
                dataKey="consumption"
                stroke="#10b981"
                strokeWidth={2}
                strokeOpacity={0.7}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

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
                Let's imagine I have an electric vehicle that is charged from empty at night between 00:00 and 11:00 -
              </p>
            </div>

            <div className="space-y-6">
              {/* Primary Cost Chart */}
              <div className="bg-white rounded-lg p-6 border-2 border-red-200 shadow-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                  💰 Hourly Electricity Cost (This is what matters!)
                </h4>
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

              <div className="text-center py-4">
                <ArrowDown className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">This cost comes from two factors below:</p>
              </div>

              {/* De-emphasized component charts */}
              <div className="space-y-4 opacity-75">
                <p className="text-gray-600 text-sm">
                  For reference, here are the underlying components that determine the cost:
                </p>
                
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className="bg-gray-50 rounded-lg p-4 border cursor-pointer hover:bg-gray-100 transition-colors">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">EV Charging Pattern</h5>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart 
                            data={introData}
                            onMouseMove={(e) => e?.activeLabel && setHoveredHour(e.activeLabel)}
                            onMouseLeave={() => setHoveredHour(null)}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                            <YAxis 
                              domain={[0, 12]} 
                              tick={{ fontSize: 10 }}
                              label={{ value: 'Consumption (kW)', angle: -90, position: 'outside', style: { fontSize: 10 } }}
                            />
                            <Line
                              type="monotone"
                              dataKey="consumption"
                              stroke="#10b981"
                              strokeWidth={2}
                              dot={{ fill: '#10b981', strokeWidth: 1, r: 3 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-semibold">EV Charging Schedule</h4>
                      <p className="text-sm text-gray-600">
                        Your EV charges at 3.6kW from midnight to 11:00 AM, taking 11 hours to fully charge a 40kWh battery.
                      </p>
                      {hoveredHour && (
                        <div className="bg-blue-50 p-2 rounded text-xs">
                          <strong>Hour {hoveredHour}:</strong> {introData.find(d => d.hour === hoveredHour)?.consumption || 0}kW consumption
                        </div>
                      )}
                    </div>
                  </HoverCardContent>
                </HoverCard>

                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className="bg-gray-50 rounded-lg p-4 border cursor-pointer hover:bg-gray-100 transition-colors">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Electricity Unit Rates</h5>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart 
                            data={introData}
                            onMouseMove={(e) => e?.activeLabel && setHoveredHour(e.activeLabel)}
                            onMouseLeave={() => setHoveredHour(null)}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                            <YAxis 
                              domain={[0, 35]} 
                              tick={{ fontSize: 10 }}
                              label={{ value: 'Unit Rate (p/kWh)', angle: -90, position: 'outside', style: { fontSize: 10 } }}
                            />
                            <Line
                              type="monotone"
                              dataKey="unitRate"
                              stroke="#3b82f6"
                              strokeWidth={2}
                              dot={{ fill: '#3b82f6', strokeWidth: 1, r: 3 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-semibold">Time-of-Use Pricing</h4>
                      <p className="text-sm text-gray-600">
                        Night rate (23:00-08:00): 20p/kWh<br/>
                        Day rate (08:00-23:00): 30p/kWh
                      </p>
                      {hoveredHour && (
                        <div className="bg-blue-50 p-2 rounded text-xs">
                          <strong>Hour {hoveredHour}:</strong> {introData.find(d => d.hour === hoveredHour)?.unitRate || 0}p/kWh rate
                        </div>
                      )}
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>

              <div className="bg-blue-50 border-blue-200 text-sm text-gray-500 rounded-lg p-4">
                <p>
                  <span className="font-semibold">Note:</span> Cost = Consumption × Unit Rate. The EV draws 3.6kW during charging hours, 
                  and you're charged 20p/kWh at night or 30p/kWh during the day.
                </p>
              </div>
            </div>
          </div>
          
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur mt-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gray-800">
                Fixed Tariff Baseline
              </CardTitle>
              <CardDescription className="text-base">
                Your current charging pattern with fixed time-of-use pricing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ElectricityChart scenario="fixed" />
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <div className="inline-flex items-center justify-center bg-green-100 rounded-full p-4 mb-4">
              <ArrowDown className="h-8 w-8 text-green-600 animate-bounce" />
            </div>
            <p className="text-lg font-semibold text-gray-700">
              See how variable pricing with smart charging could save you money
            </p>
          </div>
        </div>

        {/* Variable Pricing Scenarios Section */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Flexibility Benefits with Variable Pricing
            </h2>
            <div className="bg-green-50 rounded-lg p-6 mb-6">
              <p className="text-lg text-gray-700 mb-2">
                <span className="font-semibold">Smart Charging:</span> Automatically shift charging to the cheapest electricity hours
              </p>
              <p className="text-gray-600">
                Variable pricing reflects real-time grid conditions • Your EV becomes a flexible asset that saves money
              </p>
            </div>
          </div>

          <div className="relative">
            <Carousel className="w-full" setApi={setApi} opts={{ loop: true }}>
              <CarouselContent>
                {variableScenarios.map((scenario) => (
                  <CarouselItem key={scenario.id}>
                    <div className="p-1">
                      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                        <CardHeader className="text-center">
                          <CardTitle className="text-2xl text-gray-800">
                            {scenario.title}
                          </CardTitle>
                          <CardDescription className="text-base">
                            {scenario.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ElectricityChart scenario={scenario.id as "windy" | "sunny" | "volatile"} />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              {/* Previous Button */}
              <div className="absolute -left-32 top-1/2 -translate-y-1/2">
                <CarouselPrevious className="h-16 w-16 bg-white shadow-lg hover:bg-gray-50 border-2" />
              </div>

              {/* Next Button */}
              <div className="absolute -right-32 top-1/2 -translate-y-1/2">
                <CarouselNext className="h-16 w-16 bg-white shadow-lg hover:bg-gray-50 border-2" />
              </div>
            </Carousel>
            
            {/* Previous Button Context Text - Above Button */}
            <div className="absolute -left-32 top-1/2 -translate-y-20 flex justify-center">
              <div className="text-center max-w-24">
                <p className="text-xs text-gray-600 font-medium leading-tight">
                  {getPreviousScenario().switchText}
                </p>
              </div>
            </div>

            {/* Next Button Context Text - Above Button */}
            <div className="absolute -right-32 top-1/2 -translate-y-20 flex justify-center">
              <div className="text-center max-w-24">
                <p className="text-xs text-gray-600 font-medium leading-tight">
                  {getNextScenario().switchText}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-600 mt-12">
          <p className="text-sm">
            * Scenario: 28kWh EV battery charged at 11kW (3-phase, 230V, 16A)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
