
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import ElectricityChart from "@/components/ElectricityChart";

const Index = () => {
  const scenarios = [
    {
      id: "fixed",
      title: "Fixed Tariff Pricing",
      description: "Fixed time-of-use tariff with consistent pricing periods"
    },
    {
      id: "windy",
      title: "Windy Night Scenario",
      description: "High wind generation creates cheap nighttime electricity - perfect for EV charging"
    },
    {
      id: "sunny",
      title: "Sunny Day Scenario", 
      description: "High solar generation creates cheap daytime electricity - opportunity for daytime charging"
    },
    {
      id: "volatile",
      title: "Grid Issues Scenario",
      description: "Volatile and expensive prices due to grid constraints - charging flexibility becomes crucial"
    }
  ];

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

        <div className="max-w-6xl mx-auto">
          <Carousel className="w-full">
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
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <div className="text-center text-gray-600 mt-8">
          <p className="text-sm">
            * Scenario: 28kWh EV battery charged at 11kW (3-phase, 230V, 16A)
          </p>
          <p className="text-sm mt-2">
            Use the arrows or swipe to navigate between different pricing scenarios
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
