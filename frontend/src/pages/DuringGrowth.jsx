import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  CloudRain,
  CloudSun,
  Droplets,
  Info,
  Loader2,
  MapPin,
  Sprout,
  Thermometer,
  TrendingUp,
  Bug,
  ShieldCheck,
  ArrowRight,
  Activity,
} from "lucide-react";

import LocationDetector from "../components/LocationDetector";
import { cropData } from "../data/cropData";
import { getWeather } from "../services/weatherService";
import { generateGrowthAdvice } from "../services/growthAdvisor";


// --------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------

export default function DuringGrowth() {
  const [crop, setCrop] = useState("Groundnut");
  const [growthStage, setGrowthStage] = useState("Seedling");
  const [irrigation, setIrrigation] = useState("Normal");
  const [pestObservation, setPestObservation] = useState("No");
  const [rainfall, setRainfall] = useState("Normal");

  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);

  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState("");

  const [analysis, setAnalysis] = useState(null);

  const selectedCrop = cropData.find(
    (item) => item.name === crop
  );

  // --------------------------------------------------
  // WEATHER
  // --------------------------------------------------

  const loadWeather = async (detectedLocation) => {
    if (
      !detectedLocation?.latitude ||
      !detectedLocation?.longitude
    ) {
      setWeatherError(
        "Location coordinates are not available."
      );
      return;
    }

    setWeatherLoading(true);
    setWeatherError("");
    setAnalysis(null);

    try {
      const result = await getWeather(
        detectedLocation.latitude,
        detectedLocation.longitude
      );

      setWeather(result);
    } catch (error) {
      console.error(error);

      setWeather(null);

      setWeatherError(
        "Weather data could not be loaded. You can still review the field conditions."
      );
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleLocationDetected = (detectedLocation) => {
    setLocation(detectedLocation);
    loadWeather(detectedLocation);
  };

  // --------------------------------------------------
  // CROP CHANGE
  // --------------------------------------------------

  const handleCropChange = (value) => {
    setCrop(value);

    const nextCrop = cropData.find(
      (item) => item.name === value
    );

    if (nextCrop?.growthStages?.length) {
      setGrowthStage(nextCrop.growthStages[0]);
    } else {
      setGrowthStage("Seedling");
    }

    setAnalysis(null);
  };

  // --------------------------------------------------
  // ANALYSIS
  // --------------------------------------------------

  const analyzeField = () => {
    if (!weather) {
      setAnalysis({
        status: "Weather Data Not Available",
        risks: [],
        actions: [
          "Enable location detection and allow weather data to load before running the full advisory.",
          "You can continue reviewing the farmer-reported field conditions.",
        ],
        weatherContext: {
          temperature: null,
          humidity: null,
          rain: null,
          precipitation: null,
        },
        generatedAt: new Date().toISOString(),
      });

      return;
    }

    const currentWeather =
      weather?.current || weather || {};

    const normalizedWeather = {
      current: {
        temperature:
          currentWeather.temperature ?? null,

        humidity:
          currentWeather.humidity ?? null,

        rain:
          currentWeather.rain ?? null,

        precipitation:
          currentWeather.precipitation ?? null,
      },

      daily: weather?.daily || null,

      timezone: weather?.timezone || null,
    };

    const result = generateGrowthAdvice({
      crop,
      growthStage,
      irrigation,
      pestObservation,
      rainfall,
      weather: normalizedWeather,
    });

    setAnalysis(result);
  };

  // --------------------------------------------------
  // DERIVED UI VALUES
  // --------------------------------------------------

  const riskCount = analysis?.risks?.length || 0;

  const highRiskCount =
    analysis?.risks?.filter(
      (risk) => risk.level === "high"
    ).length || 0;

  const warningCount =
    analysis?.risks?.filter(
      (risk) => risk.level === "warning"
    ).length || 0;

  const hasWeather =
    weather && !weatherLoading;

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ==================================================
          HERO
      ================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 text-white">

        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-teal-300/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-100 backdrop-blur">
            <Activity size={14} />
            Decision Support / Crop Health Monitoring
          </div>

          <div className="max-w-3xl">

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              During Growth
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50/80 sm:text-base">
              Monitor crop conditions using hyper-local weather,
              farmer-reported field observations and explainable
              risk signals.
            </p>

          </div>

          {/* Journey */}

          <div className="mt-8 grid gap-3 sm:grid-cols-4">

            <JourneyStep
              number="01"
              icon={<MapPin size={17} />}
              title="Location"
              text="Farm context"
              active={Boolean(location)}
            />

            <JourneyStep
              number="02"
              icon={<CloudSun size={17} />}
              title="Weather"
              text="Local conditions"
              active={Boolean(weather)}
            />

            <JourneyStep
              number="03"
              icon={<Sprout size={17} />}
              title="Field Condition"
              text="Farmer inputs"
              active={Boolean(crop && growthStage)}
            />

            <JourneyStep
              number="04"
              icon={<TrendingUp size={17} />}
              title="Advisory"
              text="Explainable signals"
              active={Boolean(analysis)}
            />

          </div>
        </div>
      </section>


      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ==================================================
            LOCATION
        ================================================== */}

        <section className="mb-8">

          <SectionHeading
            icon={<MapPin size={19} />}
            title="1. Hyper-Local Farm Context"
            description="Use the farm's detected location to connect field conditions with local weather."
          />

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <LocationDetector
              onLocationDetected={handleLocationDetected}
            />

            {location && (
              <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 p-4">

                <div className="flex items-start gap-3">

                  <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
                    <MapPin size={18} />
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-sm font-bold text-emerald-950">
                      Location context detected
                    </p>

                    <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                      <ContextValue
                        label="Village / Town"
                        value={
                          location.village ||
                          location.town ||
                          location.city ||
                          "Not available"
                        }
                      />

                      <ContextValue
                        label="Taluk"
                        value={
                          location.taluk ||
                          "Not available"
                        }
                      />

                      <ContextValue
                        label="District"
                        value={
                          location.district ||
                          "Not available"
                        }
                      />

                      <ContextValue
                        label="State"
                        value={
                          location.state ||
                          "Not available"
                        }
                      />

                    </div>

                    {(location.latitude ||
                      location.longitude) && (
                      <div className="mt-3 text-xs text-emerald-800/70">
                        GPS:{" "}
                        {location.latitude?.toFixed?.(5) ??
                          location.latitude}
                        ,{" "}
                        {location.longitude?.toFixed?.(5) ??
                          location.longitude}
                      </div>
                    )}

                  </div>
                </div>
              </div>
            )}

          </div>
        </section>


        {/* ==================================================
            WEATHER
        ================================================== */}

        <section className="mb-8">

          <SectionHeading
            icon={<CloudSun size={19} />}
            title="2. Current Weather Context"
            description="Weather is used as a contextual signal alongside farmer-reported observations."
          />

          {weatherLoading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

              <Loader2
                className="mx-auto animate-spin text-emerald-600"
                size={28}
              />

              <p className="mt-3 text-sm font-semibold text-slate-700">
                Loading hyper-local weather...
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Fetching current conditions for the detected farm location.
              </p>

            </div>
          ) : weatherError ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">

              <div className="flex items-start gap-3">

                <AlertCircle
                  size={20}
                  className="mt-0.5 text-amber-700"
                />

                <div>
                  <p className="font-semibold text-amber-900">
                    Weather context unavailable
                  </p>

                  <p className="mt-1 text-sm leading-6 text-amber-800">
                    {weatherError}
                  </p>
                </div>

              </div>

            </div>
          ) : weather ? (
            <WeatherOverview weather={weather} />
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">

              <CloudRain
                className="mx-auto text-slate-400"
                size={30}
              />

              <p className="mt-3 font-semibold text-slate-700">
                Detect the farm location to load weather
              </p>

              <p className="mx-auto mt-1 max-w-lg text-sm text-slate-500">
                Weather is not treated as a diagnosis. It is one
                contextual signal used together with field observations.
              </p>

            </div>
          )}

        </section>


        {/* ==================================================
            FIELD CONDITION
        ================================================== */}

        <section className="mb-8">

          <SectionHeading
            icon={<Sprout size={19} />}
            title="3. Field Condition"
            description="Combine crop stage, irrigation, rainfall and visible observations."
          />

          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">

            {/* INPUT CARD */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="grid gap-5 sm:grid-cols-2">

                <SelectField
                  label="Crop"
                  value={crop}
                  onChange={(event) =>
                    handleCropChange(event.target.value)
                  }
                  options={cropData.map(
                    (item) => item.name
                  )}
                />

                <SelectField
                  label="Growth Stage"
                  value={growthStage}
                  onChange={(event) => {
                    setGrowthStage(
                      event.target.value
                    );
                    setAnalysis(null);
                  }}
                  options={
                    selectedCrop?.growthStages?.length
                      ? selectedCrop.growthStages
                      : [
                          "Seedling",
                          "Vegetative",
                          "Flowering",
                          "Maturity",
                        ]
                  }
                />

                <SelectField
                  label="Irrigation Condition"
                  value={irrigation}
                  onChange={(event) => {
                    setIrrigation(
                      event.target.value
                    );
                    setAnalysis(null);
                  }}
                  options={[
                    "Low",
                    "Normal",
                    "High",
                  ]}
                />

                <SelectField
                  label="Pest / Disease Observation"
                  value={pestObservation}
                  onChange={(event) => {
                    setPestObservation(
                      event.target.value
                    );
                    setAnalysis(null);
                  }}
                  options={[
                    "No",
                    "Yes",
                  ]}
                />

                <div className="sm:col-span-2">
                  <SelectField
                    label="Recent Rainfall"
                    value={rainfall}
                    onChange={(event) => {
                      setRainfall(
                        event.target.value
                      );
                      setAnalysis(null);
                    }}
                    options={[
                      "Low",
                      "Normal",
                      "Heavy",
                    ]}
                  />
                </div>

              </div>


              {/* CROP SNAPSHOT */}

              {selectedCrop && (
                <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50/70 p-4">

                  <div className="flex items-center gap-3">

                    <div className="rounded-xl bg-white p-2 text-emerald-700 shadow-sm">
                      <Sprout size={18} />
                    </div>

                    <div>
                      <p className="font-bold text-emerald-950">
                        {selectedCrop.name}
                      </p>

                      <p className="text-xs text-emerald-800/70">
                        Crop context from the RuralAI Nexus reference data.
                      </p>
                    </div>

                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">

                    <SmallInfo
                      label="Category"
                      value={
                        selectedCrop.category ||
                        "Crop"
                      }
                    />

                    <SmallInfo
                      label="Water Requirement"
                      value={
                        selectedCrop.waterRequirement ||
                        "Reference available"
                      }
                    />

                    <SmallInfo
                      label="Duration"
                      value={
                        selectedCrop.duration
                          ? `${selectedCrop.duration}`
                          : "Reference available"
                      }
                    />

                  </div>

                  {selectedCrop.risk && (
                    <div className="mt-3 rounded-lg bg-white/70 p-3 text-xs leading-5 text-slate-600">
                      <span className="font-semibold text-slate-800">
                        Reference risk:
                      </span>{" "}
                      {selectedCrop.risk}
                    </div>
                  )}

                </div>
              )}


              {/* ANALYZE BUTTON */}

              <button
                type="button"
                onClick={analyzeField}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 active:scale-[0.99]"
              >
                <TrendingUp size={18} />
                Analyze Crop Condition
                <ArrowRight size={17} />
              </button>

            </div>


            {/* FIELD SNAPSHOT */}

            <div className="rounded-2xl border border-slate-200 bg-slate-900 p-5 text-white shadow-sm">

              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                Field snapshot
              </p>

              <h3 className="mt-2 text-xl font-bold">
                {crop}
              </h3>

              <p className="mt-1 text-sm text-slate-300">
                {growthStage} stage
              </p>

              <div className="mt-6 space-y-3">

                <SnapshotRow
                  icon={<Droplets size={16} />}
                  label="Irrigation"
                  value={irrigation}
                />

                <SnapshotRow
                  icon={<CloudRain size={16} />}
                  label="Rainfall"
                  value={rainfall}
                />

                <SnapshotRow
                  icon={<Bug size={16} />}
                  label="Pest / disease observation"
                  value={
                    pestObservation === "Yes"
                      ? "Reported"
                      : "Not reported"
                  }
                />

                <SnapshotRow
                  icon={<CloudSun size={16} />}
                  label="Weather"
                  value={
                    hasWeather
                      ? "Available"
                      : "Waiting"
                  }
                />

              </div>

              <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">

                <div className="flex gap-3">

                  <Info
                    size={17}
                    className="mt-0.5 shrink-0 text-emerald-300"
                  />

                  <p className="text-xs leading-5 text-slate-300">
                    RuralAI Nexus combines these inputs instead
                    of relying on a single signal. The advisory
                    is decision support, not a guaranteed diagnosis.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ==================================================
            ANALYSIS
        ================================================== */}

        {analysis && (
          <section
            id="growth-advisory"
            className="mb-8 scroll-mt-6"
          >

            <SectionHeading
              icon={<ShieldCheck size={19} />}
              title="4. AI Crop Health & Risk Advisory"
              description="The advisory explains which reported or weather-related signals triggered each monitoring recommendation."
            />


            {/* STATUS */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex items-start gap-3">

                  <div
                    className={`rounded-xl p-2 ${
                      riskCount > 0
                        ? "bg-amber-100 text-amber-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {riskCount > 0 ? (
                      <AlertCircle size={21} />
                    ) : (
                      <CheckCircle2 size={21} />
                    )}
                  </div>

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Advisory status
                    </p>

                    <h3 className="mt-1 text-xl font-bold text-slate-900">
                      {analysis.status}
                    </h3>

                  </div>

                </div>


                {riskCount > 0 && (
                  <div className="flex flex-wrap gap-2">

                    {highRiskCount > 0 && (
                      <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700">
                        {highRiskCount} high-priority
                      </span>
                    )}

                    {warningCount > 0 && (
                      <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
                        {warningCount} monitoring
                      </span>
                    )}

                  </div>
                )}

              </div>


              {/* ==================================================
                  PRIORITY ACTION
              ================================================== */}

              {analysis.actions?.length > 0 && (
                <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50 p-4">

                  <div className="flex items-start gap-3">

                    <div className="rounded-lg bg-white p-2 text-emerald-700 shadow-sm">
                      <CheckCircle2 size={18} />
                    </div>

                    <div className="min-w-0">

                      <p className="font-bold text-emerald-950">
                        Suggested monitoring actions
                      </p>

                      <div className="mt-3 space-y-2">

                        {analysis.actions.map(
                          (action, index) => (
                            <div
                              key={`${action}-${index}`}
                              className="flex gap-2 text-sm leading-6 text-emerald-900"
                            >
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />

                              <span>{action}</span>
                            </div>
                          )
                        )}

                      </div>

                    </div>

                  </div>

                </div>
              )}


              {/* ==================================================
                  RISK SIGNALS
              ================================================== */}

              <div className="mt-7">

                <div className="mb-3 flex items-center justify-between">

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Detected risk signals
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      These are monitoring flags generated from the
                      provided field and weather inputs.
                    </p>
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {riskCount} signal
                    {riskCount === 1 ? "" : "s"}
                  </span>

                </div>


                {analysis.risks?.length > 0 ? (
                  <div className="grid gap-4">

                    {analysis.risks.map(
                      (risk, index) => (
                        <RiskCard
                          key={`${risk.title}-${index}`}
                          risk={risk}
                        />
                      )
                    )}

                  </div>
                ) : (
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-5">

                    <div className="flex gap-3">

                      <CheckCircle2
                        size={21}
                        className="mt-0.5 text-emerald-700"
                      />

                      <div>

                        <p className="font-bold text-emerald-900">
                          No immediate risk flag was generated
                        </p>

                        <p className="mt-1 text-sm leading-6 text-emerald-800">
                          Continue normal crop monitoring and
                          reassess if field conditions change.
                        </p>

                      </div>

                    </div>

                  </div>
                )}

              </div>


              {/* ==================================================
                  WEATHER CONTEXT
              ================================================== */}

              <div className="mt-7">

                <h3 className="font-bold text-slate-900">
                  Weather context used
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Weather values available to the advisory engine
                  at analysis time.
                </p>

                <WeatherContextCard
                  context={analysis.weatherContext}
                />

              </div>


              {/* ==================================================
                  WHY THIS ADVISORY
              ================================================== */}

              <div className="mt-7 rounded-xl border border-slate-200 bg-slate-50 p-5">

                <div className="flex items-start gap-3">

                  <div className="rounded-lg bg-white p-2 text-slate-700 shadow-sm">
                    <Info size={18} />
                  </div>

                  <div>

                    <h3 className="font-bold text-slate-900">
                      Why this advisory was generated
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      RuralAI Nexus uses the farmer's selected
                      crop, growth stage, irrigation condition,
                      rainfall observation and available weather
                      signals. Individual rules can create one or
                      more monitoring flags.
                    </p>

                  </div>

                </div>


                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                  <ExplainabilityCard
                    label="Crop"
                    value={crop}
                  />

                  <ExplainabilityCard
                    label="Growth stage"
                    value={growthStage}
                  />

                  <ExplainabilityCard
                    label="Irrigation"
                    value={irrigation}
                  />

                  <ExplainabilityCard
                    label="Rainfall"
                    value={rainfall}
                  />

                </div>

              </div>


              {/* ==================================================
                  RESPONSIBLE AI
              ================================================== */}

              <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">

                <div className="flex items-start gap-3">

                  <ShieldCheck
                    size={19}
                    className="mt-0.5 shrink-0 text-blue-700"
                  />

                  <div>

                    <p className="font-bold text-blue-900">
                      Responsible decision support
                    </p>

                    <p className="mt-1 text-sm leading-6 text-blue-800">
                      These signals are not a definitive crop
                      disease diagnosis or pesticide prescription.
                      Inspect the field and consult a qualified
                      agricultural professional when symptoms are
                      serious or uncertain.
                    </p>

                  </div>

                </div>

              </div>


              <p className="mt-4 text-right text-[11px] text-slate-400">
                Advisory generated{" "}
                {analysis.generatedAt
                  ? new Date(
                      analysis.generatedAt
                    ).toLocaleString()
                  : "just now"}
              </p>

            </div>

          </section>
        )}


        {/* ==================================================
            NO ANALYSIS STATE
        ================================================== */}

        {!analysis && (
          <div className="mb-8 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/50 p-6">

            <div className="flex items-start gap-4">

              <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
                <TrendingUp size={21} />
              </div>

              <div>

                <h3 className="font-bold text-emerald-950">
                  Ready for crop condition analysis
                </h3>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-emerald-800">
                  Detect the farm location, review weather and
                  enter the current field condition. RuralAI Nexus
                  will then generate explainable monitoring signals.
                </p>

              </div>

            </div>

          </div>
        )}


        {/* ==================================================
            FOOTER PRINCIPLE
        ================================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-3">

              <div className="rounded-xl bg-slate-100 p-2 text-slate-600">
                <ShieldCheck size={18} />
              </div>

              <div>

                <p className="text-sm font-bold text-slate-800">
                  Farmer-first monitoring
                </p>

                <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
                  RuralAI Nexus supports observation and decision
                  making. It does not replace field inspection or
                  professional agricultural advice.
                </p>

              </div>

            </div>

            <div className="text-xs font-semibold text-slate-400">
              Explainable • Hyper-local • Scenario-aware
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}


// ==========================================================
// JOURNEY STEP
// ==========================================================

function JourneyStep({
  number,
  icon,
  title,
  text,
  active,
}) {
  return (
    <div
      className={`rounded-xl border p-3 backdrop-blur ${
        active
          ? "border-emerald-300/30 bg-white/10"
          : "border-white/10 bg-white/5"
      }`}
    >

      <div className="flex items-center gap-3">

        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
            active
              ? "bg-emerald-400/20 text-emerald-200"
              : "bg-white/10 text-white/60"
          }`}
        >
          {icon}
        </div>

        <div className="min-w-0">

          <div className="flex items-center gap-2">

            <span className="text-[10px] font-bold text-emerald-300">
              {number}
            </span>

            <p className="truncate text-xs font-bold text-white">
              {title}
            </p>

          </div>

          <p className="truncate text-[11px] text-white/50">
            {text}
          </p>

        </div>

      </div>

    </div>
  );
}


// ==========================================================
// SECTION HEADING
// ==========================================================

function SectionHeading({
  icon,
  title,
  description,
}) {
  return (
    <div className="mb-4">

      <div className="flex items-center gap-2">

        <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
          {icon}
        </div>

        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          {title}
        </h2>

      </div>

      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
        {description}
      </p>

    </div>
  );
}


// ==========================================================
// CONTEXT VALUE
// ==========================================================

function ContextValue({
  label,
  value,
}) {
  return (
    <div className="rounded-lg bg-white/70 p-3">

      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-bold text-slate-800">
        {value}
      </p>

    </div>
  );
}


// ==========================================================
// WEATHER OVERVIEW
// ==========================================================

function WeatherOverview({
  weather,
}) {
  const current =
    weather?.current || weather || {};

  const temperature =
    current.temperature ?? null;

  const humidity =
    current.humidity ?? null;

  const rain =
    current.rain ?? null;

  const precipitation =
    current.precipitation ?? null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

      <WeatherMetric
        icon={<Thermometer size={19} />}
        label="Temperature"
        value={
          temperature !== null
            ? `${temperature} °C`
            : "Unavailable"
        }
      />

      <WeatherMetric
        icon={<Droplets size={19} />}
        label="Humidity"
        value={
          humidity !== null
            ? `${humidity}%`
            : "Unavailable"
        }
      />

      <WeatherMetric
        icon={<CloudRain size={19} />}
        label="Rain"
        value={
          rain !== null
            ? `${rain}`
            : "Unavailable"
        }
      />

      <WeatherMetric
        icon={<CloudSun size={19} />}
        label="Precipitation"
        value={
          precipitation !== null
            ? `${precipitation}`
            : "Unavailable"
        }
      />

    </div>
  );
}


