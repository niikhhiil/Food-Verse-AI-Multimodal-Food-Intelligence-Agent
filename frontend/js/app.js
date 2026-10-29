/**
 * FoodVerse AI - React 18 Application
 * Single Page Application for Multimodal Food Intelligence Agent
 */

const { useState, useEffect, useRef } = React;

function App() {
  const [activeTab, setActiveTab] = useState('food_recognition');
  const [systemHealth, setSystemHealth] = useState({ healthy: true, version: '2.0.0' });

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setSystemHealth({ healthy: data.status === 'healthy', version: data.version }))
      .catch(() => setSystemHealth({ healthy: false, version: 'offline' }));
  }, []);

  const navItems = [
    { id: 'food_recognition', label: 'Food Recognition & Nutrition', icon: '🍲' },
    { id: 'freshness_detection', label: 'Freshness & Spoilage', icon: '🔍' },
    { id: 'hygiene_monitor', label: 'Restaurant Hygiene', icon: '🛡️' },
    { id: 'smart_kitchen', label: 'Smart Kitchen Assistant', icon: '👨‍🍳' },
    { id: 'meal_planner', label: 'Personalized Meal Planner', icon: '📋' },
    { id: 'multimodal_hub', label: 'Multimodal AI Hub', icon: '✨' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header Bar */}
      <header className="glass-panel p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 via-cyan-400 to-emerald-400 flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/30 animate-pulse-glow">
            🥗
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight shimmer-text">
                FoodVerse AI
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                v{systemHealth.version}
              </span>
            </div>
            <p className="text-slate-400 text-xs md:text-sm mt-0.5">
              Multimodal Food Intelligence Agent • Vision • Video • Nutrition • LLM Reasoning
            </p>
          </div>
        </div>

        {/* System Status Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            System Online & Verified
          </div>
        </div>
      </header>

      {/* Navigation Tab Bar */}
      <nav className="glass-panel p-2 mb-8 flex flex-wrap gap-2 justify-center md:justify-start">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`nav-pill ${activeTab === item.id ? 'active' : ''}`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Main Tab Panels */}
      <main>
        {activeTab === 'food_recognition' && <FoodRecognitionModule />}
        {activeTab === 'freshness_detection' && <FreshnessDetectionModule />}
        {activeTab === 'hygiene_monitor' && <HygieneMonitorModule />}
        {activeTab === 'smart_kitchen' && <SmartKitchenModule />}
        {activeTab === 'meal_planner' && <MealPlannerModule />}
        {activeTab === 'multimodal_hub' && <MultimodalHubModule />}
      </main>

      {/* Footer */}
      <footer className="mt-16 text-center text-xs text-slate-500 pb-8">
        FoodVerse AI Multimodal Platform • Built with FastAPI, PyTorch, OpenCV & React 18
      </footer>
    </div>
  );
}

// ----------------- MODULE 1: FOOD RECOGNITION & NUTRITION ----------------- //

