/**
 * RockGuard Mine Safety Platform - Type Definitions
 */

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
  sector?: string;
}

export type PageView = 'overview' | 'scan' | 'map' | 'alerts' | 'personnel';

export type RiskLevel = 'CRITICAL' | 'HIGH' | 'WARNING' | 'MEDIUM' | 'SAFE' | 'LOW' | 'UNKNOWN';

export interface SensorReadings {
  temperature: number; // °C
  windSpeed: number; // km/h
  soilMoisture: number; // %
  humidity: number; // %
  rainfall24h: number; // mm
  seismicActivity: 'Low' | 'Moderate' | 'High' | 'Severe';
  slopeDisplacementRate?: number; // mm/day
}

export interface RiskSector {
  id: string;
  name: string; // e.g. "Sector B-12"
  zoneType: 'Highwall' | 'Haul Road' | 'Waste Dump' | 'Terrace Bench' | 'Crusher Zone';
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  hazardType: string; // e.g. "Rockfall", "Slope Movement", "Tension Crack"
  lastScanTime: string;
  coordinates: { x: number; y: number; lat?: number; lng?: number };
  activeWorkers: number;
  sensorsInstalled: number;
  reasonSummary: string;
  recommendedActions: string[];
}

export interface RiskTrendPoint {
  time: string;
  riskScore: number;
  aiPrediction: number;
  threshold: number;
  rainfall?: number;
}

export interface AlertItem {
  id: string; // e.g. "ALT-2026-891"
  title: string;
  description: string;
  severity: 'CRITICAL' | 'WARNING' | 'MEDIUM' | 'INFO';
  sector: string; // e.g. "Sector B-12"
  sensorSource: 'InSAR Radar' | 'Inclinometer' | 'Crackmeter' | 'Rain Gauge' | 'AI Slope Scan' | 'Seismic Node';
  timestamp: string;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  assignedTo: string;
  recommendedActions: string[];
}

export interface PersonnelRecord {
  id: string; // e.g. "WKR-104"
  name: string;
  role: string; // e.g. "Haul Truck Operator", "Geotechnical Specialist"
  sector: string;
  status: 'SAFE' | 'CAUTION' | 'EMERGENCY';
  lastUpdate: string;
  coordinates: { x: number; y: number };
  heartRate?: number;
  oxygenLevel?: number;
  helmetBattery?: number;
  beaconSignal?: 'Strong' | 'Weak' | 'Offline';
}

export interface ImageScanResult {
  crack_detected: boolean;
  crack_severity: 'High' | 'Medium' | 'Low' | 'None';
  rockfall_risk: 'High' | 'Medium' | 'Low';
  overall_risk_score: number;
  confidence: number;
  hazard_type: string;
  explanation: string;
  recommended_actions: string[];
  scanTimestamp?: string;
  imagePreviewUrl?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  contextUsed?: boolean;
}
