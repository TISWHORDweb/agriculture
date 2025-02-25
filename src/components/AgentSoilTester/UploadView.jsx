import React, { useEffect, useState, useRef } from "react";
import { Download, Loader } from "lucide-react";
import asset3 from "../../assets/images/asset4.png";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const UploadView = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [result, setResult] = useState();
  const [request, setRequest] = useState();

  const getStatus = (result, threshold) => {
    const [lower, upper] =
      typeof threshold === "string"
        ? threshold.split("-").filter(Boolean).map(Number)
        : threshold;

    if (result < lower) return "Very Low";
    if (result >= lower && result <= upper) return "Adequate";
    if (result > upper) return "High";
    return "Adequate";
  };

  const getStatusColor = (status) => {
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

  const getFromSessionStorage = (key) => {
    const data = sessionStorage.getItem(key);
    
    if (data) {
      try {
        return JSON.parse(data); 
      } catch (error) {
        return data;  
      }
    }
    
    return null;  
  };

  useEffect(() => {
    const data = getFromSessionStorage("previewData")
    setResult(data)
  }, []);

  console.log(result)

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

  const dummyData = {
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
        result: result?.phosphorus,
        riceThreshold: "30-80",
        riceStatus: getStatus(
          result?.phosphorus || "0",
          thresholds["Available P"].Rice
        ),
        maizeThreshold: "30-80",
        maizeStatus: getStatus(
          result?.phosphorus || "0",
          thresholds["Available P"].Maize
        ),
      },
      {
        parameter: "Exchangeable K",
        unit: "ppm",
        result: result?.potassium,
        riceThreshold: "80-180",
        riceStatus: getStatus(
          result?.potassium || "0",
          thresholds["Exchangeable K"].Rice
        ),
        maizeThreshold: "85-200",
        maizeStatus: getStatus(
          result?.potassium || "0",
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
        result: result?.nitrogen,
        riceThreshold: "60-150",
        riceStatus: getStatus(
          result?.nitrogen || "0",
          thresholds["Total Nitrogen"].Rice
        ),
        maizeThreshold: "50-100",
        maizeStatus: getStatus(
          result?.nitrogen || "0",
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
        result: result?.texture,
        riceThreshold: result?.texture,
        riceStatus: "",
        maizeThreshold: result?.texture,
        maizeStatus: "",
      },
    ],
  };

  const contentRef = useRef(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const generatePDF = async () => {
    if (!contentRef.current) return;
    
    setIsGeneratingPDF(true);
    
    try {
      await Promise.all(
        Array.from(contentRef.current.getElementsByTagName('img'))
          .map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve) => {
              img.onload = resolve;
              img.onerror = resolve;
            });
          })
      );

      const content = contentRef.current;
      
      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        logging: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        windowWidth: content.scrollWidth,
        windowHeight: content.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      
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
        imgHeight * ratio
      );
      pdf.save('preview.pdf');
    } catch (error) {
      setError('Error generating PDF');
    }
    
    setIsGeneratingPDF(false);
  };

  return (
    <div ref={contentRef}>
      {/* Your JSX here */}
      <button onClick={generatePDF}>
        {isGeneratingPDF ? <Loader /> : <Download />}
      </button>
    </div>
  );
};

export default UploadView;
