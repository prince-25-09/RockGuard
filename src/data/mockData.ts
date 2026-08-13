import {
  SensorReadings,
  RiskSector,
  RiskTrendPoint,
  AlertItem,
  PersonnelRecord,
  ImageScanResult
} from '../types';

export const INITIAL_SENSOR_READINGS: SensorReadings = {
  temperature: 28,
  windSpeed: 18,
  soilMoisture: 64,
  humidity: 72,
  rainfall24h: 12.4,
  seismicActivity: 'Low',
  slopeDisplacementRate: 4.2 // mm/day
};

export const RISK_TREND_DATA: RiskTrendPoint[] = [
  { time: '00:00', riskScore: 42, aiPrediction: 45, threshold: 80, rainfall: 0.0 },
  { time: '03:00', riskScore: 45, aiPrediction: 48, threshold: 80, rainfall: 0.5 },
  { time: '06:00', riskScore: 50, aiPrediction: 54, threshold: 80, rainfall: 2.1 },
  { time: '09:00', riskScore: 58, aiPrediction: 62, threshold: 80, rainfall: 4.8 },
  { time: '12:00', riskScore: 66, aiPrediction: 71, threshold: 80, rainfall: 7.2 },
  { time: '15:00', riskScore: 74, aiPrediction: 78, threshold: 80, rainfall: 9.8 },
  { time: '18:00', riskScore: 82, aiPrediction: 87, threshold: 80, rainfall: 12.4 },
  { time: '21:00', riskScore: 80, aiPrediction: 85, threshold: 80, rainfall: 12.4 },
  { time: '24:00 (Est)', riskScore: 78, aiPrediction: 88, threshold: 80, rainfall: 13.1 }
];

