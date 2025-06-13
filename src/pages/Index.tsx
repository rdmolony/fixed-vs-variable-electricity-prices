
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import ElectricityChart from "@/components/ElectricityChart";
import { useState, useEffect } from "react";
import type { CarouselApi } from "@/components/ui/carousel";
import { ArrowDown } from "lucide-react";

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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            EV Charging Flexibility Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how smart EV charging can reduce your electricity costs by 
            shifting charging to optimal pricing periods
          </p>
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
