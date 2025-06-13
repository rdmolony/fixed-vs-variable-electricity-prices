
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Zap, PoundSterling } from "lucide-react";

const FlexibilityMetrics = () => {
  // Calculate savings potential
  const highPriceHours = 15; // 08:00-23:00
  const lowPriceHours = 9;   // 23:00-08:00
  const highPrice = 30; // p/kWh
  const lowPrice = 20;  // p/kWh
  const averageShiftableLoad = 3; // kWh that could be shifted

  const currentCost = (highPriceHours * 2.5 * highPrice + lowPriceHours * 4.5 * lowPrice) / 100;
  const optimizedCost = (highPriceHours * 1.5 * highPrice + lowPriceHours * 5.5 * lowPrice) / 100;
  const dailySavings = currentCost - optimizedCost;
  const annualSavings = dailySavings * 365;

  return (
    <div className="grid md:grid-cols-4 gap-4">
      <Card className="bg-white/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Price Difference
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">10p/kWh</div>
          <p className="text-xs text-gray-500">
            Peak vs off-peak
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Shiftable Load
          </CardTitle>
          <Zap className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{averageShiftableLoad} kWh</div>
          <p className="text-xs text-gray-500">
            Daily average
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Daily Savings
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">£{dailySavings.toFixed(2)}</div>
          <p className="text-xs text-gray-500">
            Through load shifting
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Annual Potential
          </CardTitle>
          <PoundSterling className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">£{annualSavings.toFixed(0)}</div>
          <p className="text-xs text-gray-500">
            Yearly savings
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FlexibilityMetrics;
