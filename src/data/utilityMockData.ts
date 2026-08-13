import { UnitUtilityMeter, HourlyConsumption, DailyConsumption, ApplianceUsageBreakdown, UtilityAnomalyAlert } from "../types";

export const mockUnitMeters: UnitUtilityMeter[] = [
  {
    unitNumber: "A-402",
    tower: "Tower A",
    meterIdElectricity: "EM-A402-9831",
    meterIdWater: "WM-A402-4412",
    status: "Online",
    liveVoltageVolts: 232.4,
    liveCurrentLoadKw: 2.15,
    liveWaterFlowLpm: 3.2,
    liveWaterPressureBar: 3.8,
    todayElectricityKWh: 14.8,
    todayWaterLiters: 285,
    monthElectricityKWh: 342,
    monthWaterLiters: 7850,
    monthElectricityBill: 51.30,
    monthWaterBill: 23.55,
    budgetElectricityKWh: 400,
    budgetWaterLiters: 9000,
    mainWaterValveOpen: true,
    solarContributionKWh: 68.4,
    co2SavedKg: 28.5
  },
  {
    unitNumber: "A-102",
    tower: "Tower A",
    meterIdElectricity: "EM-A102-1120",
    meterIdWater: "WM-A102-3391",
    status: "Online",
    liveVoltageVolts: 231.8,
    liveCurrentLoadKw: 1.40,
    liveWaterFlowLpm: 0.0,
    liveWaterPressureBar: 4.0,
    todayElectricityKWh: 11.2,
    todayWaterLiters: 210,
    monthElectricityKWh: 290,
    monthWaterLiters: 6200,
    monthElectricityBill: 43.50,
    monthWaterBill: 18.60,
    budgetElectricityKWh: 350,
    budgetWaterLiters: 7500,
    mainWaterValveOpen: true,
    solarContributionKWh: 52.0,
    co2SavedKg: 21.6
  },
  {
    unitNumber: "B-201",
    tower: "Tower B",
    meterIdElectricity: "EM-B201-7721",
    meterIdWater: "WM-B201-9011",
    status: "Warning",
    liveVoltageVolts: 228.1,
    liveCurrentLoadKw: 4.85,
    liveWaterFlowLpm: 12.5,
    liveWaterPressureBar: 3.2,
    todayElectricityKWh: 22.4,
    todayWaterLiters: 480,
    monthElectricityKWh: 510,
    monthWaterLiters: 11400,
    monthElectricityBill: 81.60,
    monthWaterBill: 39.90,
    budgetElectricityKWh: 450,
    budgetWaterLiters: 9500,
    mainWaterValveOpen: true,
    solarContributionKWh: 88.0,
    co2SavedKg: 36.8
  },
  {
    unitNumber: "PH-01",
    tower: "Penthouse",
    meterIdElectricity: "EM-PH01-0001",
    meterIdWater: "WM-PH01-0002",
    status: "Online",
    liveVoltageVolts: 233.0,
    liveCurrentLoadKw: 6.20,
    liveWaterFlowLpm: 8.0,
    liveWaterPressureBar: 4.2,
    todayElectricityKWh: 32.1,
    todayWaterLiters: 620,
    monthElectricityKWh: 720,
    monthWaterLiters: 15800,
    monthElectricityBill: 118.80,
    monthWaterBill: 55.30,
    budgetElectricityKWh: 800,
    budgetWaterLiters: 18000,
    mainWaterValveOpen: true,
    solarContributionKWh: 145.0,
    co2SavedKg: 60.4
  }
];

export const mockHourlyFeeds: HourlyConsumption[] = [
  { hour: "00:00", electricityKWh: 0.35, waterLiters: 0, isPeakHour: false, cost: 0.05 },
  { hour: "01:00", electricityKWh: 0.30, waterLiters: 0, isPeakHour: false, cost: 0.04 },
  { hour: "02:00", electricityKWh: 0.28, waterLiters: 0, isPeakHour: false, cost: 0.04 },
  { hour: "03:00", electricityKWh: 0.25, waterLiters: 0, isPeakHour: false, cost: 0.04 },
  { hour: "04:00", electricityKWh: 0.28, waterLiters: 2, isPeakHour: false, cost: 0.04 },
  { hour: "05:00", electricityKWh: 0.42, waterLiters: 8, isPeakHour: false, cost: 0.06 },
  { hour: "06:00", electricityKWh: 0.85, waterLiters: 24, isPeakHour: false, cost: 0.12 },
  { hour: "07:00", electricityKWh: 1.45, waterLiters: 58, isPeakHour: false, cost: 0.22 },
  { hour: "08:00", electricityKWh: 1.80, waterLiters: 65, isPeakHour: false, cost: 0.28 },
  { hour: "09:00", electricityKWh: 1.20, waterLiters: 32, isPeakHour: false, cost: 0.18 },
  { hour: "10:00", electricityKWh: 0.95, waterLiters: 18, isPeakHour: false, cost: 0.14 },
  { hour: "11:00", electricityKWh: 0.82, waterLiters: 12, isPeakHour: false, cost: 0.12 },
  { hour: "12:00", electricityKWh: 0.90, waterLiters: 15, isPeakHour: false, cost: 0.13 },
  { hour: "13:00", electricityKWh: 0.88, waterLiters: 14, isPeakHour: false, cost: 0.13 },
  { hour: "14:00", electricityKWh: 1.10, waterLiters: 10, isPeakHour: false, cost: 0.16 },
  { hour: "15:00", electricityKWh: 1.25, waterLiters: 8, isPeakHour: false, cost: 0.18 },
  { hour: "16:00", electricityKWh: 1.15, waterLiters: 12, isPeakHour: false, cost: 0.17 },
  { hour: "17:00", electricityKWh: 1.40, waterLiters: 22, isPeakHour: false, cost: 0.21 },
  { hour: "18:00", electricityKWh: 2.10, waterLiters: 42, isPeakHour: true, cost: 0.38 },
  { hour: "19:00", electricityKWh: 2.65, waterLiters: 50, isPeakHour: true, cost: 0.48 },
  { hour: "20:00", electricityKWh: 2.80, waterLiters: 45, isPeakHour: true, cost: 0.51 },
  { hour: "21:00", electricityKWh: 2.40, waterLiters: 30, isPeakHour: true, cost: 0.43 },
  { hour: "22:00", electricityKWh: 1.60, waterLiters: 15, isPeakHour: false, cost: 0.24 },
  { hour: "23:00", electricityKWh: 0.80, waterLiters: 5, isPeakHour: false, cost: 0.12 }
];

