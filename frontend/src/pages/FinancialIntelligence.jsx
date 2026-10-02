import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Calculator,
  CheckCircle2,
  IndianRupee,
  Landmark,
  Scale,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

const cropOptions = {
  Groundnut: {
    costPerAcre: 18000,
    yieldLow: 700,
    yieldHigh: 1100,
    referencePrice: 60,
  },
  Millets: {
    costPerAcre: 12000,
    yieldLow: 500,
    yieldHigh: 900,
    referencePrice: 35,
  },
  Maize: {
    costPerAcre: 23000,
    yieldLow: 1800,
    yieldHigh: 2800,
    referencePrice: 22,
  },
  Vegetables: {
    costPerAcre: 32000,
    yieldLow: 4000,
    yieldHigh: 8000,
    referencePrice: 25,
  },
};

export default function FinancialIntelligence() {
  const [crop, setCrop] = useState("Groundnut");
  const [landArea, setLandArea] = useState(2);
  const [budget, setBudget] = useState(40000);
  const [reservePercent, setReservePercent] = useState(10);

  const [priceChange, setPriceChange] = useState(0);
  const [yieldChange, setYieldChange] = useState(0);
  const [costChange, setCostChange] = useState(0);

  const data = cropOptions[crop];

  const analysis = useMemo(() => {
    const area = Math.max(0, Number(landArea) || 0);
    const availableBudget = Math.max(0, Number(budget) || 0);
    const reserveRate = Math.max(
      0,
      Number(reservePercent) || 0
    );

    const adjustedPrice =
      data.referencePrice *
      (1 + Number(priceChange) / 100);

    const adjustedLowYield =
      data.yieldLow *
      area *
      (1 + Number(yieldChange) / 100);

    const adjustedHighYield =
      data.yieldHigh *
      area *
      (1 + Number(yieldChange) / 100);

    const adjustedCost =
      data.costPerAcre *
      area *
      (1 + Number(costChange) / 100);

    const reserveAmount =
      adjustedCost * (reserveRate / 100);

    const planningRequirement =
      adjustedCost + reserveAmount;

    const lowRevenue =
      adjustedLowYield * adjustedPrice;

    const highRevenue =
      adjustedHighYield * adjustedPrice;

    const lowNet =
      lowRevenue - adjustedCost;

    const highNet =
      highRevenue - adjustedCost;

    const fundingGap = Math.max(
      0,
      planningRequirement - availableBudget
    );

    const cultivationFundingGap = Math.max(
      0,
      adjustedCost - availableBudget
    );

    const breakEvenPrice =
      adjustedLowYield > 0
        ? adjustedCost / adjustedLowYield
        : 0;

    const roiLow =
      adjustedCost > 0
        ? (lowNet / adjustedCost) * 100
        : 0;

    const roiHigh =
      adjustedCost > 0
        ? (highNet / adjustedCost) * 100
        : 0;

    const capitalCoverage =
      planningRequirement > 0
        ? Math.min(
            100,
            (availableBudget / planningRequirement) * 100
          )
        : 0;

    const priceBuffer =
      adjustedPrice - breakEvenPrice;

    const lowScenarioStatus =
      lowNet >= 0
        ? "Positive under low-yield case"
        : "Negative under low-yield case";

    /*
     * Sensitivity calculations
     *
     * Each scenario starts from the CURRENT adjusted assumptions.
     * This avoids mixing baseline and adjusted values.
     */

    const lowerPriceRevenue =
      adjustedLowYield *
      (adjustedPrice * 0.8);

    const lowerPriceNet =
      lowerPriceRevenue - adjustedCost;

    const lowerYieldRevenue =
      adjustedLowYield *
      0.8 *
      adjustedPrice;

    const lowerYieldNet =
      lowerYieldRevenue - adjustedCost;

    const higherCostNet =
      lowRevenue -
      adjustedCost * 1.2;

    const sensitivity = [
      {
        label: "Lower price",
        value: lowerPriceNet,
        description:
          "Indicative low-case net outcome if the scenario price falls by 20%.",
      },
      {
        label: "Lower yield",
        value: lowerYieldNet,
        description:
          "Indicative low-case net outcome if the low-case yield falls by 20%.",
      },
      {
        label: "Higher cost",
        value: higherCostNet,
        description:
          "Indicative low-case net outcome if cultivation cost rises by 20%.",
      },
    ];

    return {
      adjustedPrice,
      adjustedLowYield,
      adjustedHighYield,
      adjustedCost,
      reserveAmount,
      planningRequirement,
      lowRevenue,
      highRevenue,
      lowNet,
      highNet,
      fundingGap,
      cultivationFundingGap,
      breakEvenPrice,
      roiLow,
      roiHigh,
      capitalCoverage,
      priceBuffer,
      lowScenarioStatus,
      sensitivity,
    };
  }, [
    crop,
    landArea,
    budget,
    reservePercent,
    priceChange,
    yieldChange,
    costChange,
    data,
  ]);

  const pricePosition =
    analysis.priceBuffer >= 0
      ? {
          positive: true,
          text: `${money(
            analysis.priceBuffer
          )}/kg above the calculated break-even reference.`,
        }
      : {
          positive: false,
          text: `${money(
            Math.abs(analysis.priceBuffer)
          )}/kg below the calculated break-even reference.`,
        };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* HERO */}
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 p-6 text-white shadow-xl sm:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
                <IndianRupee size={14} />
                Agriculture → Enterprise → Finance
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Financial Intelligence
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-emerald-50/80 sm:text-base">
                Turn farm assumptions into transparent financial
                scenarios before committing capital.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-200">
                Current planning crop
              </p>

              <p className="mt-2 text-2xl font-bold">
                {crop}
              </p>

              <p className="mt-1 text-sm text-white/70">
                {landArea || 0} acres •{" "}
                {money(
                  data.costPerAcre *
                    (Number(landArea) || 0)
                )}{" "}
                reference cost
              </p>
            </div>
          </div>

          {/* JOURNEY */}
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <JourneyStep
              number="01"
              title="Farm Plan"
              text="Crop + area"
              active
            />

            <JourneyStep
              number="02"
              title="Cost"
              text="Inputs + reserve"
            />

            <JourneyStep
              number="03"
              title="Scenario"
              text="Price + yield"
            />

            <JourneyStep
              number="04"
              title="Decision"
              text="Net + break-even"
            />
          </div>
        </div>

        {/* FARM FINANCIAL PLANNER */}
        <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
          <SectionHeader
            icon={Calculator}
            title="Farm Financial Planner"
            description="Set the basic farm assumptions used by the financial engine."
          />

          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

            <InputField
              label="Crop"
              type="select"
              value={crop}
              onChange={setCrop}
              options={Object.keys(cropOptions)}
            />

            <InputField
              label="Land area (acres)"
              type="number"
              value={landArea}
              min="0"
              step="0.1"
              onChange={setLandArea}
            />

            <InputField
              label="Available budget"
              type="number"
              value={budget}
              min="0"
              prefix="₹"
              onChange={setBudget}
            />

            <InputField
              label="Contingency reserve"
              type="number"
              value={reservePercent}
              min="0"
              step="1"
              suffix="%"
              onChange={setReservePercent}
            />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">

            <SmallPlanningCard
              label="Reference cultivation cost"
              value={money(analysis.adjustedCost)}
              description="Selected crop, land area and cost scenario."
            />

            <SmallPlanningCard
              label="Contingency reserve"
              value={money(analysis.reserveAmount)}
              description={`${reservePercent || 0}% reserve on the adjusted cultivation cost.`}
            />

            <SmallPlanningCard
              label="Total planning requirement"
              value={money(analysis.planningRequirement)}
              description="Cultivation cost plus the selected reserve."
            />
          </div>
        </div>

        {/* SCENARIO LAB */}
        <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
          <SectionHeader
            icon={Scale}
            title="Scenario Lab"
            description="Stress-test price, yield and cultivation-cost assumptions."
          />

          <div className="mt-6 grid gap-6 md:grid-cols-3">

            <ScenarioSlider
              label="Market price change"
              value={priceChange}
              setValue={setPriceChange}
              min={-30}
              max={30}
            />

            <ScenarioSlider
              label="Yield change"
              value={yieldChange}
              setValue={setYieldChange}
              min={-30}
              max={30}
            />

            <ScenarioSlider
              label="Cultivation cost change"
              value={costChange}
              setValue={setCostChange}
              min={-20}
              max={30}
            />
          </div>

          <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900">
            <strong>Active scenario:</strong>{" "}
            {priceChange > 0 ? "+" : ""}
            {priceChange}% price,{" "}
            {yieldChange > 0 ? "+" : ""}
            {yieldChange}% yield,{" "}
            {costChange > 0 ? "+" : ""}
            {costChange}% cost.
          </div>
        </div>

        {/* CAPITAL POSITION */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">

          <MetricCard
            icon={Wallet}
            title="Capital available"
            value={money(budget)}
            description="Capital entered for this planning scenario."
          />

          <MetricCard
            icon={Landmark}
            title="Planning requirement"
            value={money(analysis.planningRequirement)}
            description="Cultivation cost plus the selected contingency reserve."
          />

          <MetricCard
            icon={
              analysis.fundingGap > 0
                ? TrendingDown
                : CheckCircle2
            }
            title={
              analysis.fundingGap > 0
                ? "Funding gap"
                : "Capital coverage"
            }
            value={
              analysis.fundingGap > 0
                ? money(analysis.fundingGap)
                : `${Math.round(
                    analysis.capitalCoverage
                  )}%`
            }
            description={
              analysis.fundingGap > 0
                ? "Additional capital indicated by the current planning assumptions."
                : "Available capital covers the current planning requirement."
            }
          />
        </div>

        {/* REVENUE + NET */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          {/* REVENUE */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">

            <SectionHeader
              icon={TrendingUp}
              title="Revenue Scenario"
              description="Illustrative revenue range based on the adjusted yield and price."
            />

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <ScenarioValue
                label="Low-yield revenue"
                value={money(analysis.lowRevenue)}
              />

              <ScenarioValue
                label="High-yield revenue"
                value={money(analysis.highRevenue)}
              />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <MiniMetric
                label="Low yield"
                value={`${number(
                  analysis.adjustedLowYield
                )} kg`}
              />

              <MiniMetric
                label="High yield"
                value={`${number(
                  analysis.adjustedHighYield
                )} kg`}
              />

              <MiniMetric
                label="Scenario price"
                value={`${money(
                  analysis.adjustedPrice
                )}/kg`}
              />

              <MiniMetric
                label="Reference cost"
                value={money(
                  analysis.adjustedCost
                )}
              />
            </div>
          </div>

          {/* NET OUTCOME */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">

            <SectionHeader
              icon={TrendingUp}
              title="Net Outcome"
              description="Revenue less cultivation cost under the current scenario."
            />

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <ScenarioValue
                label="Low scenario net"
                value={money(analysis.lowNet)}
              />

              <ScenarioValue
                label="High scenario net"
                value={money(analysis.highNet)}
              />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <MiniMetric
                label="Low ROI"
                value={`${analysis.roiLow.toFixed(
                  1
                )}%`}
              />

              <MiniMetric
                label="High ROI"
                value={`${analysis.roiHigh.toFixed(
                  1
                )}%`}
              />
            </div>

            <div
              className={`mt-5 rounded-2xl p-4 ${
                analysis.lowNet >= 0
                  ? "bg-emerald-50 text-emerald-900"
                  : "bg-red-50 text-red-900"
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-wider opacity-70">
                Low-case check
              </p>

              <p className="mt-1 font-semibold">
                {analysis.lowScenarioStatus}
              </p>
            </div>
          </div>
        </div>

        {/* BREAK EVEN + FINANCIAL POSITION */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          {/* BREAK EVEN */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">

            <SectionHeader
              icon={Scale}
              title="Break-Even Reference"
              description="Reference price required to recover cultivation cost under the low-yield scenario."
            />

            <div className="mt-6 rounded-2xl bg-amber-50 p-5">
              <p className="text-sm text-amber-800">
                Break-even price
              </p>

              <p className="mt-1 text-3xl font-bold text-amber-900">
                {money(
                  analysis.breakEvenPrice
                )}
                /kg
              </p>

              <div
                className={`mt-4 rounded-xl p-3 text-sm ${
                  pricePosition.positive
                    ? "bg-emerald-100 text-emerald-900"
                    : "bg-red-100 text-red-900"
                }`}
              >
                Current scenario price is{" "}
                <strong>
                  {pricePosition.text}
                </strong>
              </div>
            </div>
          </div>

          {/* FINANCIAL POSITION */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">

            <SectionHeader
              icon={Wallet}
              title="Financial Position"
              description="Compare the farm's available capital with its planned requirement."
            />

            <div className="mt-6">
              <ProgressRow
                label="Capital coverage"
                value={analysis.capitalCoverage}
              />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <MiniMetric
                label="Cultivation funding gap"
                value={money(
                  analysis.cultivationFundingGap
                )}
              />

              <MiniMetric
                label="Reserve amount"
                value={money(
                  analysis.reserveAmount
                )}
              />
            </div>
          </div>
        </div>

        {/* SENSITIVITY */}
        <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">

          <SectionHeader
            icon={TrendingDown}
            title="Sensitivity Check"
            description="See how simple downside assumptions can change the low-case outcome."
          />

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {analysis.sensitivity.map(
              (scenario) => (
                <div
                  key={scenario.label}
                  className="rounded-2xl border border-gray-200 bg-slate-50 p-5"
                >
                  <p className="text-sm font-semibold text-gray-800">
                    {scenario.label}
                  </p>

                  <p
                    className={`mt-2 text-2xl font-bold ${
                      scenario.value >= 0
                        ? "text-emerald-700"
                        : "text-red-700"
                    }`}
                  >
                    {money(scenario.value)}
                  </p>

                  <p className="mt-2 text-xs leading-5 text-gray-500">
                    {scenario.description}
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        {/* VALUE CHAIN */}
        <div className="mt-6 rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm sm:p-7">

          <SectionHeader
            icon={ArrowRight}
            title="From Farm Economics to Rural Enterprise"
            description="Financial Intelligence is the final planning layer of RuralAI Nexus. The same assumptions can inform cultivation, post-harvest value addition and rural enterprise decisions."
          />

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ValueChainStep
              title="Cultivate"
              text="Cost + yield"
              number="01"
            />

            <ValueChainStep
              title="Harvest"
              text="Loss + usable output"
              number="02"
            />

            <ValueChainStep
              title="FoodTech"
              text="Processing + value addition"
              number="03"
            />

            <ValueChainStep
              title="Enterprise"
              text="Sales + operating scenario"
              number="04"
            />
          </div>
        </div>

        {/* DECISION SUPPORT */}
        <div className="mt-6 rounded-3xl border border-blue-200 bg-blue-50 p-6 sm:p-7">

          <div className="flex items-start gap-3">
            <ShieldCheck
              size={22}
              className="mt-0.5 shrink-0 text-blue-700"
            />

            <div>
              <h2 className="font-semibold text-blue-950">
                Financial Decision Support
              </h2>

              <ul className="mt-3 space-y-2 text-sm leading-6 text-blue-950">
                <li>
                  • Compare revenue and net outcomes instead of relying on a single expected value.
                </li>

                <li>
                  • Check the break-even reference against the scenario price.
                </li>

                <li>
                  • Include a contingency reserve before evaluating capital sufficiency.
                </li>

                <li>
                  • Stress-test price, yield and cost assumptions before committing resources.
                </li>

                <li>
                  • If processing or enterprise activity is planned, include labour, packaging, transport and working capital separately.
                </li>

                <li>
                  • Validate actual local costs, current market prices and buyer demand before financial commitment.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* EXPLAINABILITY */}
        <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">

          <SectionHeader
            icon={Calculator}
            title="How the calculation works"
            description="Every major output is derived from visible assumptions."
          />

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">

            <FormulaCard
              title="Cost"
              formula="Reference cost × land area × cost adjustment"
            />

            <FormulaCard
              title="Revenue"
              formula="Adjusted yield × adjusted price"
            />

            <FormulaCard
              title="Net"
              formula="Scenario revenue − cultivation cost"
            />

            <FormulaCard
              title="Break-even"
              formula="Cultivation cost ÷ low-case yield"
            />
          </div>
        </div>

        {/* RESPONSIBLE USE */}
        <div className="mt-6 flex items-start gap-3 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950 sm:p-6">

          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0"
          />

          <div>
            <p className="font-semibold">
              Responsible financial decision support
            </p>

            <p className="mt-1 leading-6">
              Financial Intelligence uses illustrative reference
              assumptions for cultivation cost, yield and price.
              ROI, revenue, net income, funding gaps and
              break-even figures are scenario calculations,
              not guaranteed returns or investment advice.
              Actual outcomes depend on local prices, weather,
              input costs, yield, labour, transport, market
              access, financing and other operating conditions.
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="py-8 text-center text-xs text-gray-400">
          RuralAI Nexus • Financial Intelligence • Scenario-based decision support
        </div>
      </div>
    </div>
  );
}

function JourneyStep({
  number,
  title,
  text,
  active = false,
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        active
          ? "border-emerald-400/30 bg-emerald-400/10"
          : "border-white/10 bg-white/5"
      }`}
    >
      <p className="text-xs font-bold tracking-widest text-emerald-300">
        {number}
      </p>

      <p className="mt-2 font-semibold text-white">
        {title}
      </p>

      <p className="mt-1 text-xs text-white/60">
        {text}
      </p>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
        <Icon
          size={21}
          className="text-emerald-700"
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          {title}
        </h2>

        <p className="mt-1 text-sm leading-6 text-gray-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function InputField({
  label,
  type = "text",
  value,
  onChange,
  options = [],
  min,
  step,
  prefix,
  suffix,
}) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative mt-2">

        {type === "select" ? (
          <select
            value={value}
            onChange={(e) =>
              onChange(e.target.value)
            }
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
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
        ) : (
          <>
            {prefix && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                {prefix}
              </span>
            )}

            <input
              type={type}
              min={min}
              step={step}
              value={value}
              onChange={(e) =>
                onChange(e.target.value)
              }
              className={`w-full rounded-xl border border-gray-300 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 ${
                prefix
                  ? "pl-9 pr-4"
                  : suffix
                  ? "pl-4 pr-10"
                  : "px-4"
              }`}
            />

            {suffix && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                {suffix}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ScenarioSlider({
  label,
  value,
  setValue,
  min,
  max,
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>

        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-sm font-semibold text-emerald-700">
          {value > 0 ? "+" : ""}
          {value}%
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) =>
          setValue(Number(e.target.value))
        }
        className="mt-4 w-full accent-emerald-600"
      />

      <div className="mt-1 flex justify-between text-xs text-gray-400">
        <span>
          {min > 0 ? "+" : ""}
          {min}%
        </span>

        <span>
          {max > 0 ? "+" : ""}
          {max}%
        </span>
      </div>
    </div>
  );
}

function SmallPlanningCard({
  label,
  value,
  description,
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-gray-900">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-gray-500">
        {description}
      </p>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  title,
  value,
  description,
}) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
          <Icon
            size={21}
            className="text-emerald-700"
          />
        </div>

        <div className="min-w-0">
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900">
            {value}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-gray-500">
        {description}
      </p>
    </div>
  );
}

