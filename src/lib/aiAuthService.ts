
import { LoginAttempt, RiskAssessment, RiskFactor, User, DeviceInfo, LocationInfo } from './types';

// Mock AI service that analyzes user behavior and authentication
export class AIAuthService {
  // Analyze a login attempt and return a risk assessment
  static analyzeLoginAttempt(attempt: LoginAttempt, user: User): RiskAssessment {
    const factors: RiskFactor[] = [
      this.analyzeDevice(attempt.device, user),
      this.analyzeLocation(attempt.location, user),
      this.analyzeTimePattern(attempt.timestamp, user),
      this.analyzeBehavioralPatterns(attempt, user)
    ];
    
    // Calculate overall score
    const totalWeight = factors.reduce((sum, factor) => sum + factor.weight, 0);
    const weightedScore = factors.reduce((sum, factor) => sum + (factor.score * factor.weight), 0) / totalWeight;
    const finalScore = Math.round(weightedScore);
    
    // Determine recommendation
    let recommendation: 'allow' | 'challenge' | 'block' = 'allow';
    if (finalScore > 75) {
      recommendation = 'block';
    } else if (finalScore > 50) {
      recommendation = 'challenge';
    }
    
    return {
      score: finalScore,
      factors,
      recommendation
    };
  }
  
  // Analyze if device is suspicious
  private static analyzeDevice(device: DeviceInfo, user: User): RiskFactor {
    const knownDevices = user.loginHistory
      .filter(login => login.successful)
      .map(login => login.device);
      
    const isKnownDevice = knownDevices.some(d => d.id === device.id);
    const similarDevices = knownDevices.filter(d => 
      d.type === device.type && 
      d.os === device.os && 
      d.browser === device.browser
    );
    
    let score = 0;
    let description = 'Device is known and trusted';
    
    if (!isKnownDevice) {
      score += 40;
      description = 'New device detected';
      
      if (similarDevices.length === 0) {
        score += 20;
        description = 'Completely new device type and configuration';
      }
    }
    
    return {
      name: 'Device Analysis',
      description,
      weight: 30,
      score
    };
  }
  
  // Analyze if location is suspicious
  private static analyzeLocation(location: LocationInfo, user: User): RiskFactor {
    const knownLocations = user.loginHistory
      .filter(login => login.successful)
      .map(login => login.location);
      
    const isKnownLocation = knownLocations.some(loc => 
      loc.country === location.country && 
      loc.city === location.city
    );
    
    let score = 0;
    let description = 'Location is known and trusted';
    
    if (!isKnownLocation) {
      score += 50;
      description = 'New login location detected';
      
      const hasAnyLoginFromCountry = knownLocations.some(loc => loc.country === location.country);
      if (!hasAnyLoginFromCountry) {
        score += 25;
        description = 'First login from this country';
      }
    }
    
    // Check for impossible travel
    const lastLogin = user.loginHistory[0];
    if (lastLogin) {
      const timeDiff = new Date().getTime() - lastLogin.timestamp.getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      
      if (hoursDiff < 24 && lastLogin.location.country !== location.country) {
        const distance = this.calculateDistance(
          lastLogin.location.latitude, 
          lastLogin.location.longitude,
          location.latitude,
          location.longitude
        );
        
        const speedKmh = distance / hoursDiff;
        if (speedKmh > 800) { // Faster than typical airplane
          score = 100;
          description = 'Impossible travel detected';
        }
      }
    }
    
    return {
      name: 'Location Analysis',
      description,
      weight: 25,
      score
    };
  }
  