export const mockDailyTrends: DailyConsumption[] = [
  { date: "Thu (Aug 06)", electricityKWh: 13.2, waterLiters: 260, electricityCost: 1.98, waterCost: 0.78 },
  { date: "Fri (Aug 07)", electricityKWh: 15.1, waterLiters: 290, electricityCost: 2.26, waterCost: 0.87 },
  { date: "Sat (Aug 08)", electricityKWh: 18.4, waterLiters: 340, electricityCost: 2.76, waterCost: 1.02 },
  { date: "Sun (Aug 09)", electricityKWh: 19.8, waterLiters: 380, electricityCost: 2.97, waterCost: 1.14 },
  { date: "Mon (Aug 10)", electricityKWh: 12.9, waterLiters: 240, electricityCost: 1.93, waterCost: 0.72 },
  { date: "Tue (Aug 11)", electricityKWh: 14.1, waterLiters: 270, electricityCost: 2.11, waterCost: 0.81 },
  { date: "Wed (Aug 12)", electricityKWh: 14.8, waterLiters: 285, electricityCost: 2.22, waterCost: 0.85.toFixed(2) as any }
];

export const mockApplianceBreakdown: ApplianceUsageBreakdown[] = [
  { name: "HVAC & Air Conditioning", category: "Electricity", percentage: 46, currentPowerWatts: 1450, dailyCost: 1.02, iconName: "Wind" },
  { name: "Water Heater / Geyser", category: "Electricity", percentage: 22, currentPowerWatts: 0, dailyCost: 0.48, iconName: "Flame" },
  { name: "EV Fast Charger", category: "Electricity", percentage: 14, currentPowerWatts: 700, dailyCost: 0.31, iconName: "Zap" },
  { name: "Kitchen Appliances & Fridge", category: "Electricity", percentage: 10, currentPowerWatts: 280, dailyCost: 0.22, iconName: "Refrigerator" },
  { name: "Lighting & Home Entertainment", category: "Electricity", percentage: 8, currentPowerWatts: 120, dailyCost: 0.18, iconName: "Tv" },
  { name: "Bathroom Showers & Taps", category: "Water", percentage: 58, dailyCost: 0.49, iconName: "ShowerHead" },
  { name: "Washing Machine & Laundry", category: "Water", percentage: 24, dailyCost: 0.20, iconName: "WashingMachine" },
  { name: "Kitchen Sink & Dishwasher", category: "Water", percentage: 18, dailyCost: 0.15, iconName: "UtensilsCrossed" }
];

export const mockAnomalyAlerts: UtilityAnomalyAlert[] = [
  {
    id: "al-101",
    type: "Surge",
    utility: "Electricity",
    severity: "Warning",
    message: "Evening peak power demand load touched 4.8 kW (Grid limit threshold: 5.0 kW).",
    timestamp: "Today, 19:42",
    unitNumber: "A-402",
    resolved: false
  },
  {
    id: "al-102",
    type: "Leak",
    utility: "Water",
    severity: "Critical",
    message: "Micro-flow water leakage detected in Master Bathroom line (0.4 L/min continuous flow for 3 hrs).",
    timestamp: "Today, 03:15",
    unitNumber: "A-402",
    resolved: false
  },
  {
    id: "al-103",
    type: "Low Pressure",
    utility: "Water",
    severity: "Info",
    message: "Main overhead tank pressure normalized to 3.8 Bar after scheduled filter backwash.",
    timestamp: "Yesterday, 14:00",
    unitNumber: "A-402",
    resolved: true
  }
];

export const mockSocietyBenchmark = {
  unitKWhPerMonth: 342,
  towerAvgKWhPerMonth: 395,
  societyAvgKWhPerMonth: 412,
  top10PercentEcoKWhPerMonth: 280,
  unitWaterLitersPerMonth: 7850,
  towerAvgWaterLitersPerMonth: 8900,
  societyAvgWaterLitersPerMonth: 9400,
  top10PercentEcoWaterLiters: 6500,
  ecoRankPercentile: 82 // top 18% eco-performer
};
