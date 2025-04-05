
import { SecurityAlert } from "@/lib/types";
import { 
  CheckCircle, 
  Clock, 
  AlertCircle,
  AlertTriangle,
  Shield,
} from "lucide-react";

interface SecurityAlertsListProps {
  alerts: SecurityAlert[];
}

export default function SecurityAlertsList({ alerts }: SecurityAlertsListProps) {
  const getSeverityIcon = (severity: SecurityAlert['severity']) => {
    switch (severity) {
      case 'high':
        return <AlertCircle className="text-red-500" size={20} />;
      case 'medium':
        return <AlertTriangle className="text-amber-500" size={20} />;
      case 'low':
        return <Shield className="text-green-500" size={20} />;
    }
  };

  const getStatusIcon = (status: SecurityAlert['status']) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'in_progress':
        return <Clock className="text-amber-500" size={16} />;
      case 'new':
        return <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // Less than a minute
    if (diff < 60000) {
      return 'Just now';
    }
    
    // Less than an hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    }
    
    // Less than a day
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}h ago`;
    }
    
    // More than a day
    const days = Math.floor(diff / 86400000);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-1">
      {alerts.map((alert) => (
        <div 
          key={alert.id} 
          className="flex items-start p-3 rounded-md hover:bg-gray-800/40 transition-colors gap-3"
        >
          <div className="flex-shrink-0 mt-1">
            {getSeverityIcon(alert.severity)}
          </div>
          
          <div className="flex-grow min-w-0">
            <div className="flex items-center">
              <h4 className="font-medium text-sm">{alert.title}</h4>
              <div className="ml-2 flex-shrink-0">
                {getStatusIcon(alert.status)}
              </div>
            </div>
            <p className="text-xs text-gray-400 line-clamp-2 mt-0.5">{alert.description}</p>
            <div className="flex items-center mt-1 text-xs text-gray-500">
              <span>{formatTime(alert.timestamp)}</span>
              <span className="mx-1">•</span>
              <span>{`User ${alert.userId}`}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