  // Calculate distance between coordinates (Haversine formula)
  private static calculateDistance(
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number {
    const R = 6371; // Earth radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
  
  private static deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }
  
  // Analyze login time patterns
  private static analyzeTimePattern(timestamp: Date, user: User): RiskFactor {
    const loginTimes = user.loginHistory
      .filter(login => login.successful)
      .map(login => login.timestamp);
    
    if (loginTimes.length < 3) {
      return {
        name: 'Time Pattern Analysis',
        description: 'Not enough login history to analyze time patterns',
        weight: 15,
        score: 50
      };
    }
    
    const currentHour = timestamp.getHours();
    
    // Check if user typically logs in during similar hours
    const hourFrequency: Record<number, number> = {};
    loginTimes.forEach(time => {
      const hour = time.getHours();
      hourFrequency[hour] = (hourFrequency[hour] || 0) + 1;
    });
    
    const typicalHours = Object.entries(hourFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(entry => parseInt(entry[0]));
    
    let score = 0;
    let description = 'Login time matches typical pattern';
    
    if (!typicalHours.includes(currentHour)) {
      const nearestTypicalHour = typicalHours.reduce((nearest, hour) => {
        const diff = Math.min(
          Math.abs(hour - currentHour),
          Math.abs((hour + 24) - currentHour),
          Math.abs(hour - (currentHour + 24))
        );
        const currentNearest = Math.min(
          Math.abs(nearest - currentHour),
          Math.abs((nearest + 24) - currentHour),
          Math.abs(nearest - (currentHour + 24))
        );
        return diff < currentNearest ? hour : nearest;
      }, typicalHours[0]);
      
      const hourDiff = Math.min(
        Math.abs(nearestTypicalHour - currentHour),
        Math.abs((nearestTypicalHour + 24) - currentHour),
        Math.abs(nearestTypicalHour - (currentHour + 24))
      );
      
      if (hourDiff > 6) {
        score = 70;
        description = 'Login time significantly outside typical pattern';
      } else if (hourDiff > 3) {
        score = 40;
        description = 'Login time outside typical pattern';
      } else {
        score = 20;
        description = 'Login time slightly outside typical pattern';
      }
    }
    
    return {
      name: 'Time Pattern Analysis',
      description,
      weight: 15,
      score
    };
  }
  
  // Analyze behavioral patterns (typing, mouse movements, etc)
  private static analyzeBehavioralPatterns(attempt: LoginAttempt, user: User): RiskFactor {
    // This would be a sophisticated analysis in a real implementation
    // For now we'll use a simplified calculation based on past behaviors
    
    const patternConfidence = attempt.behaviors.reduce(
      (sum, behavior) => sum + behavior.confidence, 
      0
    ) / attempt.behaviors.length;
    
    // Map confidence (0-100) to risk score (100-0) inverted
    const score = 100 - patternConfidence;
    
    let description = 'Behavior patterns match user profile';
    if (score > 70) {
      description = 'Significant anomalies in behavioral patterns';
    } else if (score > 40) {
      description = 'Some anomalies in behavioral patterns';
    }
    
    return {
      name: 'Behavioral Analysis',
      description,
      weight: 30,
      score
    };
  }
  
  // Generate a risk score for a user based on login history
  static calculateUserRiskScore(user: User): number {
    if (user.loginHistory.length === 0) {
      return 50; // Default moderate risk for new users
    }
    
    // Factors to consider:
    // 1. Recent failed login attempts
    // 2. Geographic dispersion
    // 3. Device diversity
    // 4. Time pattern regularity
    
    const recentAttempts = user.loginHistory.slice(0, 10);
    const failedCount = recentAttempts.filter(attempt => !attempt.successful).length;
    const failedRate = failedCount / recentAttempts.length;
    
    // Geographic dispersion
    const uniqueCountries = new Set(recentAttempts.map(attempt => attempt.location.country));
    const uniqueCities = new Set(recentAttempts.map(attempt => 
      `${attempt.location.country}-${attempt.location.city}`
    ));
    
    // Device diversity
    const uniqueDevices = new Set(recentAttempts.map(attempt => attempt.device.id));
    const uniqueDeviceTypes = new Set(recentAttempts.map(attempt => 
      `${attempt.device.type}-${attempt.device.os}-${attempt.device.browser}`
    ));
    
    // Calculate risk components
    const failedRisk = failedRate * 100;
    const geoRisk = (uniqueCountries.size > 3 ? 100 : uniqueCountries.size * 30) * 
                  (uniqueCities.size > 5 ? 1 : uniqueCities.size / 5);
    const deviceRisk = (uniqueDevices.size > 3 ? 80 : uniqueDevices.size * 25) *
                    (uniqueDeviceTypes.size > 3 ? 1 : uniqueDeviceTypes.size / 3);
    
    // Combine into overall risk score
    const riskScore = Math.round(
      (failedRisk * 0.4) + 
      (geoRisk * 0.3) + 
      (deviceRisk * 0.3)
    );
    
    return Math.min(100, Math.max(0, riskScore));
  }
}
