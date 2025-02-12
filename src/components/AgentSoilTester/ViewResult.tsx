import React from 'react';
import { FileText, Mail, Phone, MapPin } from 'lucide-react';

// TypeScript interfaces
interface FarmerInfo {
  name: string;
  fieldId: string;
  phone: string;
  email: string;
  state: string;
  lga: string;
  ward: string;
  coordinates: string;
  labName: string;
  samplingDate: string;
  analysisDate: string;
  sampler: string;
  ownership: string;
}

interface FertilizerItem {
  stage: string;
  input: string;
  kgHa: number;
  bagsHa: number;
}

interface SoilParameter {
  parameter: string;
  unit: string;
  result: number | string;
  riceThreshold: string;
  riceStatus: string;
  maizeThreshold: string;
  maizeStatus: string;
}

interface SoilAnalysisData {
  farmerInfo: FarmerInfo;
  fertilizer: {
    rice: FertilizerItem[];
    maize: FertilizerItem[];
  };
  soilParameters: SoilParameter[];
}

// Dummy data
const dummyData: SoilAnalysisData = {
  farmerInfo: {
    name: "Abdulhadi Sale",
    fieldId: "CDA-FMA-WP650-241",
    phone: "08023456789",
    email: "abdulhadisale@gmail.com",
    state: "Jigawa",
    lga: "Gwaram",
    ward: "Gwaram",
    coordinates: "11.3016632, 9.878247",
    labName: "CDA/BUK LAB KANO",
    samplingDate: "26-Oct-2023",
    analysisDate: "02-Nov-2023",
    sampler: "Muhammad Ibrahim",
    ownership: "Rented"
  },
  fertilizer: {
    rice: [
      { stage: "Pre-Planting", input: "MANURE/COMPOST", kgHa: 5000, bagsHa: 100 },
      { stage: "Planting", input: "NPK (15.15.15)", kgHa: 330, bagsHa: 6.6 },
      { stage: "Top Dress", input: "Urea", kgHa: 180, bagsHa: 3.6 },
      { stage: "Top Dress", input: "MOP", kgHa: 50, bagsHa: 1 }
    ],
    maize: [
      { stage: "Pre-Planting", input: "MANURE/COMPOST", kgHa: 5000, bagsHa: 100 },
      { stage: "Planting", input: "NPK (15.15.15)", kgHa: 330, bagsHa: 6.6 },
      { stage: "Top Dress", input: "Urea", kgHa: 180, bagsHa: 3.6 },
      { stage: "Top Dress", input: "MOP", kgHa: 50, bagsHa: 1 }
    ]
  },
  soilParameters: [
    { parameter: "pH (in water)", unit: "", result: 6.7, riceThreshold: "6.0-7.0", riceStatus: "Adequate", maizeThreshold: "6.0-7.0", maizeStatus: "Adequate" },
    { parameter: "Available P", unit: "ppm", result: "10-30", riceThreshold: "30-80", riceStatus: "Low", maizeThreshold: "30-80", maizeStatus: "Low" },
    { parameter: "Exchangeable K", unit: "ppm", result: 50, riceThreshold: "80-180", riceStatus: "Very Low", maizeThreshold: "85-200", maizeStatus: "Very Low" }
  ]
};

const ViewResult: React.FC = () => {
  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'adequate':
        return 'bg-green-100 text-green-800';
      case 'low':
        return 'bg-yellow-100 text-yellow-800';
      case 'very low':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">Federal Ministry of Agriculture and Food Security</h1>
        <h2 className="text-xl font-semibold">Soil Analysis Report</h2>
      </div>

      {/* Farmer Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <span className="font-semibold">Farmer Name:</span> {dummyData.farmerInfo.name}
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <span className="font-semibold">Phone:</span> {dummyData.farmerInfo.phone}
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              <span className="font-semibold">Email:</span> {dummyData.farmerInfo.email}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span className="font-semibold">Coordinates:</span> {dummyData.farmerInfo.coordinates}
            </div>
          </div>
          <div className="space-y-4">
            <div><span className="font-semibold">Field ID:</span> {dummyData.farmerInfo.fieldId}</div>
            <div><span className="font-semibold">Lab Name:</span> {dummyData.farmerInfo.labName}</div>
            <div><span className="font-semibold">Sampling Date:</span> {dummyData.farmerInfo.samplingDate}</div>
            <div><span className="font-semibold">Analysis Date:</span> {dummyData.farmerInfo.analysisDate}</div>
          </div>
        </div>
      </div>

      {/* Fertilizer Recommendations */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Fertilizer Recommendations - Rice</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Input</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Kg/Ha</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Bags/Ha (50kg)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dummyData.fertilizer.rice.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{item.stage}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.input}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">{item.kgHa}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">{item.bagsHa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Soil Parameters */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Soil Analysis Results</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parameter</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Results</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rice Threshold</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rice Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Maize Threshold</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Maize Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dummyData.soilParameters.map((param, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{param.parameter}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{param.unit}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{param.result}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{param.riceThreshold}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(param.riceStatus)}`}>
                      {param.riceStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{param.maizeThreshold}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(param.maizeStatus)}`}>
                      {param.maizeStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="text-sm text-gray-600 mt-8 p-4 border-t">
        <p className="mb-2">For Enquiries Contact:</p>
        <p>Federal Ministry of Agriculture and Food Security</p>
        <p>Department of Agricultural Land and Climate Management Services</p>
        <p>Kapital Road, Area 11</p>
        <p>Phone: 08030000000, 081300000000</p>
        <p>Email: nfshcs@alccms.com.ng</p>
      </div>
    </div>
  );
};

export default ViewResult;