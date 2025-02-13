import React, { useEffect, useState, useRef } from "react";
import { Download, Loader } from "lucide-react";
import { useParams } from "react-router-dom";
import baseUrl from "../../hook/Network";
import axios from "axios";
import asset1 from "../../assets/images/asset2.png";
import asset2 from "../../assets/images/asset3.png";
import asset3 from "../../assets/images/asset4.png";
import asset4 from "../../assets/images/asset5.png";
import asset5 from "../../assets/images/asset6.png";
import asset6 from "../../assets/images/asset7.png";
import asset7 from "../../assets/images/asset8.png";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


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

const ViewResult: React.FC = () => {
  const { id } = useParams();
  const base_url = baseUrl();
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [farmer, setFarmer] = useState();
  const [result, setResult] = useState();
  const [land, setLand] = useState();
  const [request, setRequest] = useState();
  const [agent, setAgent] = useState();
  const [comment, setComment] = useState();
  const [recommendations, setRecommendations] = useState([]);

  const getStatus = (result, threshold) => {
    // If threshold is a string like "-30-80", split and parse it
    const [lower, upper] =
      typeof threshold === "string"
        ? threshold.split("-").filter(Boolean).map(Number)
        : threshold;

    if (result < lower) return "Very Low";
    if (result >= lower && result <= upper) return "Adequate";
    if (result > upper) return "High";
    return "Adequate";
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "adequate":
        return "bg-green-100 text-green-800";
      case "low":
        return "bg-yellow-100 text-yellow-800";
      case "very low":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  function formatDate(inputDate) {
    const date = new Date(inputDate); // Parse the ISO 8601 string into a Date object

    const day = date.getDate(); // Get the day of the month
    const month = date.toLocaleString("default", { month: "short" }); // Get the abbreviated month
    const year = date.getFullYear(); // Get the full year

    // Format the date as "dd-MMM-yyyy"
    return `${day < 10 ? "0" : ""}${day}-${month}-${year}`;
  }

  const fetchTestData = async () => {
    try {
      setLoading(true);
      const storedUser = localStorage.getItem("authToken");
      const role = localStorage.getItem("role");
      const endpoint =
        role === "agent"
          ? `/agent/request/result/${id}`
          : `/farmer/test-request/${id}/result`;
      const response = await axios.get(`${base_url}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${storedUser}`,
        },
      });
      setTestData(response.data.data.requests);
      setRecommendations(response.data.data.recommendations);
    } catch (err) {
      setError("Failed to fetch test data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestData();
  }, [id]);

  useEffect(() => {
    if (testData) {
      setFarmer(testData?.request?.farmer);
      setResult(testData?.results);
      setAgent(testData?.agent);
      setComment(testData?.results.comment);
      setLand(testData?.request.land);
      setRequest(testData?.request);
    }
  }, [testData]);

  console.log(result);

  const riceData = recommendations?.find((item) => item.crop === "RICE");
  const maizeData = recommendations?.find((item) => item.crop === "MAIZE");

  // Function to transform data into table rows
  const transformDataToRows = (data) => [
    {
      stage: "Pre-Planting",
      input: data.preplanting.input,
      kgHa: data.preplanting.kgPerHa,
      bagsHa: data.preplanting.bagsPerHa,
    },
    {
      stage: "Planting",
      input: data.planting.input,
      kgHa: data.planting.kgPerHa,
      bagsHa: data.planting.bagsPerHa,
    },
    {
      stage: "Top Dress (Urea)",
      input: data.topDressUrea.input,
      kgHa: data.topDressUrea.kgPerHa,
      bagsHa: data.topDressUrea.bagsPerHa,
    },
    {
      stage: "Top Dress (MOP)",
      input: data.topDressMOP.input,
      kgHa: data.topDressMOP.kgPerHa,
      bagsHa: data.topDressMOP.bagsPerHa,
    },
  ];

  // Example usage:
  const thresholds = {
    "pH Level": { Rice: [6.0, 7.0], Maize: [6.0, 7.0] },
    "Available P": { Rice: [30, 80], Maize: [30, 80] },
    "Exchangeable K": { Rice: [80, 180], Maize: [85, 200] },
    Calcium: { Rice: [400, 900], Maize: [400, 950] },
    Magnesium: { Rice: [60, 150], Maize: [50, 100] },
    Iron: { Rice: [115, 160], Maize: [120, 165] },
    Manganese: { Rice: [25, 80], Maize: [30, 75] },
    Boron: { Rice: [0.9, Infinity], Maize: [0.85, Infinity] },
    Copper: { Rice: [0.2, 1.2], Maize: [0.2, 1.2] },
    Zinc: { Rice: [0.1, Infinity], Maize: [2, 12] },
    CEC: { Rice: [4, 7], Maize: [3, 8] },
    "Total Nitrogen": { Rice: [0.02, 0.07], Maize: [0.09, 0.12] },
    "Organic Matter": { Rice: [1.5, 1.8], Maize: [1.5, 1.7] },
    "C/N": { Rice: [10, 14], Maize: [9, 15] },
  };

  const dummyData: SoilAnalysisData = {
    farmerInfo: {
      fieldId: "CDA/BUK LAB KANO",
      labName: "CDA/BUK LAB KANO",
    },
    soilParameters: [
      {
        parameter: "PH",
        unit: "(in water)",
        result: result?.pH,
        riceThreshold: "6.0-7.0",
        riceStatus: getStatus(result?.pH || "0", thresholds["pH Level"].Rice),
        maizeThreshold: "6.0-7.0",
        maizeStatus: getStatus(result?.pH || "0", thresholds["pH Level"].Maize),
      },
      {
        parameter: "Available P",
        unit: "ppm",
        result: result?.available,
        riceThreshold: "30-80",
        riceStatus: getStatus(
          result?.available || "0",
          thresholds["Available P"].Rice
        ),
        maizeThreshold: "30-80",
        maizeStatus: getStatus(
          result?.available || "0",
          thresholds["Available P"].Maize
        ),
      },
      {
        parameter: "Exchangeable K",
        unit: "ppm",
        result: result?.exchangeable,
        riceThreshold: "80-180",
        riceStatus: getStatus(
          result?.exchangeable || "0",
          thresholds["Exchangeable K"].Rice
        ),
        maizeThreshold: "85-200",
        maizeStatus: getStatus(
          result?.exchangeable || "0",
          thresholds["Exchangeable K"].Maize
        ),
      },
      {
        parameter: "Calcium",
        unit: "ppm",
        result: result?.calcium,
        riceThreshold: "400-900",
        riceStatus: getStatus(result?.calcium || "0", thresholds.Calcium.Rice),
        maizeThreshold: "400-950",
        maizeStatus: getStatus(
          result?.calcium || "0",
          thresholds.Calcium.Maize
        ),
      },
      {
        parameter: "Magnesium",
        unit: "ppm",
        result: result?.magnesium,
        riceThreshold: "60-150",
        riceStatus: getStatus(
          result?.magnesium || "0",
          thresholds.Magnesium.Rice
        ),
        maizeThreshold: "50-100",
        maizeStatus: getStatus(
          result?.magnesium || "0",
          thresholds.Magnesium.Maize
        ),
      },
      {
        parameter: "Iron",
        unit: "ppm",
        result: result?.iron,
        riceThreshold: "115-160",
        riceStatus: getStatus(result?.iron || "0", thresholds.Iron.Rice),
        maizeThreshold: "120-165",
        maizeStatus: getStatus(result?.iron || "0", thresholds.Iron.Maize),
      },
      {
        parameter: "Manganese",
        unit: "ppm",
        result: result?.manganese,
        riceThreshold: "25-80",
        riceStatus: getStatus(
          result?.manganese || "0",
          thresholds.Manganese.Rice
        ),
        maizeThreshold: "30-75",
        maizeStatus: getStatus(
          result?.manganese || "0",
          thresholds.Manganese.Maize
        ),
      },
      {
        parameter: "Boron",
        unit: "ppm",
        result: result?.boron,
        riceThreshold: ">0.9",
        riceStatus: getStatus(result?.boron || "0", thresholds.Boron.Rice),
        maizeThreshold: ">0.85",
        maizeStatus: getStatus(result?.boron || "0", thresholds.Boron.Maize),
      },
      {
        parameter: "Copper",
        unit: "ppm",
        result: result?.copper,
        riceThreshold: ">0.2-<1.2",
        riceStatus: getStatus(result?.copper || "0", thresholds.Copper.Rice),
        maizeThreshold: ">0.2-<1.2",
        maizeStatus: getStatus(result?.copper || "0", thresholds.Copper.Maize),
      },
      {
        parameter: "Zinc",
        unit: "ppm",
        result: result?.zinc,
        riceThreshold: "<0.1",
        riceStatus: getStatus(result?.zinc || "0", thresholds.Zinc.Rice),
        maizeThreshold: "2-12",
        maizeStatus: getStatus(result?.zinc || "0", thresholds.Zinc.Maize),
      },
      {
        parameter: "CEC",
        unit: "meq/100g",
        result: result?.cec,
        riceThreshold: "4-7",
        riceStatus: getStatus(result?.cec || "0", thresholds.CEC.Rice),
        maizeThreshold: "3-8",
        maizeStatus: getStatus(result?.cec || "0", thresholds.CEC.Maize),
      },
      {
        parameter: "Total Nitrogen",
        unit: "ppm",
        result: result?.totalNitrogen,
        riceThreshold: "60-150",
        riceStatus: getStatus(
          result?.totalNitrogen || "0",
          thresholds["Total Nitrogen"].Rice
        ),
        maizeThreshold: "50-100",
        maizeStatus: getStatus(
          result?.totalNitrogen || "0",
          thresholds["Total Nitrogen"].Maize
        ),
      },
      {
        parameter: "Organic Matter",
        unit: "ppm",
        result: result?.organicMatter,
        riceThreshold: "1.5-1.8",
        riceStatus: getStatus(
          result?.organicMatter || "0",
          thresholds["Organic Matter"].Rice
        ),
        maizeThreshold: "1.5-1.7",
        maizeStatus: getStatus(
          result?.organicMatter || "0",
          thresholds["Organic Matter"].Maize
        ),
      },
      {
        parameter: "C/N",
        unit: "ratio",
        result: result?.cn,
        riceThreshold: "10-14",
        riceStatus: getStatus(result?.cn || "0", thresholds["C/N"].Rice),
        maizeThreshold: "9-15",
        maizeStatus: getStatus(result?.cn || "0", thresholds["C/N"].Maize),
      },
      {
        parameter: "Soil",
        unit: "Texture",
        result: result?.soilTexture,
        riceThreshold: result?.soilTexture,
        riceStatus: "",
        maizeThreshold: result?.soilTexture,
        maizeStatus: "",
      },
    ],
  };

  const stages = [
    {
      title: "Pre-Planting",
      description: comment?.preplanting,
      titleColor: "text-emerald-500",
      stageImage: asset4,
      weatherImage: asset1,
    },
    {
      title: "Planting",
      description: comment?.planting,
      titleColor: "text-emerald-500",
      stageImage: asset7,
      weatherImage: asset6,
    },
    {
      title: "Top Dress (Urea)",
      description: comment?.topDressUrea,
      titleColor: "text-emerald-500",
      stageImage: asset2,
      weatherImage: asset5,
    },
    {
      title: "Top Dress (MOP)",
      description: comment?.topDressMOP,
      titleColor: "text-emerald-500",
      stageImage: asset2,
      weatherImage: asset5,
    },
  ];

  const contentRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const generatePDF = async () => {
    if (!contentRef.current) return;
    
    setIsGeneratingPDF(true);
    
    try {
      // Wait for images to load
      await Promise.all(
        Array.from(contentRef.current.getElementsByTagName('img'))
          .map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve) => {
              img.onload = resolve;
              img.onerror = resolve; // Handle error case as well
            });
          })
      );

      const content = contentRef.current;
      
      // Set specific options for better quality
      const canvas = await html2canvas(content, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        windowWidth: content.scrollWidth,
        windowHeight: content.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Initialize PDF with portrait orientation
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(
        imgData,
        'PNG',
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio,
        undefined,
        'FAST'
      );

      // Generate filename with date
      const date = new Date().toISOString().split('T')[0];
      const filename = `soil-analysis-result-${date}.pdf`;
      
      pdf.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };


  return (
    <>
      {/* Add Download Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={generatePDF}
          disabled={isGeneratingPDF}
          className={`flex items-center gap-2 ${
            isGeneratingPDF 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700'
          } text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-200`}
        >
          {isGeneratingPDF ? (
            <>
              <Loader className="animate-spin" size={20} />
              Generating PDF...
            </>
          ) : (
            <>
              <Download size={20} />
              Download PDF
            </>
          )}
        </button>
      </div>

      <div ref={contentRef} className="bg-[#f0f0f0] max-w-6xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center mb-6">
          <img src={asset3} alt="" className="w-32" />
          <h1 className="text-2xl font-bold mb-2 text-[#3c5965] mt-3">
            Federal Ministry of Agriculture and Food Security
          </h1>
        </div>

        {/* Farmer Information */}
        <div className=" rounded-lg p-6">
          <div className="flex justify-between">
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#3c5965]">
                  Farmer Name:
                </span>{" "}
                {farmer?.profile.firstName + " " + farmer?.profile.lastName}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#3c5965]">Phone:</span>{" "}
                {farmer?.profile.contact}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#3c5965]">Email:</span>{" "}
                {farmer?.email}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#3c5965]">State:</span>{" "}
                {farmer?.location.state}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#3c5965]">LGA:</span>{" "}
                {farmer?.location.lga}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#3c5965]">Ward:</span>{" "}
                {farmer?.location.ward}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#3c5965]">
                  Coordinates:
                </span>{" "}
                {land?.location.coordinates.latitude +
                  " " +
                  land?.location?.coordinates?.longtitude}
              </div>
            </div>
            <div className="space-y-4 text-sm">
              <div>
                <span className="font-semibold text-[#3c5965]">Field ID:</span>{" "}
                {dummyData.farmerInfo.fieldId}
              </div>
              <div>
                <span className="font-semibold text-[#3c5965]">Lab Name:</span>{" "}
                {dummyData.farmerInfo.labName}
              </div>
              <div>
                <span className="font-semibold text-[#3c5965]">
                  Sampling Date:
                </span>{" "}
                {formatDate(request?.createdAt)}
              </div>
              <div>
                <span className="font-semibold text-[#3c5965]">
                  Analysis Date:
                </span>{" "}
                {formatDate(testData?.createdAt)}
              </div>
              <div>
                <span className="font-semibold text-[#3c5965]">Sampler:</span>{" "}
                {agent?.profile.firstName + " " + agent?.profile.lastName}
              </div>
              <div>
                <span className="font-semibold text-[#3c5965]">
                  Farm Ownership:
                </span>{" "}
                {land?.ownership}
              </div>
            </div>
          </div>
        </div>
        <hr className="border-t-2 border-dashed border-gray-400 my-4" />

        {/* Fertilizer Recommendations */}
        <div className="space-y-6">
          {/* Rice Table */}
          {riceData && (
            <div>
              <h3 className="text-lg font-semibold mb-3">
                <span className="text-[#3c5965]">
                  {" "}
                  Fertilizer Recommendations -{" "}
                </span>{" "}
                <span className="text-green-700">RICE</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow-md">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm text-[#3c5965] font-semibold uppercase tracking-wider ">
                        Stage
                      </th>
                      <th className="px-6 py-3 text-left text-sm text-[#3c5965] font-semibold  uppercase tracking-wider">
                        Input
                      </th>
                      <th className="px-6 py-3 text-right text-sm  text-[#3c5965] font-semibold  uppercase tracking-wider">
                        Kg/Ha
                      </th>
                      <th className="px-6 py-3 text-right text-sm text-[#3c5965] font-semibold  uppercase tracking-wider">
                        Bags/Ha (50kg)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {transformDataToRows(riceData).map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 text-sm">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.stage}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.input}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {item.kgHa}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {item.bagsHa}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Maize Table */}
          {maizeData && (
            <div>
              <h3 className="text-lg font-semibold mb-3">
                <span className="text-[#3c5965]">
                  {" "}
                  Fertilizer Recommendations -{" "}
                </span>{" "}
                <span className="text-green-700">MAIZE</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow-md">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm  text-[#3c5965] font-semibold uppercase tracking-wider">
                        Stage
                      </th>
                      <th className="px-6 py-3 text-left text-sm  text-[#3c5965] font-semibold  uppercase tracking-wider">
                        Input
                      </th>
                      <th className="px-6 py-3 text-right text-sm  text-[#3c5965] font-semibold  uppercase tracking-wider">
                        Kg/Ha
                      </th>
                      <th className="px-6 py-3 text-right text-sm  text-[#3c5965] font-semibold uppercase tracking-wider">
                        Bags/Ha (50kg)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {transformDataToRows(maizeData).map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 text-sm">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.stage}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.input}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {item.kgHa}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {item.bagsHa}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <hr className="border-t-2 border-dashed border-gray-400 my-4" />

        <div className="w-full max-w-6xl mx-auto px-4 py-8 bg-[#f3f4f6]">
          <div className="grid grid-cols-3 gap-4  text-slate-800 mb-5 text-1xl font-bold mb-2 text-[#3c5965] ">
            <div className="text-left">STAGE</div>
            <div className="text-left">COMMENT</div>
            <div className="text-right">WEATHER</div>
          </div>

          <div className="space-y-6">
            {stages.map((stage, index) => (
              <div
                key={index}
                className="grid grid-cols-[80px_1fr_80px] gap-4 md:gap-32 items-center"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-lg">
                  <img src={stage.stageImage} alt="" />
                </div>

                <div>
                  <h3
                    className={`${stage.titleColor} text-lg font-medium mb-1`}
                  >
                    {stage.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{stage.description}</p>
                </div>

                <div className="w-20 h-20 flex justify-center items-center">
                  {/* Weather icon placeholder */}
                  <div className="w-12 h-12 bg-gray-100">
                    <img src={stage.weatherImage} alt="" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-t-2 border-dashed border-gray-400 my-4" />
        {/* Soil Parameters */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold mb-3">Soil Analysis Results</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parameter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Results
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rice Threshold
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rice Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Maize Threshold
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Maize Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dummyData.soilParameters.map((param, index) => (
                  <tr key={index} className="hover:bg-gray-50 text-sm">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {param.parameter}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {param.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {param.result}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {param.riceThreshold}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-2 rounded-full text-xs ${getStatusColor(
                          param.riceStatus
                        )}`}
                      >
                        {param.riceStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {param.maizeThreshold}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-2 rounded-full text-xs ${getStatusColor(
                          param.maizeStatus
                        )}`}
                      >
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
          <br />
          <br />
          <p>
            Disclaimer: These fertilizer recommendations are only valid for the
            sample presented, specific crop type, yield target and estimated
            fertilizer recovery. Please also note that the recommendations
            provide indicative rates only and should be validated at farm level
            through fertilizer trials. Whilst we have taken all reasonable care
            to ensure that our recommendations are accurate, we have not taken
            into account other factors that could greatly reduce crop nutrient
            uptake including but not limited to soil moisture, root diseases,
            nematodes, water logging, compaction, acidity, fertilizer placement
            and other management factors. Therefore, we accept no liability for
            any loss or damage arising directly or indirectly from the use of
            the fertilizers and under no circumstances whatsoever shall we be
            liable for any special, incidental or consequential damages which
            may arise therefrom. This document cannot be reproduced, without
            prior written approval of the company.
          </p>
          <br />
          <p>©Powered by FMAFS</p>
        </div>
      </div>
    </>
  );
};

export default ViewResult;