function FoodRecognitionModule() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('/sample-data/sample_biryani.jpg');
  const [queryHint, setQueryHint] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const loadSample = async (sampleName, hint) => {
    setLoading(true);
    try {
      const url = `/sample-data/${sampleName}`;
      setPreviewUrl(url);
      setQueryHint(hint);
      const res = await fetch(url);
      const blob = await res.blob();
      const file = new File([blob], sampleName, { type: 'image/jpeg' });
      setSelectedFile(file);
      await analyzeImage(file, hint);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const analyzeImage = async (fileToUpload = selectedFile, hint = queryHint) => {
    if (!fileToUpload && !previewUrl) return;
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      if (fileToUpload) {
        formData.append('file', fileToUpload);
      } else {
        const res = await fetch(previewUrl);
        const blob = await res.blob();
        formData.append('file', new File([blob], 'preview.jpg', { type: 'image/jpeg' }));
      }
      if (hint) formData.append('query_hint', hint);

      const response = await fetch('/api/food/recognize', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      alert('Error analyzing food image: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Ingestion & Input */}
        <div className="lg:col-span-5 glass-panel p-6 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>📷</span> Food Image Ingestion
          </h2>
          <p className="text-slate-400 text-xs">
            Upload any food photo or select a standard reference sample to detect dish identity and extract standard USDA/NIN nutrition profiles.
          </p>

          {/* Image Preview Canvas */}
          <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-700 h-64 flex items-center justify-center">
            {previewUrl ? (
              <img src={previewUrl} alt="Food Preview" className="w-full h-full object-cover" />
            ) : (
              <span className="text-slate-500 text-sm">No image selected</span>
            )}
            {loading && <div className="scanner-overlay"></div>}
          </div>

          {/* File Input */}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
          />

          {/* Quick Preset Buttons */}
          <div>
            <label className="text-xs text-slate-400 block mb-2 font-medium">Quick Reference Samples:</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button onClick={() => loadSample('sample_biryani.jpg', 'Chicken Biryani')} className="btn-secondary text-left py-1.5 px-2">
                🍗 Chicken Biryani
              </button>
              <button onClick={() => loadSample('sample_salad.jpg', 'Garden Salad')} className="btn-secondary text-left py-1.5 px-2">
                🥗 Green Salad
              </button>
              <button onClick={() => loadSample('sample_fresh_apple.jpg', 'Apple')} className="btn-secondary text-left py-1.5 px-2">
                🍎 Crisp Apple
              </button>
              <button onClick={() => analyzeImage(null, 'cheeseburger')} className="btn-secondary text-left py-1.5 px-2">
                🍔 Cheeseburger
              </button>
            </div>
          </div>

          {/* Optional Query Hint */}
          <div>
            <label className="text-xs text-slate-400 block mb-1 font-medium">Dish Hint or Recipe Note (Optional):</label>
            <input
              type="text"
              placeholder="e.g., Dum Biryani with raita"
              value={queryHint}
              onChange={(e) => setQueryHint(e.target.value)}
              className="w-full text-sm"
            />
          </div>

          {/* Submit Action */}
          <button
            onClick={() => analyzeImage()}
            disabled={loading}
            className="btn-primary w-full py-3"
          >
            {loading ? '🧠 Extracting Features & Nutrients...' : '✨ Recognize Food & Calculate Nutrition'}
          </button>
        </div>

        {/* Right Column: AI Recognition & Nutritional Dashboard */}
        <div className="lg:col-span-7 glass-panel p-6 space-y-6">
          <h2 className="text-xl font-bold flex items-center justify-between">
            <span className="flex items-center gap-2"><span>📊</span> Dietary Intelligence & Health Score</span>
            {result && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
                {result.confidence}% Model Confidence
              </span>
            )}
          </h2>

          {!result && !loading && (
            <div className="h-96 flex flex-col items-center justify-center text-slate-500 text-center p-8 space-y-3">
              <span className="text-5xl">🍲</span>
              <p className="text-sm">Upload or select a food image on the left to view computer vision recognition and health scoring.</p>
            </div>
          )}

          {loading && (
            <div className="h-96 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-indigo-400 font-medium">Processing vision features with PyTorch MobileNetV2...</p>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              {/* Dish Header Card */}
              <div className="glass-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-l-4 border-l-indigo-500">
                <div>
                  <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Detected Dish</span>
                  <h3 className="text-2xl font-black text-white">{result.detected_food}</h3>
                  <span className="text-xs text-indigo-300 font-medium">Cuisine: {result.cuisine} • Serving: {result.nutrition.serving_size}</span>
                </div>
                {/* Health Score Gauge */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-medium">Health Score</span>
                    <span className="text-xs font-bold" style={{ color: result.nutrition.badge_color }}>
                      {result.nutrition.health_tier}
                    </span>
                  </div>
                  <div
                    className="score-circle"
                    style={{
                      '--score-pct': result.nutrition.health_score,
                      '--score-color': result.nutrition.badge_color
                    }}
                  >
                    <span className="score-text" style={{ color: result.nutrition.badge_color }}>
                      {result.nutrition.health_score}
                    </span>
                  </div>
                </div>
              </div>

              {/* Top Candidate Probabilities */}
              <div>
                <label className="text-xs text-slate-400 font-medium mb-2 block">Vision Candidate Rankings:</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {result.top_candidates.map((cand, idx) => (
                    <div key={idx} className="glass-card p-2.5 flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-300 truncate mr-2">{cand.name}</span>
                      <span className="text-indigo-400 font-mono font-bold">{cand.confidence}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Macronutrient Cards */}
              <div>
                <label className="text-xs text-slate-400 font-medium mb-2 block">Macronutrient Distribution:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="glass-card p-3 text-center border-t-2 border-t-amber-500">
                    <span className="text-xs text-slate-400 block">Calories</span>
                    <span className="text-xl font-extrabold text-amber-400">{result.nutrition.calories}</span>
                    <span className="text-[10px] text-slate-500 block">kcal</span>
                  </div>
                  <div className="glass-card p-3 text-center border-t-2 border-t-cyan-500">
                    <span className="text-xs text-slate-400 block">Protein</span>
                    <span className="text-xl font-extrabold text-cyan-400">{result.nutrition.macronutrients.protein_g}g</span>
                    <span className="text-[10px] text-slate-500 block">{result.nutrition.macro_distribution_pct.protein}% ratio</span>
                  </div>
                  <div className="glass-card p-3 text-center border-t-2 border-t-indigo-500">
                    <span className="text-xs text-slate-400 block">Carbohydrates</span>
                    <span className="text-xl font-extrabold text-indigo-400">{result.nutrition.macronutrients.carbs_g}g</span>
                    <span className="text-[10px] text-slate-500 block">{result.nutrition.macro_distribution_pct.carbs}% ratio</span>
                  </div>
                  <div className="glass-card p-3 text-center border-t-2 border-t-rose-500">
                    <span className="text-xs text-slate-400 block">Healthy Fats</span>
                    <span className="text-xl font-extrabold text-rose-400">{result.nutrition.macronutrients.fats_g}g</span>
                    <span className="text-[10px] text-slate-500 block">{result.nutrition.macro_distribution_pct.fats}% ratio</span>
                  </div>
                </div>
              </div>

              {/* Micronutrients & Fiber */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="glass-card p-2 text-center">
                  <span className="text-slate-400 block">Fiber:</span>
                  <span className="font-bold text-emerald-400">{result.nutrition.macronutrients.fiber_g}g</span>
                </div>
                <div className="glass-card p-2 text-center">
                  <span className="text-slate-400 block">Sodium:</span>
                  <span className="font-bold text-slate-300">{result.nutrition.macronutrients.sodium_mg}mg</span>
                </div>
                <div className="glass-card p-2 text-center">
                  <span className="text-slate-400 block">Sugar:</span>
                  <span className="font-bold text-slate-300">{result.nutrition.macronutrients.sugar_g}g</span>
                </div>
              </div>

              {/* Actionable Health Insights */}
              <div className="glass-card p-4 border border-indigo-500/20 bg-indigo-950/20">
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span>💡</span> Nutritional Recommendations & Actionable Insights
                </h4>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {result.nutrition.actionable_insights}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {result.nutrition.health_tags.map((tag, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 font-medium">
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------- MODULE 2: FRESHNESS & SPOILAGE DETECTION ----------------- //

function FreshnessDetectionModule() {
  const [previewUrl, setPreviewUrl] = useState('/sample-data/sample_fresh_apple.jpg');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const loadSample = async (sampleName) => {
    setLoading(true);
    try {
      const url = `/sample-data/${sampleName}`;
      setPreviewUrl(url);
      const res = await fetch(url);
      const blob = await res.blob();
      const file = new File([blob], sampleName, { type: 'image/jpeg' });
      setSelectedFile(file);
      await analyzeFreshness(file);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const analyzeFreshness = async (fileToUpload = selectedFile) => {
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      if (fileToUpload) {
        formData.append('file', fileToUpload);
      } else {
        const res = await fetch(previewUrl);
        const blob = await res.blob();
        formData.append('file', new File([blob], 'preview.jpg', { type: 'image/jpeg' }));
      }

      const response = await fetch('/api/freshness/detect', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      alert('Error detecting freshness: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Input Column */}
      <div className="lg:col-span-5 glass-panel p-6 space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span>🔍</span> Visual Spoilage Analysis
        </h2>
        <p className="text-slate-400 text-xs">
          OpenCV feature extraction inspects discoloration, hue drift, surface roughness (Laplacian variance), and necrotic mold patches.
        </p>

        <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-700 h-64 flex items-center justify-center">
          {previewUrl ? (
            <img src={previewUrl} alt="Freshness Preview" className="w-full h-full object-cover" />
          ) : (
            <span className="text-slate-500 text-sm">No sample loaded</span>
          )}
          {loading && <div className="scanner-overlay"></div>}
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              const file = e.target.files[0];
              setSelectedFile(file);
              setPreviewUrl(URL.createObjectURL(file));
            }
          }}
          className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-500 cursor-pointer"
        />

        <div>
          <label className="text-xs text-slate-400 block mb-2 font-medium">Compare Test Samples:</label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button onClick={() => loadSample('sample_fresh_apple.jpg')} className="btn-secondary text-left py-2 px-3">
              🟢 Fresh Apple Sample
            </button>
            <button onClick={() => loadSample('sample_spoiled_fruit.jpg')} className="btn-secondary text-left py-2 px-3">
              🔴 Spoiled Fruit Sample
            </button>
          </div>
        </div>

        <button
          onClick={() => analyzeFreshness()}
          disabled={loading}
          className="btn-primary w-full py-3"
        >
          {loading ? '🔬 Extracting Texture & Color Metrics...' : '🛡️ Classify Freshness & Spoilage'}
        </button>
      </div>

      {/* Output Column */}
      <div className="lg:col-span-7 glass-panel p-6 space-y-6">
        <h2 className="text-xl font-bold flex items-center justify-between">
          <span>🧪 Quality & Safety Classification</span>
          {result && (
            <span className="text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider" style={{ background: `${result.theme_color}25`, color: result.theme_color, border: `1px solid ${result.theme_color}50` }}>
              {result.risk_level}
            </span>
          )}
        </h2>

        {!result && !loading && (
          <div className="h-96 flex flex-col items-center justify-center text-slate-500 text-center p-8 space-y-3">
            <span className="text-5xl">🔬</span>
            <p className="text-sm">Upload or select a food sample to inspect freshness, color decay, and storage recommendations.</p>
          </div>
        )}

        {loading && (
          <div className="h-96 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-cyan-400 font-medium">Analyzing color spaces (HSV/LAB) & surface contour defects...</p>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            {/* Status Banner */}
            <div
              className="p-5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              style={{
                background: `${result.theme_color}15`,
                borderColor: `${result.theme_color}40`
              }}
            >
              <div>
                <span className="text-xs uppercase tracking-wider font-bold" style={{ color: result.theme_color }}>
                  Assessment Outcome
                </span>
                <h3 className="text-3xl font-black mt-0.5 text-white">{result.freshness_state}</h3>
                <p className="text-xs text-slate-300 mt-1 font-medium">{result.estimated_shelf_life}</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black" style={{ color: result.theme_color }}>
                  {result.freshness_score}
                  <span className="text-lg text-slate-400">/100</span>
                </span>
                <span className="text-[11px] text-slate-400 block">Freshness Index ({result.confidence_percentage}% conf.)</span>
              </div>
            </div>

            {/* Extracted Computer Vision Features Table */}
            <div>
              <label className="text-xs text-slate-400 font-medium mb-2 block">Extracted Computer Vision Indicators:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="glass-card p-3">
                  <span className="text-slate-400 block">Mean Saturation</span>
                  <span className="text-lg font-bold text-white">{result.extracted_features.mean_saturation}</span>
                  <span className="text-[10px] text-slate-500 block">Vibrancy baseline</span>
                </div>
                <div className="glass-card p-3">
                  <span className="text-slate-400 block">Browning Ratio</span>
                  <span className="text-lg font-bold text-amber-400">{(result.extracted_features.browning_ratio * 100).toFixed(1)}%</span>
                  <span className="text-[10px] text-slate-500 block">Hue oxidation</span>
                </div>
                <div className="glass-card p-3">
                  <span className="text-slate-400 block">Texture Roughness</span>
                  <span className="text-lg font-bold text-cyan-400">{result.extracted_features.texture_roughness_laplacian}</span>
                  <span className="text-[10px] text-slate-500 block">Laplacian variance</span>
                </div>
                <div className="glass-card p-3">
                  <span className="text-slate-400 block">Surface Defect Ratio</span>
                  <span className="text-lg font-bold text-rose-400">{(result.extracted_features.defect_ratio * 100).toFixed(1)}%</span>
                  <span className="text-[10px] text-slate-500 block">Blemish contours</span>
                </div>
              </div>
            </div>

            {/* Safety Recommendations */}
            <div className="glass-card p-4 border border-cyan-500/20 bg-cyan-950/20 space-y-2">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>🛡️</span> Safety Advisory
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {result.safety_recommendation}
              </p>
            </div>

            {/* Storage Protocol */}
            <div className="glass-card p-4 border border-emerald-500/20 bg-emerald-950/20 space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>❄️</span> Optimal Storage & Preservation Protocol
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                {result.storage_protocol}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------- MODULE 3: RESTAURANT HYGIENE MONITOR ----------------- //

function HygieneMonitorModule() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState('/sample-data/sample_kitchen_clip.mp4');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const runAudit = async (fileToUpload = selectedFile) => {
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      if (fileToUpload) {
        formData.append('file', fileToUpload);
      } else {
        const res = await fetch(videoPreview);
        const blob = await res.blob();
        formData.append('file', new File([blob], 'kitchen_clip.mp4', { type: 'video/mp4' }));
      }

      const response = await fetch('/api/hygiene/analyze-video', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      alert('Error analyzing kitchen hygiene video: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Video Ingestion */}
      <div className="lg:col-span-5 glass-panel p-6 space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span>📹</span> Kitchen Video Ingestion
        </h2>
        <p className="text-slate-400 text-xs">
          Automated multi-frame CCTV video audit analyzing glove compliance, hairnet coverage, and prep surface sanitation.
        </p>

        <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-700 h-60 flex items-center justify-center">
          {videoPreview ? (
            <video src={videoPreview} controls loop autoPlay muted className="w-full h-full object-cover"></video>
          ) : (
            <span className="text-slate-500 text-sm">No video loaded</span>
          )}
        </div>

        <input
          type="file"
          accept="video/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              const file = e.target.files[0];
              setSelectedFile(file);
              setVideoPreview(URL.createObjectURL(file));
            }
          }}
          className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
        />

        <div className="flex gap-2">
          <button
            onClick={() => {
              setVideoPreview('/sample-data/sample_kitchen_clip.mp4');
              setSelectedFile(null);
              runAudit(null);
            }}
            className="btn-secondary w-full text-xs py-2"
          >
            🎬 Load Standard Kitchen CCTV Footage
          </button>
        </div>

        <button
          onClick={() => runAudit()}
          disabled={loading}
          className="btn-primary w-full py-3"
        >
          {loading ? '🔍 Extracting Frames & Auditing Behaviors...' : '🛡️ Run Hygiene Compliance Audit'}
        </button>
      </div>

      {/* Audit Report */}
      <div className="lg:col-span-7 glass-panel p-6 space-y-6">
        <h2 className="text-xl font-bold flex items-center justify-between">
          <span>📋 Sanitation Compliance Audit Report</span>
          {result && (
            <span className="text-xs px-2.5 py-1 rounded-full font-bold" style={{ color: result.badge_color, background: `${result.badge_color}20` }}>
              {result.risk_status}
            </span>
          )}
        </h2>

        {!result && !loading && (
          <div className="h-96 flex flex-col items-center justify-center text-slate-500 text-center p-8 space-y-3">
            <span className="text-5xl">🛡️</span>
            <p className="text-sm">Upload kitchen surveillance footage or load standard clip to generate an automated sanitation compliance score.</p>
          </div>
        )}

        {loading && (
          <div className="h-96 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-indigo-400 font-medium">Extracting temporal frames & analyzing blue nitrile glove coverage...</p>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            {/* Grade Card */}
            <div
              className="p-5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              style={{
                background: `${result.badge_color}15`,
                borderColor: `${result.badge_color}40`
              }}
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: result.badge_color }}>
                  Certified Inspection Rating
                </span>
                <h3 className="text-2xl font-black text-white mt-1">{result.hygiene_grade}</h3>
                <span className="text-xs text-slate-300">Audited across {result.total_frames_audited} representative footage intervals</span>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black" style={{ color: result.badge_color }}>
                  {result.overall_compliance_score}%
                </span>
                <span className="text-[11px] text-slate-400 block">Overall Compliance</span>
              </div>
            </div>

            {/* Key Hygiene Indicators Progress */}
            <div className="space-y-3">
              <label className="text-xs text-slate-400 font-medium block">Compliance Sub-Scores:</label>
              
              <div className="glass-card p-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">🧤 Glove Compliance (Food Handling Zone)</span>
                  <span className="font-bold text-cyan-400">{result.metrics.glove_compliance_pct}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${result.metrics.glove_compliance_pct}%` }}></div>
                </div>
              </div>

              <div className="glass-card p-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">🧑‍🍳 Hair-Cap & Head Restraint Presence</span>
                  <span className="font-bold text-indigo-400">{result.metrics.haircap_compliance_pct}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${result.metrics.haircap_compliance_pct}%` }}></div>
                </div>
              </div>

              <div className="glass-card p-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">🧽 Stainless Prep Counter Cleanliness</span>
                  <span className="font-bold text-emerald-400">{result.metrics.surface_cleanliness_pct}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${result.metrics.surface_cleanliness_pct}%` }}></div>
                </div>
              </div>
            </div>

            {/* Violation Log */}
            <div>
              <label className="text-xs text-slate-400 font-medium mb-2 block flex items-center justify-between">
                <span>Violations Flagged:</span>
                <span className="text-slate-500">{result.detected_violations_count} detected</span>
              </label>
              {result.violations_log.length === 0 ? (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                  ✓ Zero critical violations observed in audited footage.
                </div>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {result.violations_log.map((v, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-rose-400 uppercase tracking-wide mr-2">[{v.timestamp}]</span>
                        <span className="text-slate-200">{v.message}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                        {v.severity}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Remediation Protocol */}
            <div className="glass-card p-4 border border-indigo-500/20 bg-indigo-950/20 space-y-2">
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>📝</span> Mandatory Corrective Remediations
              </h4>
              <ul className="space-y-1 text-xs text-slate-300">
                {result.actionable_remediations.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-indigo-400">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------- MODULE 4: SMART KITCHEN ASSISTANT ----------------- //

function SmartKitchenModule() {
  const [dishQuery, setDishQuery] = useState('Chicken Dum Biryani');
  const [ingredientsText, setIngredientsText] = useState('Chicken, Rice, Curd, Spices');
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [chatQuery, setChatQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'assistant', text: 'Hello Chef! Ask me anything about ingredient swaps, food safety temperatures, or techniques.' }
  ]);

  const fetchRecipe = async (dish = dishQuery) => {
    setLoading(true);
    try {
      const payload = {
        dish_name: dish,
        ingredients: ingredientsText.split(',').map(s => s.trim()).filter(Boolean)
      };
      const response = await fetch('/api/kitchen/recipe-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      setRecipe(data);
      setActiveStep(0);
    } catch (err) {
      alert('Error fetching recipe: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAskAssistant = async (e) => {
    e.preventDefault();
    if (!chatQuery.trim()) return;
    const userMsg = chatQuery;
    setChatQuery('');
    setChatHistory(prev => [...prev, { sender: 'user', text: userMsg }]);

    try {
      const response = await fetch('/api/kitchen/ask-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg, active_dish: recipe ? recipe.recipe_title : null })
      });
      const data = await response.json();
      setChatHistory(prev => [...prev, { sender: 'assistant', text: data.response }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { sender: 'assistant', text: 'Error contacting assistant.' }]);
    }
  };

  useEffect(() => {
    fetchRecipe('Chicken Dum Biryani');
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Recipe Controls & Chat Column */}
      <div className="lg:col-span-5 space-y-6">
        <div className="glass-panel p-6 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>👨‍🍳</span> Recipe Synthesizer
          </h2>
          <div>
            <label className="text-xs text-slate-400 block mb-1 font-medium">Select Recipe or Enter Dish Name:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={dishQuery}
                onChange={(e) => setDishQuery(e.target.value)}
                className="w-full text-sm"
              />
              <button onClick={() => fetchRecipe()} className="btn-primary text-xs whitespace-nowrap">
                Load
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 text-xs">
            <button onClick={() => { setDishQuery('Chicken Dum Biryani'); fetchRecipe('Chicken Dum Biryani'); }} className="btn-secondary py-1 px-2">
              🍗 Biryani
            </button>
            <button onClick={() => { setDishQuery('Pan-Seared Salmon with Lemon Herb Garden Salad'); fetchRecipe('Pan-Seared Salmon with Lemon Herb Garden Salad'); }} className="btn-secondary py-1 px-2">
              🐟 Salmon Salad
            </button>
            <button onClick={() => { setDishQuery('Tandoori Spiced Paneer Tikka with Mint Dip'); fetchRecipe('Tandoori Spiced Paneer Tikka with Mint Dip'); }} className="btn-secondary py-1 px-2">
              🧀 Paneer Tikka
            </button>
            <button onClick={() => { setDishQuery('Crispy Tofu & Rainbow Vegetable Stir Fry'); fetchRecipe('Crispy Tofu & Rainbow Vegetable Stir Fry'); }} className="btn-secondary py-1 px-2">
              🥦 Tofu Stir Fry
            </button>
          </div>
        </div>

        {/* Live Culinary Chatbot */}
        <div className="glass-panel p-6 space-y-4">
          <h3 className="text-base font-bold flex items-center gap-2 text-indigo-300">
            <span>💬</span> Interactive Culinary Q&A
          </h3>
          <div className="h-64 overflow-y-auto space-y-2 p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs">
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-xl max-w-[85%] ${
                  msg.sender === 'user'
                    ? 'ml-auto bg-indigo-600 text-white rounded-br-none'
                    : 'mr-auto bg-slate-800/80 text-slate-200 border border-slate-700 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleAskAssistant} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Substitute for heavy cream?"
              value={chatQuery}
              onChange={(e) => setChatQuery(e.target.value)}
              className="w-full text-xs"
            />
            <button type="submit" className="btn-primary text-xs py-2 px-3">
              Ask
            </button>
          </form>
        </div>
      </div>

      {/* Procedural Recipe Steps Column */}
      <div className="lg:col-span-7 glass-panel p-6 space-y-6">
        {loading && (
          <div className="h-96 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-indigo-400">Synthesizing step-by-step guidance & safety tips...</p>
          </div>
        )}

        {recipe && !loading && (
          <div className="space-y-6">
            {/* Recipe Banner */}
            <div className="glass-card p-5 border-l-4 border-l-amber-500">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs text-amber-400 uppercase tracking-wider font-bold">{recipe.cuisine} • {recipe.difficulty}</span>
                  <h3 className="text-2xl font-black text-white mt-0.5">{recipe.recipe_title}</h3>
                </div>
                <div className="flex gap-3 text-xs text-slate-300">
                  <span className="glass-card px-2.5 py-1">⏱️ Prep: {recipe.prep_time_minutes}m</span>
                  <span className="glass-card px-2.5 py-1">🔥 Cook: {recipe.cook_time_minutes}m</span>
                  <span className="glass-card px-2.5 py-1">🍽️ {recipe.calories_per_serving} kcal</span>
                </div>
              </div>
            </div>

            {/* Ingredients Checklist */}
            <div>
              <label className="text-xs text-slate-400 font-medium mb-2 block">Ingredients & Quantities:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {recipe.ingredients.map((ing, i) => (
                  <div key={i} className="glass-card p-2 flex items-center justify-between">
                    <span className="text-slate-200">✓ {ing.item}</span>
                    <span className="font-semibold text-cyan-400">{ing.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step-by-Step Guidance */}
            <div className="space-y-3">
              <label className="text-xs text-slate-400 font-medium block">Procedural Cooking Timeline:</label>
              <div className="space-y-3">
                {recipe.step_by_step_instructions.map((step, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`glass-card p-4 cursor-pointer transition-all ${
                      activeStep === idx
                        ? 'border-indigo-500 bg-indigo-950/20 ring-1 ring-indigo-500'
                        : 'opacity-85 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                        Step {step.step_number}: {step.action}
                      </span>
                      {step.timer_seconds && (
                        <span className="text-xs font-mono text-cyan-400">
                          ⏳ ~{Math.round(step.timer_seconds / 60)} min
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-medium">
                      {step.instruction}
                    </p>
                    {step.safety_tip && (
                      <div className="mt-2 text-[11px] text-amber-300 flex items-center gap-1.5 bg-amber-500/10 p-1.5 rounded">
                        <span>⚠️ Safety Milestone:</span>
                        <span>{step.safety_tip}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------- MODULE 5: PERSONALIZED MEAL PLANNER ----------------- //

function MealPlannerModule() {
  const [profile, setProfile] = useState({
    name: 'Rahul Giri',
    age: 25,
    gender: 'male',
    height_cm: 175,
    weight_kg: 70,
    activity_level: 'moderately_active',
    health_goal: 'weight_loss',
    dietary_preference: 'omnivore'
  });

  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);

  const generatePlan = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/meal-planner/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      const data = await response.json();
      setPlan(data);
    } catch (err) {
      alert('Error generating meal plan: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generatePlan();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Profile Form Column */}
      <div className="lg:col-span-4 glass-panel p-6 space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span>⚙️</span> Biometric Profile
        </h2>

        <div>
          <label className="text-xs text-slate-400 block mb-1">Full Name:</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full text-xs"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Age:</label>
            <input
              type="number"
              value={profile.age}
              onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 20 })}
              className="w-full text-xs"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Gender:</label>
            <select
              value={profile.gender}
              onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
              className="w-full text-xs"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Height (cm):</label>
            <input
              type="number"
              value={profile.height_cm}
              onChange={(e) => setProfile({ ...profile, height_cm: parseFloat(e.target.value) || 170 })}
              className="w-full text-xs"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Weight (kg):</label>
            <input
              type="number"
              value={profile.weight_kg}
              onChange={(e) => setProfile({ ...profile, weight_kg: parseFloat(e.target.value) || 70 })}
              className="w-full text-xs"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-400 block mb-1">Physical Activity Level:</label>
          <select
            value={profile.activity_level}
            onChange={(e) => setProfile({ ...profile, activity_level: e.target.value })}
            className="w-full text-xs"
          >
            <option value="sedentary">Sedentary (Little or no exercise)</option>
            <option value="lightly_active">Lightly Active (Exercise 1-3 days/wk)</option>
            <option value="moderately_active">Moderately Active (Exercise 3-5 days/wk)</option>
            <option value="very_active">Very Active (Heavy exercise 6-7 days/wk)</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-slate-400 block mb-1">Primary Dietary Goal:</label>
          <select
            value={profile.health_goal}
            onChange={(e) => setProfile({ ...profile, health_goal: e.target.value })}
            className="w-full text-xs"
          >
            <option value="weight_loss">Weight Loss (Caloric Deficit & High Satiety)</option>
            <option value="muscle_gain">Muscle Hypertrophy (Caloric Surplus & Protein)</option>
            <option value="maintenance">Balanced Maintenance & Vitality</option>
            <option value="keto">Keto (High Fat, Low Carb)</option>
            <option value="diabetic_friendly">Diabetic-Friendly (Low Glycemic)</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-slate-400 block mb-1">Dietary Preference:</label>
          <select
            value={profile.dietary_preference}
            onChange={(e) => setProfile({ ...profile, dietary_preference: e.target.value })}
            className="w-full text-xs"
          >
            <option value="omnivore">Omnivore (Standard)</option>
            <option value="vegetarian">Vegetarian (Dairy-inclusive)</option>
            <option value="vegan">100% Plant-Based (Vegan)</option>
          </select>
        </div>

        <button
          onClick={generatePlan}
          disabled={loading}
          className="btn-primary w-full py-3"
        >
          {loading ? '⚡ Calculating BMR & TDEE...' : '⚡ Generate Adaptive Meal Plan'}
        </button>
      </div>

      {/* Plan Output Column */}
      <div className="lg:col-span-8 glass-panel p-6 space-y-6">
        {loading && (
          <div className="h-96 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-indigo-400 font-medium">Computing scientific caloric thresholds...</p>
          </div>
        )}

        {plan && !loading && (
          <div className="space-y-6">
            {/* Metrics Overview Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="glass-card p-3 border-t-2 border-t-cyan-500">
                <span className="text-xs text-slate-400 block">Basal Metabolic Rate</span>
                <span className="text-xl font-bold text-cyan-400">{plan.profile_metrics.bmr_kcal}</span>
                <span className="text-[10px] text-slate-500 block">BMR (kcal)</span>
              </div>
              <div className="glass-card p-3 border-t-2 border-t-indigo-500">
                <span className="text-xs text-slate-400 block">Total Expenditure</span>
                <span className="text-xl font-bold text-indigo-400">{plan.profile_metrics.tdee_kcal}</span>
                <span className="text-[10px] text-slate-500 block">TDEE (kcal)</span>
              </div>
              <div className="glass-card p-3 border-t-2 border-t-amber-500">
                <span className="text-xs text-slate-400 block">Target Daily Cals</span>
                <span className="text-xl font-bold text-amber-400">{plan.profile_metrics.target_calories_daily}</span>
                <span className="text-[10px] text-slate-500 block">Adjusted for Goal</span>
              </div>
              <div className="glass-card p-3 border-t-2 border-t-emerald-500">
                <span className="text-xs text-slate-400 block">Hydration Target</span>
                <span className="text-xl font-bold text-emerald-400">{plan.profile_metrics.recommended_water_liters}L</span>
                <span className="text-[10px] text-slate-500 block">Pure Water / Day</span>
              </div>
            </div>

            {/* Daily Meals Breakdown */}
            <div>
              <h3 className="text-base font-bold text-white mb-3 flex items-center justify-between">
                <span>🍽️ Customized Daily Meals</span>
                <span className="text-xs text-slate-400">Target: {plan.profile_metrics.target_calories_daily} kcal/day</span>
              </h3>
              <div className="space-y-3">
                {plan.daily_meal_plan.map((m, idx) => (
                  <div key={idx} className="glass-card p-4 space-y-2 border-l-4 border-l-indigo-500">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                          {m.meal} ({m.time})
                        </span>
                        <span className="text-sm font-bold text-white">{m.item}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-400">{m.calories} kcal</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Portion: {m.portion}</span>
                      <span>Macros: {m.protein_g}g Protein • {m.carbs_g}g Carbs • {m.fats_g}g Fats</span>
                    </div>

                    <div className="text-[11px] text-cyan-300 bg-cyan-950/30 p-2 rounded border border-cyan-800/40">
                      🔄 <span className="font-semibold">Flexible Alternative:</span> {m.swap_alternative}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Overview */}
            <div>
              <h3 className="text-base font-bold text-white mb-3">📅 7-Day Adaptive Schedule</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-center text-xs">
                {plan.weekly_overview.map((d, i) => (
                  <div key={i} className="glass-card p-2">
                    <span className="font-bold text-indigo-300 block">{d.day.substring(0, 3)}</span>
                    <span className="text-[10px] text-slate-400 block">{d.calorie_target} kcal</span>
                    <span className="text-[9px] text-slate-500 block truncate mt-1">{d.focus}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------- MODULE 6: MULTIMODAL HUB ----------------- //

function MultimodalHubModule() {
  const [prompt, setPrompt] = useState('Analyze this food image, verify freshness, and generate a healthy recipe under 400 kcal.');
  const [audioTranscript, setAudioTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('/sample-data/sample_biryani.jpg');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Web Speech API Voice Dictation
  const toggleRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setAudioTranscript(text);
      setIsRecording(false);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognition.start();
  };

  const handleReason = async () => {
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('prompt', prompt);
      if (audioTranscript) formData.append('audio_transcript', audioTranscript);

      if (selectedFile) {
        formData.append('file', selectedFile);
      } else if (previewUrl) {
        const res = await fetch(previewUrl);
        const blob = await res.blob();
        formData.append('file', new File([blob], 'input.jpg', { type: 'image/jpeg' }));
      }

      const response = await fetch('/api/multimodal/reason', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      alert('Multimodal reasoning error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span>✨</span> Multimodal AI Reasoning Coordinator
            </h2>
            <p className="text-slate-400 text-xs">
              Meta LLaMA architecture grounding visual food perception, voice dictation, and contextual recipe generation into unified intelligence.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 font-mono">
            LLaMA-3 Multimodal Engine
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Image Upload / Preview */}
          <div className="md:col-span-4 space-y-2">
            <label className="text-xs text-slate-400 font-medium block">Visual Modality (Image Input):</label>
            <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-700 h-44 flex items-center justify-center">
              <img src={previewUrl} alt="Multimodal Preview" className="w-full h-full object-cover" />
              {loading && <div className="scanner-overlay"></div>}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  setSelectedFile(file);
                  setPreviewUrl(URL.createObjectURL(file));
                }
              }}
              className="w-full text-xs text-slate-400"
            />
          </div>

          {/* Text and Voice Inputs */}
          <div className="md:col-span-8 space-y-3">
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">Text Context / Instruction:</label>
              <textarea
                rows="3"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full text-xs"
                placeholder="Describe your request..."
              ></textarea>
            </div>

            {/* Audio Voice Input */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleRecording}
                className={`text-xs px-3 py-2 rounded-lg font-semibold flex items-center gap-2 ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700'
                }`}
              >
                <span>{isRecording ? '🔴 Listening...' : '🎙️ Dictate Spoken Query'}</span>
              </button>
              <input
                type="text"
                placeholder="Voice transcript will appear here..."
                value={audioTranscript}
                onChange={(e) => setAudioTranscript(e.target.value)}
                className="w-full text-xs"
              />
            </div>

            <button
              onClick={handleReason}
              disabled={loading}
              className="btn-primary w-full py-3 text-sm"
            >
              {loading ? '🧠 Synthesizing Multimodal Reasoning...' : '🚀 Execute Unified Multimodal Inference'}
            </button>
          </div>
        </div>
      </div>

      {/* Multimodal Reasoning Results */}
      {result && (
        <div className="glass-panel p-6 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>🧠</span> Unified AI Synthesis
          </h3>

          <div className="glass-card p-4 border border-indigo-500/30 bg-indigo-950/20 text-slate-200 text-sm leading-relaxed">
            {result.synthesized_response}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-4 space-y-2">
              <span className="text-xs text-indigo-400 uppercase tracking-wider font-bold">Vision Identification</span>
              <h4 className="text-lg font-black text-white">{result.visual_recognition.detected_food}</h4>
              <p className="text-xs text-slate-400">Calories: {result.visual_recognition.nutrition.calories} kcal • Score: {result.visual_recognition.nutrition.health_score}/100</p>
            </div>

            <div className="glass-card p-4 space-y-2">
              <span className="text-xs text-cyan-400 uppercase tracking-wider font-bold">Freshness Assessment</span>
              <h4 className="text-lg font-black text-white">{result.freshness_evaluation.freshness_state}</h4>
              <p className="text-xs text-slate-400">Freshness Score: {result.freshness_evaluation.freshness_score}/100 • {result.freshness_evaluation.risk_level}</p>
            </div>

            <div className="glass-card p-4 space-y-2">
              <span className="text-xs text-emerald-400 uppercase tracking-wider font-bold">Actionable Cooking</span>
              <h4 className="text-lg font-black text-white">{result.cooking_guidance.recipe_title}</h4>
              <p className="text-xs text-slate-400">Prep time: {result.cooking_guidance.prep_time_minutes}m • {result.cooking_guidance.difficulty}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Render React App to DOM
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
