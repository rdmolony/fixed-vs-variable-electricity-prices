
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ElectricityChart from "@/components/ElectricityChart";
import FlexibilityMetrics from "@/components/FlexibilityMetrics";

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

        <div className="grid gap-6 mb-8">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800">
                Daily Electricity Prices vs Demand
              </CardTitle>
              <CardDescription className="text-lg">
                24-hour profile showing price variations and household demand patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ElectricityChart />
            </CardContent>
          </Card>

          <FlexibilityMetrics />
        </div>

        <div className="text-center text-gray-600">
          <p className="text-sm">
            * Scenario: EV charging at night, work-from-home during day
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
