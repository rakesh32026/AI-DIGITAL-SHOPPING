import React, { useState, useEffect } from 'react';
import { Camera, Download, Trash2, Sparkles, TrendingUp, Clock, Eye, FileText, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import DashboardHeader from '@/components/DashboardHeader';
import CameraMeasurement, { MeasurementData } from '@/components/CameraMeasurement';
import MeasurementInsights from '@/components/MeasurementInsights';
import RuvaChatbot from '@/components/RuvaChatbot';
import { useToast } from '@/hooks/use-toast';

interface Measurement extends MeasurementData {
  id: string;
  date: string;
}

const STORAGE_KEY = 'fitai_measurements';

const Dashboard: React.FC = () => {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selectedMeasurement, setSelectedMeasurement] = useState<Measurement | null>(null);
  const { toast } = useToast();

  // Load measurements from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setMeasurements(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse measurements:', e);
      }
    }
  }, []);

  // Save measurements to localStorage when they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(measurements));
  }, [measurements]);

  const latestMeasurement = measurements[0] || null;

  const stats = [
    { label: 'Total Measurements', value: measurements.length.toString() },
    { label: 'Latest Size', value: latestMeasurement?.size || '-' },
    { label: 'Accuracy', value: measurements.length > 0 ? '98%' : '-' },
    { label: 'Records', value: measurements.length.toString() },
  ];

  const chartData = measurements.slice().reverse().map((m, index) => ({
    name: `Scan ${index + 1}`,
    chest: parseInt(m.chest),
    waist: parseInt(m.waist),
    hips: parseInt(m.hips),
  }));

  const deleteMeasurement = (id: string) => {
    setMeasurements(prev => prev.filter(m => m.id !== id));
    toast({ title: 'Measurement deleted' });
  };

  const handleCapture = (data: MeasurementData) => {
    const newMeasurement: Measurement = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      ...data,
    };
    setMeasurements(prev => [newMeasurement, ...prev]);
    toast({ title: 'Measurement captured successfully!' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const exportToPDF = () => {
    if (measurements.length === 0) {
      toast({ title: 'No measurements to export', variant: 'destructive' });
      return;
    }
    
    // Create a simple text export (would integrate with actual PDF library)
    const content = measurements.map(m => 
      `Date: ${formatDate(m.date)}\nHeight: ${m.height}\nChest: ${m.chest}\nWaist: ${m.waist}\nHips: ${m.hips}\nShoulders: ${m.shoulders}\nInseam: ${m.inseam}\nSize: ${m.size}\n\n`
    ).join('---\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'measurements.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Measurements exported!' });
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* New Measurement Card */}
          <div className="measurement-card gradient-primary">
            <h2 className="text-xl font-bold mb-4">New Measurement</h2>
            <button
              onClick={() => setIsCameraActive(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-card text-primary rounded-lg font-medium hover:bg-card/90 transition-colors"
            >
              <Camera className="w-5 h-5" />
              Start Camera
            </button>
          </div>

          {/* Recommendations Card */}
          <div className="measurement-card gradient-success">
            <h2 className="text-xl font-bold mb-4">Recommendations</h2>
            <Link
              to="/recommendations"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-card text-accent-green rounded-lg font-medium hover:bg-card/90 transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              View Suggestions
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button 
            onClick={exportToPDF}
            disabled={measurements.length === 0}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            Export Data
          </button>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-cyan text-foreground rounded-lg font-medium hover:bg-accent-cyan/90 transition-colors"
          >
            <BarChart3 className="w-5 h-5" />
            Browse Products
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Measurement Progress Chart */}
        <div className="bg-card rounded-xl border border-border p-6 mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Measurement Progress
          </h3>
          {measurements.length < 2 ? (
            <div className="h-48 flex items-center justify-center bg-muted/50 rounded-lg">
              <p className="text-muted-foreground text-center px-4">
                {measurements.length === 0 
                  ? 'Take your first measurement to start tracking progress'
                  : 'Take one more measurement to see your progress chart'
                }
              </p>
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="chest" name="Chest" stroke="hsl(270, 70%, 50%)" strokeWidth={2} dot={{ fill: 'hsl(270, 70%, 50%)' }} />
                  <Line type="monotone" dataKey="waist" name="Waist" stroke="hsl(145, 65%, 45%)" strokeWidth={2} dot={{ fill: 'hsl(145, 65%, 45%)' }} />
                  <Line type="monotone" dataKey="hips" name="Hips" stroke="hsl(200, 100%, 50%)" strokeWidth={2} dot={{ fill: 'hsl(200, 100%, 50%)' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Measurement Insights */}
        <div className="mb-8">
          <MeasurementInsights measurements={latestMeasurement} />
        </div>

        {/* Recent Measurements */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Recent Measurements
          </h3>
          
          {measurements.length === 0 ? (
            <div className="text-center py-12">
              <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h4 className="text-lg font-medium text-foreground mb-2">No measurements yet</h4>
              <p className="text-muted-foreground mb-4">
                Start by taking a new measurement using the camera
              </p>
              <button
                onClick={() => setIsCameraActive(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                <Camera className="w-5 h-5" />
                Take Measurement
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {measurements.map((measurement) => (
                <div key={measurement.id} className="flex items-center gap-4 border border-border rounded-lg p-4">
                  <div className="w-16 h-16 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                    {measurement.photo ? (
                      <img 
                        src={measurement.photo} 
                        alt="Measurement" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Camera className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{formatDate(measurement.date)}</p>
                    <p className="text-sm text-muted-foreground">
                      Height: {measurement.height} • Chest: {measurement.chest} • Size: {measurement.size}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedMeasurement(measurement)}
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => deleteMeasurement(measurement.id)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Camera Measurement Modal */}
      <CameraMeasurement
        isOpen={isCameraActive}
        onClose={() => setIsCameraActive(false)}
        onCapture={handleCapture}
      />

      {/* Measurement Details Modal */}
      {selectedMeasurement && (
        <div className="fixed inset-0 z-50 bg-foreground/80 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-foreground mb-4">Measurement Details</h3>
            <p className="text-sm text-muted-foreground mb-4">{formatDate(selectedMeasurement.date)}</p>
            
            {/* Photo */}
            {selectedMeasurement.photo && (
              <div className="w-full h-48 rounded-lg overflow-hidden mb-4 bg-muted">
                <img 
                  src={selectedMeasurement.photo} 
                  alt="Measurement" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { label: 'Height', value: selectedMeasurement.height },
                { label: 'Chest', value: selectedMeasurement.chest },
                { label: 'Waist', value: selectedMeasurement.waist },
                { label: 'Hips', value: selectedMeasurement.hips },
                { label: 'Shoulders', value: selectedMeasurement.shoulders },
                { label: 'Inseam', value: selectedMeasurement.inseam },
              ].map((item, index) => (
                <div key={index} className="bg-muted rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="font-semibold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary font-medium">
                Size: {selectedMeasurement.size}
              </span>
              <button
                onClick={() => setSelectedMeasurement(null)}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RUVA Chatbot */}
      <RuvaChatbot />
    </div>
  );
};

export default Dashboard;
