import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Boxes,
  Calculator,
  CheckCircle2,
  IndianRupee,
  Package,
  ShoppingBag,
  ShieldCheck,
  Sprout,
  TrendingUp,
  Truck,
  Factory,
  Scale,
  ClipboardCheck,
} from "lucide-react";

const cropData = {
  Groundnut: {
    category: "Oilseed",
    shelfLife: "4–6 months",
    storage: [
      "Dry the produce properly before storage",
      "Use clean and dry storage containers",
      "Protect from excess moisture",
      "Monitor for insects and fungal growth",
    ],
    products: [
      "Raw Groundnut",
      "Roasted Groundnut",
      "Groundnut Oil",
      "Peanut Butter",
    ],
    referencePrice: 60,
    valueAddedPrice: 110,
    wastage: 5,
  },

  Millets: {
    category: "Cereal",
    shelfLife: "6–12 months",
    storage: [
      "Dry grain to a suitable storage moisture level",
      "Use clean airtight containers",
      "Protect from insects",
      "Keep storage area dry and ventilated",
    ],
    products: [
      "Whole Millet",
      "Millet Flour",
      "Millet Breakfast Mix",
      "Millet Snacks",
    ],
    referencePrice: 35,
    valueAddedPrice: 70,
    wastage: 4,
  },

  Maize: {
    category: "Cereal",
    shelfLife: "4–8 months",
    storage: [
      "Dry grain thoroughly before storage",
      "Protect from moisture",
      "Inspect regularly for insects",
      "Use appropriate food or feed-grade storage",
    ],
    products: [
      "Maize Grain",
      "Maize Flour",
      "Corn Snack",
      "Animal Feed",
    ],
    referencePrice: 22,
    valueAddedPrice: 45,
    wastage: 5,
  },

  Vegetables: {
    category: "Horticulture",
    shelfLife: "Short shelf life",
    storage: [
      "Sort damaged produce immediately",
      "Keep harvested produce shaded",
      "Use suitable crates for transport",
      "Minimize handling and transport delays",
    ],
    products: [
      "Fresh Vegetables",
      "Dehydrated Vegetables",
      "Pickle",
      "Vegetable Sauce",
    ],
    referencePrice: 25,
    valueAddedPrice: 55,
    wastage: 12,
  },
};

