
import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import SecurityMetricCard from "@/components/dashboard/SecurityMetricCard";
import SecurityAlertsList from "@/components/dashboard/SecurityAlertsList";
import LoginHistoryTable from "@/components/dashboard/LoginHistoryTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { currentUser, mockSecurityMetrics, mockAlerts } from "@/lib/mockData";

export default function Dashboard() {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 1024);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    // Show welcome toast
    toast({
      title: "Welcome back, Admin",
      description: "Last login was from San Francisco, CA at 9:45 AM",
    });
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, [toast]);

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <div className="flex">
        {!isMobile && <Sidebar className="w-64" />}
        
        <main className="flex-1 ml-0 lg:ml-64 p-4 md:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Security Dashboard</h1>
            <p className="text-gray-400">
              Monitor and manage security threats in real-time
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {mockSecurityMetrics.map((metric) => (
              <SecurityMetricCard key={metric.name} metric={metric} />
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="lg:col-span-2 bg-gray-800/60 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Risk Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 36 36" className="w-full h-full">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#2d3748"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#0d9488"
                        strokeWidth="3"
                        strokeDasharray={`${currentUser.riskScore}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-3xl font-bold">{currentUser.riskScore}</span>
                      <span className="text-xs text-gray-400">Risk Score</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/60 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Recent Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <SecurityAlertsList alerts={mockAlerts.slice(0, 3)} />
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-gray-800/60 border-gray-700 mb-8">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Login History</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="recent">
                <div className="flex justify-between items-center mb-4">
                  <TabsList className="bg-gray-800">
                    <TabsTrigger value="recent">Recent</TabsTrigger>
                    <TabsTrigger value="flagged">Flagged</TabsTrigger>
                    <TabsTrigger value="all">All</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="recent" className="m-0">
                  <LoginHistoryTable attempts={currentUser.loginHistory.slice(0, 5)} />
                </TabsContent>
                
                <TabsContent value="flagged" className="m-0">
                  <LoginHistoryTable 
                    attempts={currentUser.loginHistory.filter(login => login.flagged)} 
                  />
                </TabsContent>
                
                <TabsContent value="all" className="m-0">
                  <LoginHistoryTable attempts={currentUser.loginHistory} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
