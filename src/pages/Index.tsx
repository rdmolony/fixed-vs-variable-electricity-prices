
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import ElectricityChart from "@/components/ElectricityChart";
import { useState, useEffect } from "react";
import type { CarouselApi } from "@/components/ui/carousel";

const Index = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const scenarios = [
    {
      id: "fixed",
      title: "Fixed Tariff Pricing",
      description: "Fixed time-of-use tariff with consistent pricing periods",
      switchText: "Switch to Fixed Time-of-Use Tariff"
    },
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
    const prevIndex = current === 0 ? scenarios.length - 1 : current - 1;
    return scenarios[prevIndex];
  };

  const getNextScenario = () => {
    const nextIndex = current === scenarios.length - 1 ? 0 : current + 1;
    return scenarios[nextIndex];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            EV Charging Flexibility Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Demonstrate how smart EV charging can reduce your electricity costs by 
            shifting charging to low-price periods
          </p>
        </div>

        <div className="max-w-6xl mx-auto relative">
          <Carousel className="w-full" setApi={setApi} opts={{ loop: true }}>
            <CarouselContent>
              {scenarios.map((scenario) => (
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
                        <ElectricityChart scenario={scenario.id as "fixed" | "windy" | "sunny" | "volatile"} />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Enhanced Previous Button with Context */}
            <div className="absolute -left-32 top-1/2 -translate-y-1/2 flex flex-col items-center">
              <CarouselPrevious className="h-16 w-16 bg-white shadow-lg hover:bg-gray-50 border-2" />
              <div className="mt-4 text-center max-w-24">
                <p className="text-xs text-gray-600 font-medium leading-tight">
                  {getPreviousScenario().switchText}
                </p>
              </div>
            </div>

            {/* Enhanced Next Button with Context */}
            <div className="absolute -right-32 top-1/2 -translate-y-1/2 flex flex-col items-center">
              <CarouselNext className="h-16 w-16 bg-white shadow-lg hover:bg-gray-50 border-2" />
              <div className="mt-4 text-center max-w-24">
                <p className="text-xs text-gray-600 font-medium leading-tight">
                  {getNextScenario().switchText}
                </p>
              </div>
            </div>
          </Carousel>
        </div>

        <div className="text-center text-gray-600 mt-8">
          <p className="text-sm">
            * Scenario: 28kWh EV battery charged at 11kW (3-phase, 230V, 16A)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
