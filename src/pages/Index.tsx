
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import ElectricityChart from "@/components/ElectricityChart";
import { useState, useEffect } from "react";
import type { CarouselApi } from "@/components/ui/carousel";
import { ArrowDown, ChevronDown } from "lucide-react";

const Index = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Flexible Energy Scenarios
          </h1>
          <div className="text-xl text-gray-600 max-w-4xl mx-auto mb-6">
            <p>
              Do you have an EV, a heat pump or a battery?
            </p>
            <p className="pb-4">
              If so, flexible electricity tariffs might be of interest to you! 
            </p>
            <p>
              Let's explore a number of scenarios to get a feeling for how 
              switching from fixed to flexible electricity tariffs
              might impact your electricity spend and consumption.
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200 text-sm text-amber-800 rounded-lg p-4 max-w-4xl mx-auto mb-6">
            <p>
              <span className="font-semibold">Caveat:</span> This tool is intended as a storytelling device. 
              It is based on illustrative, fictitious data. 
            </p>
            <p>
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
          
          <div className="max-w-4xl mx-auto mb-12">
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-center w-full bg-blue-50 hover:bg-blue-100 rounded-lg p-4 transition-colors">
                <span className="text-lg font-semibold text-blue-900 mr-2">Want a refresher on tariffs?</span>
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
                    <p className="ml-4">It is hassle. Deciding the right time to buy and sell is hard work, however, there are 3rd parties who can help.</p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-blue-800">X:</p>
                    <p className="ml-4">Who?</p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-green-800">Me:</p>
                    <div className="ml-4 space-y-2">
                      <p>This depends on where you live. Octopus Energy, a UK-based electricity supplier, first announced flexible tariffs (Agile Octopus) <a 
                          href="https://octopusgroup.com/newsroom/latest-news/agile-octopus-time-of-use-tariff-pays-customers-to-use-energy-for-first-time-ever/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 underline hover:text-blue-800"
                        >in 2018</a>, however, they still caveat that this is still a "Beta Product" (as of the 18th of June 2025).</p>
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

        {/* Base Case Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Your Current Setup
            </h2>
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <p className="text-lg text-gray-700 mb-2">
                <span className="font-semibold">Fixed Time-of-Use Tariff:</span> You currently charge your EV during off-peak hours (1:00-3:30 AM)
              </p>
              <p className="text-gray-600">
                Consistent pricing: 20p/kWh off-peak, 30p/kWh peak • Predictable but limited savings potential
              </p>
            </div>
          </div>
          
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur">
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
