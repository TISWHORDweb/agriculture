import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../Layout/DashboardLayout';
import axios from 'axios';
import { 
  Droplet, 
  Leaf, 
  Pyramid, 
  ThermometerSun, 
  Activity,
  Sprout,
  Mountain,
  Waves,
  Trees,
  CircleDot,
  Combine,
  Scale,
  Zap,
  Flask,
  Battery,
  Sigma,
  Container,
  Gauge,
  FlaskConical,
  Dna
} from 'lucide-react';
import baseUrl from '../../hook/Network';


const SoilTestResult = () => {
  const { id } = useParams();
  const base_url = baseUrl();
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTestData = async () => {
    try {
      setLoading(true);
      const storedUser = localStorage.getItem('authToken');
      const role = localStorage.getItem('role');
      const endpoint = role === 'agent' ? `/agent/request/result/${id}` : `/farmer/test-request/${id}/result`
      const response = await axios.get(`${base_url}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${storedUser}`,
        },
      });
      setTestData(response.data.data);
    } catch (err) {
      setError("Failed to fetch test data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestData();
  }, [id]);

  const getInterpretationColor = (interpretation) => {
    if (!interpretation) return 'bg-green-50';
    const lower = interpretation?.toLowerCase() || '';
    if (lower.includes('low')) return 'bg-red-50 border-l-4 border-red-400';
    if (lower.includes('optimal')) return 'bg-green-50 border-l-4 border-green-400';
    if (lower.includes('high')) return 'bg-yellow-50 border-l-4 border-yellow-400';
    return 'bg-green-50';
  };

  const ResultCard = ({ icon: Icon, label, value, interpretation }) => (
    <div className={`${getInterpretationColor(interpretation)} rounded-xl p-6 transition-all duration-300 hover:shadow-lg relative overflow-hidden`}>
      <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
        <Icon className="w-full h-full text-green-400" />
      </div>
      <div className="flex items-center gap-3 mb-3">
        <Icon className="w-6 h-6 text-green-400" />
        <h3 className="font-medium text-gray-800">{label}</h3>
      </div>
      <div className="mt-2">
        <p className="text-3xl font-bold text-gray-900">
          {value?.value || value || '0'}
          {value?.percentage ? '%' : ''}
        </p>
        {interpretation && (
          <p className="text-sm text-gray-600 mt-2">{interpretation}</p>
        )}
      </div>
    </div>
  );

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-400 border-t-transparent"></div>
      </div>
    </DashboardLayout>
  );

  if (error) return (
    <DashboardLayout>
      <div className="text-center text-red-500 p-4">{error}</div>
    </DashboardLayout>
  );

  const results = testData?.results || {};

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-8 border-t-4 border-green-400">
          {/* Header */}
          <div className="mb-8 relative">
            <div className="inline-block">
              <h1 className="text-3xl font-bold text-gray-900">Soil Analysis Results</h1>
              <div className="h-1 w-24 bg-green-400 mt-2 rounded-full"></div>
            </div>
            <p className="text-gray-600 mt-4">Comprehensive analysis of your soil sample</p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ResultCard 
              icon={ThermometerSun} 
              label="pH Level" 
              value={results.pH}
              interpretation={results.pH?.interpretation}
            />
            <ResultCard 
              icon={Leaf} 
              label="Nutrient Levels" 
              value={results.nutrientLevels}
              interpretation={results.nutrientLevels?.interpretation}
            />
            <ResultCard 
              icon={FlaskConical} 
              label="Organic Matter" 
              value={results.organicMatter}
              interpretation={results.organicMatter?.interpretation}
            />
            <ResultCard 
              icon={Sprout} 
              label="Nitrogen" 
              value={results.nitrogen}
              interpretation={results.nitrogen?.interpretation}
            />
            <ResultCard 
              icon={Mountain} 
              label="Phosphorus" 
              value={results.phosphorus}
              interpretation={results.phosphorus?.interpretation}
            />
            <ResultCard 
              icon={Activity} 
              label="Potassium" 
              value={results.potassium}
              interpretation={results.potassium?.interpretation}
            />
            <ResultCard 
              icon={Pyramid} 
              label="Calcium" 
              value={results.calcium}
              interpretation={results.calcium?.interpretation}
            />
            <ResultCard 
              icon={Gauge} 
              label="Magnetism" 
              value={results.magnetism}
              interpretation={results.magnetism?.interpretation}
            />
            <ResultCard 
              icon={CircleDot} 
              label="Iron" 
              value={results.iron}
              interpretation={results.iron?.interpretation}
            />
            <ResultCard 
              icon={Combine} 
              label="Manganese" 
              value={results.manganese}
              interpretation={results.manganese?.interpretation}
            />
            <ResultCard 
              icon={Scale} 
              label="Boron" 
              value={results.boron}
              interpretation={results.boron?.interpretation}
            />
            <ResultCard 
              icon={Container} 
              label="Copper" 
              value={results.copper}
              interpretation={results.copper?.interpretation}
            />
            <ResultCard 
              icon={Zap} 
              label="Zinc" 
              value={results.zinc}
              interpretation={results.zinc?.interpretation}
            />
            <ResultCard 
              icon={Sigma} 
              label="CEC" 
              value={results.cec}
              interpretation={results.cec?.interpretation}
            />
            <ResultCard 
              icon={Battery} 
              label="Heavy Metals" 
              value={results.heavyMetals}
              interpretation={results.heavyMetals?.interpretation}
            />
          </div>

          {/* Nutrients Detailed Analysis */}
          <div className="mt-12">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Detailed Nutrient Analysis</h2>
              <div className="h-1 flex-grow bg-green-400/20 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['nitrogen', 'phosphorus', 'potassium'].map((nutrient) => (
                <div key={nutrient} className="bg-green-50/50 rounded-xl p-6 border border-green-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">{nutrient}</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-600">Level</p>
                      <p className="text-xl font-bold text-gray-900">{results.nutrients?.[nutrient]?.level || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Interpretation</p>
                      <p className="text-gray-800">{results.nutrients?.[nutrient]?.interpretation || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Soil Texture Section */}
          <div className="mt-12">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Soil Texture Analysis</h2>
              <div className="h-1 flex-grow bg-green-400/20 rounded-full"></div>
            </div>
            <div className="bg-green-50/50 rounded-xl p-8 border border-green-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-white rounded-lg shadow-sm border-t-2 border-green-400">
                  <p className="text-gray-600 mb-2">Sand</p>
                  <p className="text-3xl font-bold text-gray-900">{results.soilTexture?.sand || 0}%</p>
                </div>
                <div className="text-center p-6 bg-white rounded-lg shadow-sm border-t-2 border-green-400">
                  <p className="text-gray-600 mb-2">Silt</p>
                  <p className="text-3xl font-bold text-gray-900">{results.soilTexture?.silt || 0}%</p>
                </div>
                <div className="text-center p-6 bg-white rounded-lg shadow-sm border-t-2 border-green-400">
                  <p className="text-gray-600 mb-2">Clay</p>
                  <p className="text-3xl font-bold text-gray-900">{results.soilTexture?.clay || 0}%</p>
                </div>
              </div>
              <div className="text-center mt-6 p-6 bg-white rounded-lg border border-green-100">
                <p className="text-gray-600">Texture Class</p>
                <p className="text-xl font-semibold mt-1 text-green-600">{results.soilTexture?.textureClass || 'Not available'}</p>
              </div>
            </div>
          </div>

          {/* Salinity Section */}
          <div className="mt-12">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Salinity Analysis</h2>
              <div className="h-1 flex-grow bg-green-400/20 rounded-full"></div>
            </div>
            <div className="bg-green-50/50 rounded-xl p-8 border border-green-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white rounded-lg shadow-sm border-t-2 border-green-400">
                  <p className="text-gray-600 mb-2">Electrical Conductivity</p>
                  <p className="text-3xl font-bold text-gray-900">{results.salinity?.electricalConductivity || 0}</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-sm border-t-2 border-green-400">
                  <p className="text-gray-600 mb-2">Interpretation</p>
                  <p className="text-xl font-semibold text-gray-900">{results.salinity?.interpretation || 'Not available'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Crops Section */}
          {results.recommendedCrops && results.recommendedCrops.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recommended Crops</h2>
                <div className="h-1 flex-grow bg-green-400/20 rounded-full"></div>
              </div>
              <div className="bg-green-50/50 rounded-xl p-8 border border-green-100">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {results.recommendedCrops.map((crop, index) => (
                    <div key={index} className="flex items-center gap-2 bg-white p-4 rounded-lg shadow-sm border-l-2 border-green-400">
                      <Trees className="w-5 h-5 text-green-400" />
                      <span className="text-gray-800">{crop}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Additional Recommendations */}
          {results.additionalRecommendations && (
            <div className="mt-12">
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Additional Recommendations</h2>
                <div className="h-1 flex-grow bg-green-400/20 rounded-full"></div>
              </div>
              <div className="bg-green-50/50 rounded-xl p-8 border border-green-100">
                <p className="text-gray-700 leading-relaxed">{results.additionalRecommendations}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SoilTestResult;