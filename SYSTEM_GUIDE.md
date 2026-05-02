# ECOSPHERE | DEFINITIVE SYSTEM & DIAGNOSTIC MANUAL

This manual provides an exhaustive, granular breakdown of every module, widget, and sub-section within the Ecosphere Forensic Engine. It covers both the **Diagnostic Purpose** (UI) and the **Logic / System Action** (Backend/Interactivity).

---

## 🏛️ 1. MACRO ANALYTICS (GLOBAL DIAGNOSTICS)
*Objective: Systemic mapping of the industrial fashion lifecycle.*

| Section | Sub-Section / Widget | Diagnostic Purpose | Logic / System Action |
| :--- | :--- | :--- | :--- |
| **Global Modifier** | **Reality Check Switch** | Exposes conglomerate dominance vs factory count. | **Dynamic Dataset Swap**: Toggles between `entity_mode` and `volume_mode` in the state engine. |
| | **Policy Simulator** | Visualizes the impact of cleaning the "Worst 10%". | **Capping Algorithm**: Linearly pulls the 10th decile toward the median and recalculates industry-wide saved emissions. |
| **Executive Briefing** | **Intervention Level** | Shows the intensity of policy enforcement simulated (0-100%). | **State Sync**: Reflects the `interventionLevel` state from the simulator. |
| | **Saved Emissions** | Quantifies the physical CO2 reduction. | **Volume Math**: Calculates the difference between the current and simulated industry footprint. |
| | **Top Share Delta** | Tracks the shift in market concentration. | **Market Concentration Audit**: Recalculates the top-decile share based on simulated values. |
| | **New Gini Coefficient** | Measures the reduction in damage inequality. | **Simulated Lorentz Curve**: Dynamically updates the Gini coefficient based on simulation factors. |
| | **Equivalence in Deciles** | Translates data into human terms. | **Aggregated Equivalence**: Counts how many bottom deciles equal the damage of the top decile. |
| **KPI Ribbon** | **System Imbalance** | Measures industry-wide damage inequality. | **Gini Calculation**: Uses a Lorentz-curve derivative to quantify damage concentration. |
| | **Top 10% Cause** | The footprint share of the worst producers. | **Decile Summation**: Aggregates the total footprint of the top 10% of producers vs the total industry. |
| | **Typical Factory Score** | The "Industry Baseline" median performance. | **Median Aggregation**: Calculates the D5 (Median) value of the entire 20,229-brand dataset. |
| **Industry Gap** | **Pollution Map** | A cumulative damage chart showing the "Hockey Stick". | **ECharts Integration**: Maps the cumulative sum of deciles to show the non-linear damage curve. |
| | **Critical Concentration** | Annotation highlighting where carbon production outpaces all others. | **Point-of-Inflection Trigger**: Identifies the decile where the derivative of the curve exceeds the mean. |
| **Causality Bridge** | **Impact Drivers** | Identifies root physical factors (Carbon, Water, etc). | **Normalization Engine**: Rescales all metrics to a 0-100% contribution scale for comparison. |
| **Systemic Outliers** | **The Vanguard / Risks** | Identifies extreme leaders and laggards. | **Standard Deviation Mapping**: Selects entities with the highest +/- deviation from the 20k-entity median. |
| | **Impact DNA Progress** | A bullet-chart showing exact deviation. | **Linear Deviation Gauge**: Renders the item's score relative to the planetary median. |

---

## 🏢 2. BRAND AUDIT HUB (CORPORATE FORENSICS)
*Objective: Unmasking corporate ESG claims through biophysical auditing.*

| Section | Sub-Section / Widget | Diagnostic Purpose | Logic / System Action |
| :--- | :--- | :--- | :--- |
| **Cognitive Translation** | **The Verdict (Waterfall)** | Shows how the final score is reached. | **Multiplicative Penalty**: Multiplies the theoretical ESG score by the survival coefficient (min Phi). |
| | **Weakest Link Isolator** | Identifies the single worst breach. | **Min-Function Trigger**: Scans all planetary metrics and isolates the lowest survival value. |
| | **The Threshold Trigger** | Shows the mathematical "cliff" of a brand. | **Logistic Curve Mapping**: Plots the brand on a sigmoid function to show proximity to the hard boundary. |
| | **The Earth Tax Receipt** | Physical reality check (Pools/Cars). | **Unit Conversion**: Translates MT of Carbon and Liters of Water into real-world physical metaphors. |
| | **Greenwash Gap** | Quantifies marketing vs reality dissonance. | **Dissonance Math**: `Transparency Score - Audited Score`. Higher gaps indicate higher regulatory risk. |
| | **Efficiency vs. Volume** | Proves mass production kills efficiency. | **Absolute Impact Formula**: `(Micro-Efficiency * Total Units)`. Shows how volume overrides per-garment gains. |
| | **Material Debt Correlation** | Maps the link between Virgin materials and Waste. | **Correlation Matrix**: Correlates material input percentages with downstream solid waste volume. |
| **Extrapolations** | **Boundary Deficit** | Exact tonnage/liters needed to reach "Safe Zone". | **Deficit Calculation**: `Current Intensity - Threshold (150 MT / 800k L)`. |
| | **Planetary Budget Share** | Revenue Share vs Extraction Share. | **Industry Ratio Audit**: Compares the brand's share of global revenue against its share of "Safe Water Capacity." |
| | **Global Doomsday Scale** | Result if the entire industry followed this brand. | **Hypothetical Extrapolation**: Multiplies the brand's intensity by the $1.5 Trillion global industry market size. |