export const MINE_SECTORS: RiskSector[] = [
  {
    id: 'SEC-B12',
    name: 'Sector B-12',
    zoneType: 'Highwall',
    riskScore: 82,
    riskLevel: 'CRITICAL',
    hazardType: 'Rockfall & Bench Failure',
    lastScanTime: '4 min ago',
    coordinates: { x: 38, y: 32, lat: 23.7872, lng: 86.4351 },
    activeWorkers: 12,
    sensorsInstalled: 8,
    reasonSummary: 'Visible cracks + 12.4mm rainfall + 4.2mm/day displacement',
    recommendedActions: ['Inspect sector', 'Restrict Access', 'Deploy Drone Patrol', 'Evacuate Workers if rainfall exceeds 15mm']
  },
  {
    id: 'SEC-C04',
    name: 'Sector C-04',
    zoneType: 'Terrace Bench',
    riskScore: 65,
    riskLevel: 'WARNING',
    hazardType: 'High Rainfall & Silt Wash',
    lastScanTime: '12 min ago',
    coordinates: { x: 62, y: 28, lat: 23.7891, lng: 86.4382 },
    activeWorkers: 18,
    sensorsInstalled: 6,
    reasonSummary: 'Saturated soil moisture (64%) + concentrated drainage wash',
    recommendedActions: ['Clear drainage channels', 'Monitor Inclinometer Node #4', 'Issue Slow Speed Order for Haul Trucks']
  },
  {
    id: 'SEC-A08',
    name: 'Sector A-08',
    zoneType: 'Haul Road',
    riskScore: 58,
    riskLevel: 'MEDIUM',
    hazardType: 'Slope Shear Movement',
    lastScanTime: '18 min ago',
    coordinates: { x: 25, y: 55, lat: 23.7854, lng: 86.4320 },
    activeWorkers: 24,
    sensorsInstalled: 10,
    reasonSummary: 'Sub-surface shear movement detected on radar reflector #A-08',
    recommendedActions: ['Conduct visual walk-through', 'Re-calibrate prisms', 'Caution haul operators']
  },
  {
    id: 'SEC-D01',
    name: 'Sector D-01',
    zoneType: 'Waste Dump',
    riskScore: 28,
    riskLevel: 'SAFE',
    hazardType: 'Normal Stability',
    lastScanTime: '25 min ago',
    coordinates: { x: 80, y: 65, lat: 23.7920, lng: 86.4410 },
    activeWorkers: 32,
    sensorsInstalled: 5,
    reasonSummary: 'Settlement rates within safe engineering limits (< 0.5mm/day)',
    recommendedActions: ['Routine monitoring']
  },
  {
    id: 'SEC-E03',
    name: 'Sector E-03',
    zoneType: 'Crusher Zone',
    riskScore: 18,
    riskLevel: 'SAFE',
    hazardType: 'Bedrock Solid',
    lastScanTime: '30 min ago',
    coordinates: { x: 15, y: 80, lat: 23.7821, lng: 86.4290 },
    activeWorkers: 38,
    sensorsInstalled: 12,
    reasonSummary: 'No abnormal vibration or slope movement',
    recommendedActions: ['Standard operations']
  }
];

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'ALT-2026-891',
    title: 'Rockfall Risk Increased',
    description: 'Cracking along Bench 4 Highwall detected by AI drone scan. InSAR displacement accelerated to 4.2 mm/day.',
    severity: 'CRITICAL',
    sector: 'Sector B-12',
    sensorSource: 'AI Slope Scan',
    timestamp: '11 Aug 2026 22:14',
    status: 'ACTIVE',
    assignedTo: 'Rajesh Kumar (Chief Geotech)',
    recommendedActions: ['Inspect Site', 'Restrict Access', 'Evacuate Workers', 'Deploy Drone']
  },
  {
    id: 'ALT-2026-887',
    title: 'High Rainfall & Soil Saturation',
    description: 'Cumulative 24h rainfall reached 12.4mm with 64% soil moisture, increasing pore water pressure.',
    severity: 'WARNING',
    sector: 'Sector C-04',
    sensorSource: 'Rain Gauge',
    timestamp: '11 Aug 2026 21:40',
    status: 'ACTIVE',
    assignedTo: 'Anil Sharma (Site Safety Officer)',
    recommendedActions: ['Inspect Site', 'Clear Drainage Channels', 'Deploy Drone']
  },
  {
    id: 'ALT-2026-882',
    title: 'Slope Movement Detected',
    description: 'Radar node #A-08 registered 3.1mm lateral displacement over 6 hours along upper haul ramp.',
    severity: 'MEDIUM',
    sector: 'Sector A-08',
    sensorSource: 'InSAR Radar',
    timestamp: '11 Aug 2026 20:15',
    status: 'ACKNOWLEDGED',
    assignedTo: 'Sanjay Patel (Ramp Supervisor)',
    recommendedActions: ['Inspect Site', 'Restrict Access']
  },
  {
    id: 'ALT-2026-879',
    title: 'Crackmeter Sensor Disconnect',
    description: 'Crackmeter CM-04 in Waste Dump North experienced brief telemetry timeout.',
    severity: 'INFO',
    sector: 'Sector D-01',
    sensorSource: 'Crackmeter',
    timestamp: '11 Aug 2026 19:00',
    status: 'RESOLVED',
    assignedTo: 'Tech Support Team',
    recommendedActions: ['Check Relay Antenna']
  }
];

