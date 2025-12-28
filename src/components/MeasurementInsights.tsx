import React from 'react';
import { TrendingUp, Ruler, Target, Activity, User } from 'lucide-react';

interface MeasurementData {
  height: string;
  chest: string;
  waist: string;
  hips: string;
  shoulders: string;
  inseam: string;
  size: string;
  photo?: string;
}

interface MeasurementInsightsProps {
  measurements: MeasurementData | null;
}

const MeasurementInsights: React.FC<MeasurementInsightsProps> = ({ measurements }) => {
  if (!measurements) {
    return (
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Measurement Insights
        </h3>
        <p className="text-muted-foreground text-center py-8">
          Take a measurement to see personalized insights about your body proportions and recommended sizes.
        </p>
      </div>
    );
  }

  // Parse measurements to numbers
  const chest = parseInt(measurements.chest) || 0;
  const waist = parseInt(measurements.waist) || 0;
  const hips = parseInt(measurements.hips) || 0;
  const shoulders = parseInt(measurements.shoulders) || 0;

  // Calculate body type based on actual measurements
  const getBodyType = (): { type: string; description: string } => {
    const shoulderToWaist = shoulders / waist;
    const chestToHip = chest / hips;
    
    if (shoulderToWaist > 0.55 && chest > waist + 10) {
      return { type: 'Athletic', description: 'Broad shoulders with defined waist' };
    } else if (Math.abs(chest - hips) < 5 && waist < chest - 8) {
      return { type: 'Hourglass', description: 'Balanced bust and hips with defined waist' };
    } else if (shoulders > hips + 5) {
      return { type: 'Inverted Triangle', description: 'Wider shoulders tapering to hips' };
    } else if (hips > shoulders + 5) {
      return { type: 'Pear', description: 'Hips wider than shoulders' };
    } else if (Math.abs(chest - waist) < 10 && Math.abs(waist - hips) < 10) {
      return { type: 'Rectangle', description: 'Balanced proportions throughout' };
    }
    return { type: 'Balanced', description: 'Well-proportioned measurements' };
  };

  // Calculate proportions rating
  const getProportions = (): { rating: string; description: string } => {
    const idealChestToWaist = 1.2;
    const actualRatio = chest / waist;
    const difference = Math.abs(actualRatio - idealChestToWaist);
    
    if (difference < 0.1) {
      return { rating: 'Excellent', description: 'Ideal chest-to-waist ratio' };
    } else if (difference < 0.2) {
      return { rating: 'Good', description: 'Near-ideal proportions' };
    }
    return { rating: 'Balanced', description: 'Standard proportions' };
  };

  const bodyType = getBodyType();
  const proportions = getProportions();

  const insights = [
    {
      icon: Ruler,
      title: 'Body Type',
      value: bodyType.type,
      description: bodyType.description,
      color: 'text-primary',
    },
    {
      icon: Target,
      title: 'Best Fit',
      value: measurements.size,
      description: 'Your recommended size across most brands',
      color: 'text-accent-green',
    },
    {
      icon: TrendingUp,
      title: 'Proportions',
      value: proportions.rating,
      description: proportions.description,
      color: 'text-accent-cyan',
    },
  ];

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
        <Activity className="w-5 h-5 text-primary" />
        Measurement Insights
      </h3>

      <div className="grid gap-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg"
          >
            <div className={`p-2 rounded-lg bg-background ${insight.color}`}>
              <insight.icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-muted-foreground">{insight.title}</p>
                <p className="font-semibold text-foreground">{insight.value}</p>
              </div>
              <p className="text-xs text-muted-foreground">{insight.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Your Measurements with Photo */}
      <div className="mt-6 pt-6 border-t border-border">
        <h4 className="text-sm font-medium text-foreground mb-4">Your Measurements</h4>
        
        <div className="flex gap-4">
          {/* Photo */}
          {measurements.photo && (
            <div className="w-24 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              <img 
                src={measurements.photo} 
                alt="Your measurement photo" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {!measurements.photo && (
            <div className="w-24 h-32 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
          
          {/* Measurements Grid */}
          <div className="flex-1 grid grid-cols-2 gap-2">
            {[
              { label: 'Height', value: measurements.height },
              { label: 'Chest', value: measurements.chest },
              { label: 'Waist', value: measurements.waist },
              { label: 'Hips', value: measurements.hips },
              { label: 'Shoulders', value: measurements.shoulders },
              { label: 'Inseam', value: measurements.inseam },
            ].map((item, index) => (
              <div key={index} className="bg-muted/30 rounded-lg p-2 text-center">
                <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
                <p className="font-semibold text-foreground text-sm">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeasurementInsights;
