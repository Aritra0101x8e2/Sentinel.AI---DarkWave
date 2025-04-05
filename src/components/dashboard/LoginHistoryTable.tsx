
import { useState } from "react";
import { LoginAttempt } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Map,
  Laptop,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface LoginHistoryTableProps {
  attempts: LoginAttempt[];
}

export default function LoginHistoryTable({ attempts }: LoginHistoryTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const toggleExpandRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="border border-gray-700 rounded-md overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-gray-800/50">
            <TableHead className="w-12"></TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Device</TableHead>
            <TableHead>Risk Score</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attempts.map((attempt) => (
            <>
              <TableRow 
                key={attempt.id} 
                className={`
                  hover:bg-gray-800/50 cursor-pointer
                  ${attempt.flagged ? 'bg-red-900/10' : ''}
                `}
                onClick={() => toggleExpandRow(attempt.id)}
              >
                <TableCell>
                  {attempt.successful ? (
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Check size={14} className="text-green-500" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                      <X size={14} className="text-red-500" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  {formatDate(attempt.timestamp)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <span>{attempt.location.city}, {attempt.location.country}</span>
                    {!attempt.location.isKnown && (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <span>
                      {attempt.device.type} - {attempt.device.browser}
                    </span>
                    {!attempt.device.isKnown && (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div 
                      className={`w-10 h-2 rounded-full ${
                        attempt.riskScore > 75 ? 'bg-red-500' :
                        attempt.riskScore > 50 ? 'bg-amber-500' : 'bg-green-500'
                      }`}
                    />
                    <span>{attempt.riskScore}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {attempt.flagged ? (
                    <Badge variant="destructive" className="gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Flagged
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1 bg-green-900/20 border-green-800 text-green-400">
                      <Check className="w-3 h-3" />
                      Clear
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {expandedRow === attempt.id ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </TableCell>
              </TableRow>
              {expandedRow === attempt.id && (
                <TableRow className="bg-gray-800/30 border-t-0">
                  <TableCell colSpan={7} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium flex items-center">
                          <Map className="w-4 h-4 mr-2 text-gray-400" />
                          Location Details
                        </h4>
                        <div className="bg-gray-800/50 rounded-md p-3 text-sm">
                          <div className="grid grid-cols-2 gap-y-1">
                            <span className="text-gray-400">IP Address:</span>
                            <span>{attempt.location.ip}</span>
                            <span className="text-gray-400">Country:</span>
                            <span>{attempt.location.country}</span>
                            <span className="text-gray-400">City:</span>
                            <span>{attempt.location.city}</span>
                            <span className="text-gray-400">Time Zone:</span>
                            <span>{attempt.location.timeZone}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium flex items-center">
                          <Laptop className="w-4 h-4 mr-2 text-gray-400" />
                          Device Details
                        </h4>
                        <div className="bg-gray-800/50 rounded-md p-3 text-sm">
                          <div className="grid grid-cols-2 gap-y-1">
                            <span className="text-gray-400">Type:</span>
                            <span>{attempt.device.type}</span>
                            <span className="text-gray-400">Operating System:</span>
                            <span>{attempt.device.os}</span>
                            <span className="text-gray-400">Browser:</span>
                            <span>{attempt.device.browser}</span>
                            <span className="text-gray-400">Known Device:</span>
                            <span>{attempt.device.isKnown ? 'Yes' : 'No'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          Behavioral Data
                        </h4>
                        <div className="bg-gray-800/50 rounded-md p-3 text-sm">
                          <div className="space-y-2">
                            {attempt.behaviors.map((behavior) => (
                              <div key={behavior.id} className="flex justify-between">
                                <span className="text-gray-400">
                                  {behavior.type.replace('_', ' ')}:
                                </span>
                                <div 
                                  className={`px-1.5 py-0.5 rounded text-xs ${
                                    behavior.confidence > 75 ? 'bg-green-900/20 text-green-400' :
                                    behavior.confidence > 40 ? 'bg-amber-900/20 text-amber-400' :
                                    'bg-red-900/20 text-red-400'
                                  }`}
                                >
                                  {Math.round(behavior.confidence)}% match
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {attempt.flagged && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-green-700 text-green-400 hover:text-green-300 hover:bg-green-900/20"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Mark as Valid
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-red-700 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Block IP Address
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-gray-700 text-gray-400 hover:text-gray-300"
                        >
                          Require 2FA
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
