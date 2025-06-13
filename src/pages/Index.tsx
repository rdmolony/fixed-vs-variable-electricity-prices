
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ElectricityChart from "@/components/ElectricityChart";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Electricity Flexibility Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Demonstrate how smart demand management can reduce your electricity costs by 
            shifting consumption to low-price periods
          </p>
        </div>

        <div className="space-y-8">
          {/* Fixed Tariff Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Fixed Tariff Pricing</h2>
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">
                  Daily Electricity Prices vs Demand
                </CardTitle>
                <CardDescription className="text-base">
                  Fixed time-of-use tariff with consistent pricing periods
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ElectricityChart scenario="fixed" />
              </CardContent>
            </Card>
          </div>

          {/* Wholesale Pricing Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Wholesale Electricity Prices</h2>
            <div className="grid gap-6">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">
                    Windy Night Scenario
                  </CardTitle>
                  <CardDescription className="text-base">
                    High wind generation creates cheap nighttime electricity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ElectricityChart scenario="windy" />
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">
                    Sunny Day Scenario
                  </CardTitle>
                  <CardDescription className="text-base">
                    High solar generation creates cheap daytime electricity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ElectricityChart scenario="sunny" />
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">
                    Grid Issues Scenario
                  </CardTitle>
                  <CardDescription className="text-base">
                    Volatile and expensive prices due to grid constraints
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ElectricityChart scenario="volatile" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-600 mt-8">
          <p className="text-sm">
            * Scenario: EV charging at night, work-from-home during day
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
