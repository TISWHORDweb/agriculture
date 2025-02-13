import React, { useState } from "react";
import * as XLSX from "xlsx";
import DashboardLayout from "../Layout/DashboardLayout";

const ResultUpload = () => {
  const [data, setData] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (file) => {
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const binaryString = e.target?.result;
        const workbook = XLSX.read(binaryString, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        setData(jsonData);
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleFileUpload(file);
  };

  const handlePreview = (rowData) => {
    const previewData = {
      farmerInfo: {
        uniqueId: rowData["Unique ID"],
        state: rowData.State,
        lga: rowData.LGA,
        ward: rowData.Ward,
        latitude: rowData.Latitude,
        longitude: rowData.Longitude,
      },
      nitrogen: rowData.Nitrogen,
      phosphorus: rowData.Phosporus,
      potassium: rowData.Potassium,
      ph: rowData.pH,
      calcium: rowData.Calcium,
      magnesium: rowData.Magnesium,
      iron: rowData.Iron,
      manganese: rowData.Manganese,
      boron: rowData.Boron,
      copper: rowData.Copper,
      zinc: rowData.Zinc,
      cec: rowData.CEC,
      organicMatter: rowData["Organic Matter"],
      cn: rowData["C/N"],
      texture: rowData.Texture,
      source: rowData.Source,
    };

    sessionStorage.setItem("previewData", JSON.stringify(previewData));
    window.location.href = "/result/preview";
  };

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Soil Data Upload</h1>
        
        <div 
          className={`
            border-2 border-dashed rounded-lg p-8 mb-8 text-center
            ${isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300'}
            ${!data.length ? 'hover:border-green-500 hover:bg-green-50' : ''}
            transition-all duration-200
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />
          
          {!data.length ? (
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div className="text-gray-600">
                  <span className="text-green-600 font-medium">Click to upload</span> or drag and drop
                  <p className="text-sm text-gray-500">Excel files only (XLSX, XLS)</p>
                </div>
              </div>
            </label>
          ) : (
            <div className="text-gray-600">
              <span className="font-medium">{fileName}</span> uploaded successfully
            </div>
          )}
        </div>

        {data.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S/N</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unique ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LGA</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ward</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coordinates</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row["Unique ID"]}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.State}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.LGA}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.Ward}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {row.Latitude}, {row.Longitude}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handlePreview(row)}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-150"
                        >
                          Preview
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
    </DashboardLayout>
  );
};

export default ResultUpload;