function ScenarioValue({
  label,
  value,
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5">
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
}

function MiniMetric({
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-slate-50 p-3">
      <p className="text-xs text-gray-400">
        {label}
      </p>

      <p className="mt-1 font-semibold text-gray-800">
        {value}
      </p>
    </div>
  );
}

function ProgressRow({
  label,
  value,
}) {
  const safeValue = Math.max(
    0,
    Math.min(100, Number(value) || 0)
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">
          {label}
        </p>

        <p className="text-sm font-bold text-emerald-700">
          {Math.round(safeValue)}%
        </p>
      </div>

      <div className="mt-3 h-3 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-emerald-600 transition-all"
          style={{
            width: `${safeValue}%`,
          }}
        />
      </div>
    </div>
  );
}

function ValueChainStep({
  number,
  title,
  text,
}) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold tracking-widest text-emerald-600">
          {number}
        </span>

        <ArrowRight
          size={17}
          className="text-emerald-400"
        />
      </div>

      <p className="mt-4 font-semibold text-gray-900">
        {title}
      </p>

      <p className="mt-1 text-sm text-gray-500">
        {text}
      </p>
    </div>
  );
}

function FormulaCard({
  title,
  formula,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-slate-50 p-5">
      <p className="text-sm font-semibold text-gray-900">
        {title}
      </p>

      <p className="mt-3 text-sm leading-6 text-gray-600">
        {formula}
      </p>
    </div>
  );
}

function money(value) {
  return `₹${Math.round(
    Number(value) || 0
  ).toLocaleString("en-IN")}`;
}

function number(value) {
  return Math.round(
    Number(value) || 0
  ).toLocaleString("en-IN");
}