export default function PostHarvest() {
  const [crop, setCrop] = useState("Groundnut");
  const [quantity, setQuantity] = useState(1000);
  const [processingPercent, setProcessingPercent] =
    useState(30);

  const [processingCost, setProcessingCost] =
    useState(5000);

  const [packagingCost, setPackagingCost] =
    useState(2500);

  const [transportCost, setTransportCost] =
    useState(2000);

  const [labourCost, setLabourCost] =
    useState(2500);

  const [storageDecision, setStorageDecision] =
    useState("Process part of produce");

  const data = cropData[crop];

  // --------------------------------------------------
  // ANALYSIS
  // --------------------------------------------------

  const analysis = useMemo(() => {
    const qty = Math.max(
      0,
      Number(quantity) || 0
    );

    const processing =
      Math.min(
        100,
        Math.max(
          0,
          Number(processingPercent) || 0
        )
      );

    const estimatedLoss =
      qty * (data.wastage / 100);

    const usableQuantity =
      Math.max(
        0,
        qty - estimatedLoss
      );

    const processedQuantity =
      usableQuantity * (processing / 100);

    const rawQuantity =
      usableQuantity - processedQuantity;

    const rawRevenue =
      usableQuantity *
      data.referencePrice;

    const valueAddedRevenue =
      processedQuantity *
        data.valueAddedPrice +
      rawQuantity *
        data.referencePrice;

    const additionalValue =
      valueAddedRevenue -
      rawRevenue;

    const totalProcessingCosts =
      Math.max(0, Number(processingCost) || 0) +
      Math.max(0, Number(packagingCost) || 0) +
      Math.max(0, Number(transportCost) || 0) +
      Math.max(0, Number(labourCost) || 0);

    const estimatedNetValue =
      valueAddedRevenue -
      totalProcessingCosts;

    const rawScenarioNet =
      rawRevenue -
      Math.max(0, Number(transportCost) || 0);

    const incrementalContribution =
      estimatedNetValue -
      rawScenarioNet;

    const processingValueGenerated =
      processedQuantity *
      data.valueAddedPrice;

    const processingBreakEvenPrice =
      processedQuantity > 0
        ? (
            data.referencePrice +
            totalProcessingCosts /
              processedQuantity
          )
        : 0;

    return {
      estimatedLoss,
      usableQuantity,
      processedQuantity,
      rawQuantity,
      rawRevenue,
      valueAddedRevenue,
      additionalValue,
      totalProcessingCosts,
      estimatedNetValue,
      rawScenarioNet,
      incrementalContribution,
      processingValueGenerated,
      processingBreakEvenPrice,
    };
  }, [
    crop,
    quantity,
    processingPercent,
    processingCost,
    packagingCost,
    transportCost,
    labourCost,
    data,
  ]);

  // --------------------------------------------------
  // FORMAT
  // --------------------------------------------------

  const formatKg = (value) =>
    `${Math.round(
      value
    ).toLocaleString("en-IN")} kg`;

  const formatRupee = (value) =>
    `₹${Math.round(
      value
    ).toLocaleString("en-IN")}`;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ==================================================
          HERO
      ================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-orange-950 via-orange-900 to-amber-900 text-white">

        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-300/10 blur-3xl" />

        <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-amber-300/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-orange-100">
            <Package size={14} />
            Agriculture → FoodTech → Rural Enterprise
          </div>

          <div className="mt-5 max-w-3xl">

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Post-Harvest Intelligence
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-orange-50/80 sm:text-base">
              Reduce avoidable post-harvest losses, compare
              storage and processing pathways, and understand
              the financial assumptions behind value-addition
              scenarios.
            </p>

          </div>

          {/* Journey */}

          <div className="mt-8 grid gap-3 sm:grid-cols-5">

            <JourneyStep
              number="01"
              icon={<Sprout size={17} />}
              title="Harvest"
              text="Quantity"
            />

            <JourneyStep
              number="02"
              icon={<Scale size={17} />}
              title="Loss"
              text="Usable produce"
            />

            <JourneyStep
              number="03"
              icon={<Boxes size={17} />}
              title="Storage"
              text="Handling"
            />

            <JourneyStep
              number="04"
              icon={<Factory size={17} />}
              title="FoodTech"
              text="Processing"
            />

            <JourneyStep
              number="05"
              icon={<TrendingUp size={17} />}
              title="Market"
              text="Scenario value"
            />

          </div>

        </div>
      </section>


      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">


        {/* ==================================================
            HARVEST INPUT
        ================================================== */}

        <section>

          <SectionHeading
            icon={<Calculator size={19} />}
            title="1. Harvest Planning"
            description="Start with the expected harvest quantity and decide how much produce may be stored, sold raw or routed toward value addition."
          />

          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="grid gap-5 sm:grid-cols-2">

                <SelectField
                  label="Crop"
                  value={crop}
                  onChange={(event) =>
                    setCrop(event.target.value)
                  }
                  options={Object.keys(cropData)}
                />

                <InputField
                  label="Expected harvest quantity"
                  suffix="kg"
                  type="number"
                  min="0"
                  value={quantity}
                  onChange={(event) =>
                    setQuantity(
                      event.target.value
                    )
                  }
                />

                <SelectField
                  label="Quantity for value addition"
                  value={processingPercent}
                  onChange={(event) =>
                    setProcessingPercent(
                      Number(event.target.value)
                    )
                  }
                  options={[
                    0,
                    25,
                    30,
                    50,
                    75,
                    100,
                  ]}
                  optionLabel={(value) =>
                    value === 0
                      ? "0% — Sell raw"
                      : `${value}%`
                  }
                />

                <SelectField
                  label="Post-harvest pathway"
                  value={storageDecision}
                  onChange={(event) =>
                    setStorageDecision(
                      event.target.value
                    )
                  }
                  options={[
                    "Process part of produce",
                    "Sell mostly raw",
                    "Store before sale",
                    "Process all usable produce",
                  ]}
                />

              </div>

            </div>


            {/* Reference */}

            <div className="rounded-2xl bg-slate-900 p-5 text-white">

              <p className="text-xs font-semibold uppercase tracking-wider text-orange-300">
                Crop reference
              </p>

              <h3 className="mt-2 text-2xl font-bold">
                {crop}
              </h3>

              <p className="mt-1 text-sm text-slate-300">
                {data.category}
              </p>

              <div className="mt-5 space-y-3">

                <DarkMetric
                  label="Reference shelf life"
                  value={data.shelfLife}
                />

                <DarkMetric
                  label="Raw reference price"
                  value={formatRupee(
                    data.referencePrice
                  ) + "/kg"}
                />

                <DarkMetric
                  label="Value-added reference"
                  value={formatRupee(
                    data.valueAddedPrice
                  ) + "/kg"}
                />

              </div>

              <p className="mt-5 text-[11px] leading-5 text-slate-400">
                Reference values are illustrative and
                should not be treated as live mandi or
                guaranteed selling prices.
              </p>

            </div>

          </div>

        </section>


        {/* ==================================================
            LOSS SNAPSHOT
        ================================================== */}

        <section className="mt-8">

          <SectionHeading
            icon={<Boxes size={19} />}
            title="2. Post-Harvest Loss Snapshot"
            description="Estimate how much produce remains after the crop-specific reference loss assumption."
          />

          <div className="grid gap-4 md:grid-cols-3">

            <ResultCard
              icon={AlertCircle}
              title="Reference harvest loss"
              value={formatKg(
                analysis.estimatedLoss
              )}
              description={`${data.wastage}% illustrative loss assumption for ${crop}.`}
              tone="amber"
            />

            <ResultCard
              icon={Package}
              title="Estimated usable produce"
              value={formatKg(
                analysis.usableQuantity
              )}
              description="Quantity remaining after the reference loss assumption."
              tone="green"
            />

            <ResultCard
              icon={ShoppingBag}
              title="Allocated for processing"
              value={formatKg(
                analysis.processedQuantity
              )}
              description={`${processingPercent}% of estimated usable produce routed to value addition.`}
              tone="orange"
            />

          </div>

        </section>


        {/* ==================================================
            STORAGE
        ================================================== */}

        <section className="mt-8">

          <SectionHeading
            icon={<Boxes size={19} />}
            title="3. Storage & Handling"
            description="Use crop-specific handling guidance before deciding whether produce should be stored or processed."
          />

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="grid gap-6 lg:grid-cols-[1fr_300px]">

              <div>

                <div className="flex items-center gap-3">

                  <div className="rounded-xl bg-orange-100 p-2 text-orange-700">
                    <ClipboardCheck size={19} />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      {crop} storage checklist
                    </h3>

                    <p className="text-xs text-slate-500">
                      Reference handling actions
                    </p>
                  </div>

                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">

                  {data.storage.map(
                    (item) => (
                      <div
                        key={item}
                        className="flex items-start gap-3 rounded-xl bg-slate-50 p-4"
                      >

                        <CheckCircle2
                          size={18}
                          className="mt-0.5 shrink-0 text-emerald-600"
                        />

                        <span className="text-sm leading-6 text-slate-700">
                          {item}
                        </span>

                      </div>
                    )
                  )}

                </div>

              </div>


              <div className="rounded-xl border border-orange-100 bg-orange-50 p-5">

                <p className="text-xs font-bold uppercase tracking-wider text-orange-700">
                  Storage reference
                </p>

                <p className="mt-3 text-2xl font-bold text-orange-950">
                  {data.shelfLife}
                </p>

                <p className="mt-2 text-sm leading-6 text-orange-800">
                  This is a reference range, not a guarantee
                  of storage life. Actual shelf life depends
                  on moisture, temperature, pests, packaging,
                  handling and storage conditions.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* ==================================================
            FOODTECH PATHWAY
        ================================================== */}

        <section className="mt-8">

          <SectionHeading
            icon={<Factory size={19} />}
            title="4. FoodTech Value-Addition Pathway"
            description="Explore products that can potentially move part of the harvest from raw agricultural output toward processed or packaged products."
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {data.products.map(
              (product, index) => (
                <ProductCard
                  key={product}
                  product={product}
                  index={index}
                />
              )
            )}

          </div>

        </section>


        {/* ==================================================
            COST INPUTS
        ================================================== */}

        <section className="mt-8">

          <SectionHeading
            icon={<IndianRupee size={19} />}
            title="5. Processing Economics"
            description="Enter your own expected costs so the value-addition scenario considers more than selling price alone."
          />

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              <InputField
                label="Processing cost"
                prefix="₹"
                type="number"
                min="0"
                value={processingCost}
                onChange={(event) =>
                  setProcessingCost(
                    event.target.value
                  )
                }
              />

              <InputField
                label="Packaging cost"
                prefix="₹"
                type="number"
                min="0"
                value={packagingCost}
                onChange={(event) =>
                  setPackagingCost(
                    event.target.value
                  )
                }
              />

              <InputField
                label="Transport cost"
                prefix="₹"
                type="number"
                min="0"
                value={transportCost}
                onChange={(event) =>
                  setTransportCost(
                    event.target.value
                  )
                }
              />

              <InputField
                label="Labour cost"
                prefix="₹"
                type="number"
                min="0"
                value={labourCost}
                onChange={(event) =>
                  setLabourCost(
                    event.target.value
                  )
                }
              />

            </div>

            <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">

              <div className="flex items-start gap-3">

                <InfoIcon />

                <div>
                  <p className="font-semibold text-blue-900">
                    Why these inputs matter
                  </p>

                  <p className="mt-1 text-sm leading-6 text-blue-800">
                    A higher selling price does not automatically
                    mean higher profitability. RuralAI Nexus
                    subtracts the costs you enter before showing
                    the illustrative net scenario.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ==================================================
            FINANCIAL SCENARIO
        ================================================== */}

        <section className="mt-8">

          <SectionHeading
            icon={<TrendingUp size={19} />}
            title="6. Value-Addition Financial Scenario"
            description="Compare raw sale with the illustrative value-added pathway using the reference prices and your entered costs."
          />

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

              <MetricCard
                label="Raw-sale scenario"
                value={formatRupee(
                  analysis.rawRevenue
                )}
              />

              <MetricCard
                label="Value-added revenue"
                value={formatRupee(
                  analysis.valueAddedRevenue
                )}
              />

              <MetricCard
                label="Entered processing costs"
                value={formatRupee(
                  analysis.totalProcessingCosts
                )}
              />

              <MetricCard
                label="Illustrative net value"
                value={formatRupee(
                  analysis.estimatedNetValue
                )}
              />

            </div>


            <div className="mt-6 grid gap-4 lg:grid-cols-3">

              <ScenarioPanel
                title="Value generated"
                value={formatRupee(
                  analysis.additionalValue
                )}
                description="Difference between the raw-sale reference scenario and the value-added revenue scenario."
              />

              <ScenarioPanel
                title="Incremental contribution"
                value={formatRupee(
                  analysis.incrementalContribution
                )}
                description="Illustrative difference after the costs entered above and the raw-sale transport assumption."
              />

              <ScenarioPanel
                title="Processing break-even reference"
                value={
                  analysis.processedQuantity > 0
                    ? `${formatRupee(
                        analysis.processingBreakEvenPrice
                      )}/kg`
                    : "N/A"
                }
                description="Approximate processed-output price needed to cover the entered costs above the raw reference price."
              />

            </div>


            <div
              className={`mt-6 rounded-xl p-4 ${
                analysis.incrementalContribution >= 0
                  ? "bg-emerald-50 text-emerald-900"
                  : "bg-amber-50 text-amber-900"
              }`}
            >

              <div className="flex items-start gap-3">

                <Scale
                  size={19}
                  className="mt-0.5 shrink-0"
                />

                <div>

                  <p className="font-bold">
                    Scenario interpretation
                  </p>

                  <p className="mt-1 text-sm leading-6">
                    {analysis.incrementalContribution >= 0
                      ? "Under the entered assumptions, the illustrative value-added pathway produces a positive incremental contribution compared with the simplified raw-sale comparison."
                      : "Under the entered assumptions, the illustrative value-added pathway does not produce a positive incremental contribution compared with the simplified raw-sale comparison."}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ==================================================
            WORKFLOW
        ================================================== */}

        <section className="mt-8">

          <SectionHeading
            icon={<ArrowRight size={19} />}
            title="7. Recommended Post-Harvest Workflow"
            description="A simple workflow connecting agricultural output with food processing and rural enterprise decisions."
          />

          <div className="grid gap-4 md:grid-cols-5">

            {[
              {
                title: "Harvest",
                text: "Record quantity",
                icon: Sprout,
              },
              {
                title: "Sort & Grade",
                text: "Separate damaged produce",
                icon: Scale,
              },
              {
                title: "Dry / Store",
                text: "Protect quality",
                icon: Boxes,
              },
              {
                title: "Process",
                text: "Explore value addition",
                icon: Factory,
              },
              {
                title: "Market",
                text: "Compare scenarios",
                icon: TrendingUp,
              },
            ].map(
              (step, index) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.title}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >

                    <div className="flex items-center justify-between">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                        <Icon size={18} />
                      </div>

                      <span className="text-xs font-bold text-slate-300">
                        0{index + 1}
                      </span>

                    </div>

                    <h3 className="mt-5 font-bold text-slate-900">
                      {step.title}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {step.text}
                    </p>

                  </div>
                );
              }
            )}

          </div>

        </section>


        {/* ==================================================
            RESPONSIBLE AI
        ================================================== */}

        <section className="mt-8">

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">

            <div className="flex items-start gap-3">

              <ShieldCheck
                size={20}
                className="mt-0.5 shrink-0 text-amber-700"
              />

              <div>

                <p className="font-bold text-amber-950">
                  Responsible decision support
                </p>

                <p className="mt-1 text-sm leading-6 text-amber-900">

                  All prices, loss percentages and value-addition
                  calculations shown here are illustrative reference
                  scenarios. Actual results depend on crop quality,
                  moisture, processing recovery, equipment, labour,
                  packaging, transport, food-safety requirements,
                  buyer demand and local market conditions.

                  {" "}

                  The financial figures are not guarantees of
                  profitability and should be validated before
                  investment decisions.

                </p>

              </div>

            </div>

          </div>

        </section>


        {/* ==================================================
            FOOTER
        ================================================== */}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-slate-100 p-2 text-slate-600">
                <Truck size={18} />
              </div>

              <div>

                <p className="text-sm font-bold text-slate-800">
                  From farm output to rural enterprise
                </p>

                <p className="text-xs text-slate-500">
                  Plan storage, processing, logistics and
                  market scenarios from one workflow.
                </p>

              </div>

            </div>

            <div className="text-xs font-semibold text-slate-400">
              Agriculture • FoodTech • Financial Intelligence
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
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur">

      <div className="flex items-center gap-3">

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-400/15 text-orange-200">
          {icon}
        </div>

        <div className="min-w-0">

          <div className="flex items-center gap-2">

            <span className="text-[10px] font-bold text-orange-300">
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

        <div className="rounded-lg bg-orange-100 p-2 text-orange-700">
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
// SELECT
// ==========================================================

