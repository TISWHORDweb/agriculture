import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import DashboardLayout from "../Layout/DashboardLayout";
import baseUrl from "../../hook/Network";

const ResultUpload = () => {
  const [data, setData] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const base_url = baseUrl();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const storedUser = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchSoilData = async () => {
      try {
        const endpoint = `/admin/test/all`;
        const response = await axios.get(`${base_url}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${storedUser}`,
          },
        });
        setData(response.data.data);
        setFilteredData(response.data.data);
      } catch (error) {
        console.error("Error fetching soil data:", error);
      }
    };

    fetchSoilData();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
console.log(term)
    if (term === "") {
      setFilteredData(data);
    } else {
    const filtered = data.filter(item => 
      (item.uniqueId?.toString()?.toLowerCase()?.includes(term) ||
      item.state?.toString()?.toLowerCase()?.includes(term) ||
      item.lga?.toString()?.toLowerCase()?.includes(term) ||
      item.ward?.toString()?.toLowerCase()?.includes(term))
    );
      setFilteredData(filtered);
    }
  };

  const BATCH_SIZE = 50;
  const adminId = "675abdb7894fc6f5196d3061";

  const transformData = (rawData) => {
    return rawData.map((row) => ({
      adminId: adminId,
      uniqueId: row["Unique ID"],
      state: row["State"],
      lga: row["LGA"],
      ward: row["Ward"],
      latitude: Number(row["Latitude"]),
      longitude: Number(row["Longitude"]),
      nitrogen: Number(row["Nitrogen"]),
      phosphorus: Number(row["Phosporus"]), // Note: handling possible typo in Excel
      potassium: Number(row["Potassium"]),
      pH: Number(row["pH"]),
      calcium: Number(row["Calcium"]),
      magnesium: Number(row["Magnesium"]),
      iron: Number(row["Iron"]),
      manganese: Number(row["Manganese"]),
      boron: Number(row["Boron"]),
      copper: Number(row["Copper"]),
      zinc: Number(row["Zinc"]),
      cec: Number(row["CEC"]),
      organicMatter: Number(row["Organic Matter"]),
      cn: Number(row["C/N"]),
      texture: row["Texture"],
      source: row["Source"],
    }));
  };

  const uploadBatch = async (batch) => {
    try {
      const url = `/admin/test/data`;
      await axios.post(
        `${base_url}${url}`,
        { soilData: batch },
        {
          headers: {
            Authorization: `Bearer ${storedUser}`,
          },
        }
      );
    } catch (error) {
      throw new Error(`Error uploading batch: ${error.message}`);
    }
  };

  const handleFileUpload = async (file) => {
    if (file) {
      setFileName(file.name);
      setIsUploading(true);
      setUploadProgress(0);

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          // Read and transform the data
          const binaryString = e.target.result;
          const workbook = XLSX.read(binaryString, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);
          const transformedData = transformData(jsonData);

          // Split data into batches
          const batches = [];
          for (let i = 0; i < transformedData.length; i += BATCH_SIZE) {
            batches.push(transformedData.slice(i, i + BATCH_SIZE));
          }

          // Upload batches sequentially
          for (let i = 0; i < batches.length; i++) {
            await uploadBatch(batches[i]);
            const progress = ((i + 1) / batches.length) * 100;
            setUploadProgress(progress);
          }

          const endpoint = `/admin/test/all`;
          const response = await axios.get(`${base_url}${endpoint}`);
          setData(response.data.data);
          setFilteredData(response.data.data); 
        } catch (error) {
          console.error("Error processing file:", error);
          alert("Error uploading file: " + error.message);
        } finally {
          setIsUploading(false);
          setUploadProgress(0);
        }
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
        uniqueId: rowData.uniqueId,
        state: rowData.state,
        lga: rowData.lga,
        ward: rowData.ward,
        latitude: rowData.latitude,
        longitude: rowData.longitude,
      },
      nitrogen: rowData.nitrogen,
      phosphorus: rowData.phosphorus,
      potassium: rowData.potassium,
      pH: rowData.pH,
      calcium: rowData.calcium,
      magnesium: rowData.magnesium,
      iron: rowData.iron,
      manganese: rowData.manganese,
      boron: rowData.boron,
      copper: rowData.copper,
      zinc: rowData.zinc,
      cec: rowData.cec,
      organicMatter: rowData.organicMatter,
      cn: rowData.cn,
      texture: rowData.texture,
      source: rowData.source,
    };

    sessionStorage.setItem("previewData", JSON.stringify(previewData));
    window.location.href = "/result/preview";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Soil Data Upload
        </h1>

        <div
          className={`
              border-2 border-dashed rounded-lg p-8 mb-8 text-center
              ${isDragging ? "border-green-500 bg-green-50" : "border-gray-300"}
              ${!data?.length ? "hover:border-green-500 hover:bg-green-50" : ""}
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
            disabled={isUploading}
          />

          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <div className="text-gray-600">
                <span className="text-green-600 font-medium">
                  Click to upload
                </span>{" "}
                or drag and drop
                <p className="text-sm text-gray-500">
                  Excel files only (XLSX, XLS)
                </p>
              </div>
            </div>
          </label>

          {isUploading && (
            <div className="mt-4">
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-green-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="ml-2">Uploading...</span>
              </div>
            </div>
          )}
        </div>



        {data?.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b">
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Search by ID, State, LGA, or Ward"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      S/N
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unique ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      State
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      LGA
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ward
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Coordinates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData?.map((row, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {row.uniqueId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {row.state}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {row.lga}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {row.ward}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {row.latitude}, {row.longitude}
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
  );
};

export default ResultUpload;