// ==========================================================
// WEATHER METRIC
// ==========================================================

function WeatherMetric({
  icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div className="rounded-xl bg-emerald-50 p-2 text-emerald-700">
          {icon}
        </div>

        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Live context
        </span>

      </div>

      <p className="mt-5 text-xs font-semibold text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}


// ==========================================================
// SELECT FIELD
// ==========================================================

function SelectField({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <label className="block">

      <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
        {label}
      </span>

      <select
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>

    </label>
  );
}


// ==========================================================
// SMALL INFO
// ==========================================================

function SmallInfo({
  label,
  value,
}) {
  return (
    <div className="rounded-lg border border-slate-100 bg-white p-3">

      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-800">
        {value}
      </p>

    </div>
  );
}


// ==========================================================
// SNAPSHOT ROW
// ==========================================================

function SnapshotRow({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-3">

      <div className="flex min-w-0 items-center gap-3">

        <div className="text-emerald-300">
          {icon}
        </div>

        <span className="truncate text-xs text-slate-300">
          {label}
        </span>

      </div>

      <span className="shrink-0 text-xs font-bold text-white">
        {value}
      </span>

    </div>
  );
}


// ==========================================================
// RISK CARD
// ==========================================================

function RiskCard({
  risk,
}) {
  const isHigh =
    risk.level === "high";

  const isPest =
    risk.title
      ?.toLowerCase()
      .includes("pest");

  return (
    <div
      className={`rounded-xl border p-4 ${
        isHigh
          ? "border-red-200 bg-red-50"
          : "border-amber-200 bg-amber-50"
      }`}
    >

      <div className="flex items-start gap-3">

        <div
          className={`rounded-lg p-2 ${
            isHigh
              ? "bg-red-100 text-red-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {isPest ? (
            <Bug size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
        </div>

        <div className="min-w-0 flex-1">

          <div className="flex flex-wrap items-center gap-2">

            <h4
              className={`font-bold ${
                isHigh
                  ? "text-red-950"
                  : "text-amber-950"
              }`}
            >
              {risk.title}
            </h4>

            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                isHigh
                  ? "bg-red-100 text-red-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {isHigh
                ? "High priority"
                : "Monitor"}
            </span>

          </div>

          <p
            className={`mt-2 text-sm leading-6 ${
              isHigh
                ? "text-red-800"
                : "text-amber-800"
            }`}
          >
            {risk.reason}
          </p>

        </div>

      </div>

    </div>
  );
}


// ==========================================================
// WEATHER CONTEXT CARD
// ==========================================================

function WeatherContextCard({
  context,
}) {
  if (!context) {
    return null;
  }

  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

      <SmallInfo
        label="Temperature"
        value={
          context.temperature !== null &&
          context.temperature !== undefined
            ? `${context.temperature} °C`
            : "Unavailable"
        }
      />

      <SmallInfo
        label="Humidity"
        value={
          context.humidity !== null &&
          context.humidity !== undefined
            ? `${context.humidity}%`
            : "Unavailable"
        }
      />

      <SmallInfo
        label="Rain"
        value={
          context.rain !== null &&
          context.rain !== undefined
            ? `${context.rain}`
            : "Unavailable"
        }
      />

      <SmallInfo
        label="Precipitation"
        value={
          context.precipitation !== null &&
          context.precipitation !== undefined
            ? `${context.precipitation}`
            : "Unavailable"
        }
      />

    </div>
  );
}


// ==========================================================
// EXPLAINABILITY CARD
// ==========================================================

function ExplainabilityCard({
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">

      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        Input used
      </p>

      <p className="mt-1 text-xs font-semibold text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-800">
        {value}
      </p>

    </div>
  );
}