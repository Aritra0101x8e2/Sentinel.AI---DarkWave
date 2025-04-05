
import { SecurityMetric } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface SecurityMetricCardProps {
  metric: SecurityMetric;
}

export default function SecurityMetricCard({ metric }: SecurityMetricCardProps) {
  const { name, value, previousValue, change } = metric;

  // Determine if the change is an increase or decrease
  const isIncrease = change > 0;
  
  // Determine if increase is good or bad based on the metric type
  const isPositiveMetric = name === 'Threats Blocked';
  const isNegativeChange = 
    (isPositiveMetric && !isIncrease) || 
    (!isPositiveMetric && isIncrease);

  // Set the color based on if the change is good or bad
  let changeColor = isNegativeChange ? "text-red-500" : "text-green-500";
  
  // Special case for metrics where increase is neutral
  if (name === 'Login Attempts' || name === 'Average Risk Score') {
    changeColor = "text-amber-500";
  }

  return (
    <Card className="bg-gray-800/60 border-gray-700 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col">
          <p className="text-sm text-gray-400">{name}</p>
          <div className="flex items-baseline space-x-2 mt-1">
            <h3 className="text-2xl font-bold">{value}</h3>
            <div className={`flex items-center text-xs font-medium ${changeColor}`}>
              {isIncrease ? (
                <ArrowUpIcon className="w-3 h-3 mr-1" />
              ) : (
                <ArrowDownIcon className="w-3 h-3 mr-1" />
              )}
              {Math.abs(change).toFixed(1)}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