---

## 🧬 3. PRODUCT FORENSIC HUB (MATERIAL INTEGRITY)
*Objective: Item-level forensics and production shift simulation.*

| Section | Sub-Section / Widget | Diagnostic Purpose | Logic / System Action |
| :--- | :--- | :--- | :--- |
| **Product DNA** | **Parallel Coordinates** | High-dimensional mapping of an item. | **Multi-Axis Scaling**: Connects 5 independent data points into a single "Signature" curve. |
| **Comparison Cards** | **Forensic Edge** | Side-by-side metric comparison. | **1-Decimal Precision**: Rounds all comparison values to ensure clarity and professional accuracy. |
| **Shift Simulator** | **Carbon/Water Delta** | Calculates savings of shifting production. | **Linear Extrapolation**: Subtracts `Item A` footprint from `Item B` and multiplies by the simulated volume. |
| **Audit Narrative** | **Cursive Takeaways** | Large-font insights for rapid interpretation. | **Dynamic NLP Rendering**: Generates qualitative summaries based on the statistical results of the comparison. |

---

## 🧪 4. EXPLAINABILITY ENGINE (LOGIC CORE)
*Focus: Mathematical proof and forensic methodology.*

| Section | Sub-Section / Widget | Diagnostic Purpose | Logic / System Action |
| :--- | :--- | :--- | :--- |
| **Model Intel** | **Penalty Severity (γ)** | Variable control for penalty enforcement. | **Gamma Modifier**: Adjusts the steepness of the logistic penalty curve in real-time. |
| | **Weight Balance (α vs β)** | Ratio between AHP and Entropy. | **Hybrid Weighting**: A linear combination of subjective expert input and objective data variance. |
| | **Optimization Meta** | Tracking AHP Consistency and Pareto Optimality. | **Validation Loop**: Runs real-time checks on the consistency ratio (CR) to ensure expert judgment isn't noisy. |
| **Methodology** | **Hybrid Weighting Card** | Combines subjective values with objective density. | **Formula Display**: Visualizes the `Wk = alpha*Ws + beta*Wo` logic for user transparency. |
| | **Entropy (Objective)** | Weights indicators by information density. | **Information Gain Logic**: Automatically assigns higher weights to indicators with higher statistical variance. |
| | **AHP (Subjective)** | Expert-led prioritization. | **Eigenvalue Calculation**: Normalizes pairwise comparison matrices to define corporate value priorities. |
| **Statistical Proof** | **Mann-Whitney U Result** | Proves the result is statistically significant. | **Non-Parametric Test**: Compares the distribution of audited scores against the baseline industry dataset. |
| | **Monte Carlo Stability** | The stability index of the result. | **Recursive Simulation**: Runs the scoring algorithm 10,000 times with random noise to ensure stability. |
| | **Iteration Verification** | Shield-check for the 10,000-cycle audit. | **Compute Log Verification**: Confirms the completion of the Monte Carlo stress-test. |
| **Scoring Logic** | **The Reality Gap** | Maps the "Abyss" of traditional indices. | **Scatter Map**: Correlates traditional WAM scores (X) against Audited Result (Y) to find decoupling. |
| | **Forensic Penalty** | The % adjustment applied to the score. | **Adjustment Math**: `1 - min(Penalty Coefficients)`. Shows the absolute deduction due to breaches. |
| **Forensic Case Study** | **The Nike Paradox** | Demonstrates the Non-Compensatory rule. | **Case-Study Rendering**: Injects live FY2023 Nike data into the validation engine for a live audit. |

---
**Protocol**: *Scientific Luxury | Forensic Integrity Hub v2.0*