function SelectField({
  label,
  value,
  onChange,
  options,
  optionLabel,
}) {
  return (
    <label className="block">

      <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
        {label}
      </span>

      <select
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
      >

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {optionLabel
              ? optionLabel(option)
              : option}
          </option>
        ))}

      </select>

    </label>
  );
}


// ==========================================================
// INPUT
// ==========================================================

function InputField({
  label,
  value,
  onChange,
  type = "text",
  min,
  prefix,
  suffix,
}) {
  return (
    <label className="block">

      <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
        {label}
      </span>

      <div className="relative">

        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
            {prefix}
          </span>
        )}

        <input
          type={type}
          min={min}
          value={value}
          onChange={onChange}
          className={`w-full rounded-xl border border-slate-200 bg-white py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 ${
            prefix
              ? "pl-9 pr-4"
              : suffix
              ? "pl-4 pr-12"
              : "px-4"
          }`}
        />

        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
            {suffix}
          </span>
        )}

      </div>

    </label>
  );
}


// ==========================================================
// DARK METRIC
// ==========================================================

function DarkMetric({
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">

      <p className="text-[10px] uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-white">
        {value}
      </p>

    </div>
  );
}


// ==========================================================
// RESULT CARD
// ==========================================================

function ResultCard({
  icon: Icon,
  title,
  value,
  description,
  tone,
}) {
  const toneClasses = {
    amber:
      "bg-amber-100 text-amber-700",
    green:
      "bg-emerald-100 text-emerald-700",
    orange:
      "bg-orange-100 text-orange-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center gap-3">

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
            toneClasses[tone]
          }`}
        >
          <Icon size={21} />
        </div>

        <div className="min-w-0">

          <p className="text-xs font-semibold text-slate-500">
            {title}
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {value}
          </p>

        </div>

      </div>

      <p className="mt-4 text-xs leading-5 text-slate-500">
        {description}
      </p>

    </div>
  );
}


// ==========================================================
// PRODUCT CARD
// ==========================================================

function ProductCard({
  product,
  index,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-center justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
          <Factory size={18} />
        </div>

        <span className="text-xs font-bold text-slate-300">
          0{index + 1}
        </span>

      </div>

      <h3 className="mt-5 font-bold text-slate-900">
        {product}
      </h3>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        Potential value-addition pathway to explore
        based on local capability, food-safety requirements
        and buyer demand.
      </p>

    </div>
  );
}


// ==========================================================
// METRIC CARD
// ==========================================================

function MetricCard({
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-xl font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}


// ==========================================================
// SCENARIO PANEL
// ==========================================================

function ScenarioPanel({
  title,
  value,
  description,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">

      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>

    </div>
  );
}


// ==========================================================
// INFO ICON
// ==========================================================

function InfoIcon() {
  return (
    <div className="rounded-lg bg-white p-2 text-blue-700 shadow-sm">
      <AlertCircle size={18} />
    </div>
  );
}