export const INITIAL_PERSONNEL: PersonnelRecord[] = [
  {
    id: 'WKR-101',
    name: 'Vikram Singh',
    role: 'Excavator Operator',
    sector: 'Sector B-12',
    status: 'EMERGENCY',
    lastUpdate: '12 sec ago',
    coordinates: { x: 39, y: 33 },
    heartRate: 118,
    oxygenLevel: 98,
    helmetBattery: 84,
    beaconSignal: 'Strong'
  },
  {
    id: 'WKR-102',
    name: 'Rohan Verma',
    role: 'Haul Truck Operator (Truck #4)',
    sector: 'Sector B-12',
    status: 'EMERGENCY',
    lastUpdate: '18 sec ago',
    coordinates: { x: 37, y: 31 },
    heartRate: 110,
    oxygenLevel: 97,
    helmetBattery: 92,
    beaconSignal: 'Strong'
  },
  {
    id: 'WKR-103',
    name: 'Suresh Das',
    role: 'Geotechnical Surveyor',
    sector: 'Sector B-12',
    status: 'EMERGENCY',
    lastUpdate: '25 sec ago',
    coordinates: { x: 40, y: 34 },
    heartRate: 105,
    oxygenLevel: 99,
    helmetBattery: 78,
    beaconSignal: 'Strong'
  },
  {
    id: 'WKR-104',
    name: 'Priya Mukherjee',
    role: 'Blasting Supervisor',
    sector: 'Sector C-04',
    status: 'CAUTION',
    lastUpdate: '30 sec ago',
    coordinates: { x: 61, y: 29 },
    heartRate: 88,
    oxygenLevel: 99,
    helmetBattery: 95,
    beaconSignal: 'Strong'
  },
  {
    id: 'WKR-105',
    name: 'Manoj Kumar',
    role: 'Drill Rig Specialist',
    sector: 'Sector C-04',
    status: 'CAUTION',
    lastUpdate: '45 sec ago',
    coordinates: { x: 63, y: 27 },
    heartRate: 92,
    oxygenLevel: 98,
    helmetBattery: 88,
    beaconSignal: 'Strong'
  },
  {
    id: 'WKR-106',
    name: 'Amitabh Roy',
    role: 'Safety Inspector',
    sector: 'Sector A-08',
    status: 'SAFE',
    lastUpdate: '1 min ago',
    coordinates: { x: 26, y: 56 },
    heartRate: 74,
    oxygenLevel: 99,
    helmetBattery: 100,
    beaconSignal: 'Strong'
  },
  {
    id: 'WKR-107',
    name: 'Deepak Rao',
    role: 'Ramp Controller',
    sector: 'Sector A-08',
    status: 'SAFE',
    lastUpdate: '1 min ago',
    coordinates: { x: 24, y: 54 },
    heartRate: 72,
    oxygenLevel: 99,
    helmetBattery: 91,
    beaconSignal: 'Strong'
  },
  {
    id: 'WKR-108',
    name: 'Suman Gupta',
    role: 'Crusher Operator',
    sector: 'Sector E-03',
    status: 'SAFE',
    lastUpdate: '2 min ago',
    coordinates: { x: 16, y: 81 },
    heartRate: 68,
    oxygenLevel: 100,
    helmetBattery: 96,
    beaconSignal: 'Strong'
  }
];

export const PRESET_MINE_IMAGES = [
  {
    id: 'preset-1',
    title: 'Highwall Tension Cracks (Sector B-12)',
    description: 'Highwall bench with visible steep shear tension cracks and loose debris overhang.',
    riskScore: 82,
    hazardType: 'Rockfall',
    severity: 'High',
    url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'preset-2',
    title: 'Bench Slope Washout (Sector C-04)',
    description: 'Terraced open-pit bench slope showing heavy water runoff drainage channels.',
    riskScore: 65,
    hazardType: 'Slope Instability',
    severity: 'Medium',
    url: 'https://images.unsplash.com/photo-1525896650794-60ad4ec40d0e?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'preset-3',
    title: 'Stable Rock Mass (Sector D-01)',
    description: 'Solid granite slope terrace with intact bench geometry and no active tension cracks.',
    riskScore: 18,
    hazardType: 'Normal',
    severity: 'None',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'
  }
];

export const MOCK_SCAN_RESULT: ImageScanResult = {
  crack_detected: true,
  crack_severity: 'High',
  rockfall_risk: 'High',
  overall_risk_score: 82,
  confidence: 91,
  hazard_type: 'Rockfall & Highwall Fracturing',
  explanation: 'Visible multi-directional cracking along the upper bench overhang indicates significant mechanical stress. Loose block fracturing poses an imminent rockfall hazard onto the lower haul ramp.',
  recommended_actions: [
    'Immediately restrict personnel and machinery access in Sector B-12 bench floor',
    'Set up automated InSAR radar tracking node focused on crack tip #4',
    'Deploy drone with thermal camera to check pore water seepage in fracture line',
    'Notify Shift Supervisor Rajesh Kumar for immediate bench stabilization review'
  ]
};
