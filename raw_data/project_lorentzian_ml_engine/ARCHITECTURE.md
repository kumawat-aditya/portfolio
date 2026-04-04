# Architecture

> Generated: April 3, 2026 | Version: 2.1.0 (Python), 3.0 (MQL5)

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Architecture Diagram](#2-architecture-diagram)
3. [Data Flow Diagram](#3-data-flow-diagram)
4. [Three-Phase Processing Model](#4-three-phase-processing-model)
5. [Data Structures / Models](#5-data-structures--models)
6. [Component Reference](#6-component-reference)
7. [Key Design Patterns](#7-key-design-patterns)
8. [Lorentzian KNN Algorithm](#8-lorentzian-knn-algorithm)
9. [Kernel Regression](#9-kernel-regression)
10. [Filter Pipeline](#10-filter-pipeline)
11. [Signal Generation Logic](#11-signal-generation-logic)
12. [Extension & Configuration Guide](#12-extension--configuration-guide)

---

## 1. System Overview

This repository contains **three parallel implementations** of the same trading strategy:

| Implementation     | Language       | Role                                                                         |
| ------------------ | -------------- | ---------------------------------------------------------------------------- |
| **Pine Script**    | Pine Script v5 | Original reference indicator (TradingView)                                   |
| **MQL5 Indicator** | MQL5           | Live signal indicator for MetaTrader 5 (visual + alerts, no order execution) |
| **Python Library** | Python 3       | Reusable library; backtesting, automation, algorithmic trading bots          |

The Python implementation is the primary engine for programmatic use. It accepts OHLCV candles from any source (the included test script uses **Delta Exchange** via REST API). The MQL5 indicator renders the same signals and kernel regression lines directly on an MT5 chart.

There is **no shared runtime communication** between the three implementations — they are independently deployable ports of the same mathematical algorithm.

---

## 2. Architecture Diagram

```mermaid
graph TB
    subgraph Pine ["Pine Script (TradingView - Reference)"]
        PS[main.py / lorentzian_debug.pine]
        PS_ML[MLExtensions Library v2]
        PS_K[KernelFunctions Library v2]
        PS --> PS_ML
        PS --> PS_K
    end

    subgraph MQL5 ["MQL5 (MetaTrader 5 - Live Signal Indicator)"]
        M5[Lorentzian_ML_Strategy.mq5]
        M5_T[LorentzianTypes.mqh]
        M5_ML[MlExtensions.mqh]
        M5_K[KernelFunctions.mqh]
        M5 --> M5_T
        M5 --> M5_ML
        M5 --> M5_K
        M5_ML --> M5_T
        M5_K --> M5_T
        MT5[MetaTrader 5 Terminal] -- "OnTick() / iClose() / iOpen() ..." --> M5
        M5 -- "Draw Objects / Push Alert" --> MT5
    end

    subgraph Python ["Python Package (lorentzian/)"]
        PY_INIT[__init__.py — Public API]
        PY_STRAT[strategy.py — build_history / process_new_candle]
        PY_ML[ml_extensions.py — n_rsi / n_cci / n_wt / n_adx / Filters / GetLorentzianDistance]
        PY_K[kernel_functions.py — rationalQuadratic / gaussian]
        PY_T[types.py — S_BarData / StrategySettings / Enums]
        PY_INIT --> PY_STRAT
        PY_STRAT --> PY_ML
        PY_STRAT --> PY_K
        PY_STRAT --> PY_T
        PY_ML --> PY_T
        PY_K --> PY_T
    end

    subgraph Test ["Test Harness (test_lorentzian.py)"]
        FETCHER[OHLCVFetcher — aiohttp]
        RUNNER[Strategy Runner]
        DELTA["Delta Exchange REST API\nhttps://api.india.delta.exchange"]
        FETCHER -- "GET /v2/history/candles" --> DELTA
        DELTA -- "OHLCV JSON" --> FETCHER
        FETCHER --> RUNNER
        RUNNER --> PY_INIT
    end

    Pine -. "Algorithm Reference" .-> MQL5
    Pine -. "Algorithm Reference" .-> Python
```

---

## 3. Data Flow Diagram

The sequence below shows a full lifecycle: fetching historical data, initializing the strategy, and processing live candles.

```mermaid
sequenceDiagram
    participant User as User / Bot
    participant Fetcher as OHLCVFetcher
    participant DeltaAPI as Delta Exchange API
    participant Strategy as lorentzian.strategy
    participant ML as ml_extensions
    participant Kernel as kernel_functions

    Note over User,Kernel: === INITIALIZATION PHASE ===

    User->>Fetcher: fetch_historical_candles(symbol, timeframe, 2750+)
    loop Paginated batches (max 2000/req)
        Fetcher->>DeltaAPI: GET /v2/history/candles
        DeltaAPI-->>Fetcher: Raw OHLCV JSON
    end
    Fetcher-->>User: List[CandleData] (oldest first)

    User->>Strategy: build_history(settings, candles)
    Note over Strategy: Fill History[] array (newest=index 0)

    loop Phase 1 — Warmup (bars 2749 → 2500)
        Strategy->>ML: filter_volatility, RegimeFilter, Filter_ADX
        Strategy->>ML: n_rsi, n_cci, n_wt, n_adx (5 features)
        Strategy->>Kernel: rationalQuadratic(yhat1)
        Strategy->>Kernel: gaussian(yhat2)
        ML-->>Strategy: Feature values [0..1]
        Kernel-->>Strategy: Kernel estimates
    end

    loop Phase 2 — Training (bars 2500 → 500)
        Strategy->>Strategy: Assign y_label (±1 / 0) per bar
    end

    loop Phase 3 — Backtest (bars 500 → 0)
        Strategy->>ML: GetLorentzianDistance (KNN search)
        ML-->>Strategy: prediction (sum of k neighbor labels)
        Strategy->>Strategy: Generate ml_signal, startLongTrade, startShortTrade
        Strategy->>Strategy: Track trade stats (wins/losses)
    end

    Strategy-->>User: StrategySnapshot (History, signals, stats)

    Note over User,Kernel: === LIVE OPERATION PHASE ===

    loop On each new closed candle
        User->>Strategy: process_new_candle(settings, snapshot, candle)
        Strategy->>Strategy: ShiftHistoryArray() — drop oldest bar
        Strategy->>ML: Recalculate filters + 5 features for bar[0]
        Strategy->>Kernel: Recalculate yhat1, yhat2 for bar[0]
        Strategy->>ML: PerformMLSearch(gap=0)
        Strategy->>Strategy: Update ml_signal, startLongTrade, startShortTrade
        Strategy-->>User: Updated StrategySnapshot
        alt startLongTrade == True
            User->>User: Execute LONG order
        else startShortTrade == True
            User->>User: Execute SHORT order
        end
    end
```

---

## 4. Three-Phase Processing Model

Both the MQL5 and Python implementations share an identical **three-phase pipeline** that runs over the full history buffer on initialization.

```mermaid
graph LR
    subgraph Buffer ["History Buffer (default: 2750 bars)"]
        P1["Phase 1\nWARMUP\n250 bars\n(bars 2749-2500)"]
        P2["Phase 2\nTRAINING\n2000 bars\n(bars 2500-500)"]
        P3["Phase 3\nBACKTEST/LIVE\n500 bars\n(bars 500-0)"]
    end

    P1 -- "Indicators converged" --> P2
    P2 -- "y_labels assigned" --> P3

    P1_DESC["• Calculate all indicator states\n• Establish EMA/SMA/ATR RMAs\n• No labels, no predictions"]
    P2_DESC["• Assign y_label = ±1 per bar\n  (price[4] vs price[0] direction)\n• Build labeled training library"]
    P3_DESC["• KNN search over label library\n• Generate ML prediction\n• Apply filter gates\n• Emit trade signals"]

    P1 -.-> P1_DESC
    P2 -.-> P2_DESC
    P3 -.-> P3_DESC
```

**Buffer size formula:** `maxBarsBack (2000) + HISTORY_WARMUP_PERIOD (250) + backtestWindow (500) = 2750 bars minimum`

---

## 5. Data Structures / Models

### Core Bar Record: `S_BarData`

Every bar in the fixed-size ring buffer is stored as a single `S_BarData` struct/dataclass containing all derived state.

```mermaid
erDiagram
    S_BarData {
        int time
        float open
        float high
        float low
        float close
        float source
        float hlc3
        float ohlc4
        float features_5
        int y_label
        float prediction
        int ml_signal
        int barsHeld
        bool isBuySignal
        bool isSellSignal
        float yhat1
        float yhat2
        bool isKernelBullish
        bool isKernelBearish
        bool startLongTrade
        bool startShortTrade
        bool endLongTrade
        bool endShortTrade
        float marketPrice
    }

    S_BarData ||--|| S_RSI_State : "rsi_state"
    S_BarData ||--|| S_WT_State : "wt_state"
    S_BarData ||--|| S_CCI_State : "cci_state"
    S_BarData ||--|| S_ADX_State : "adx_state"
    S_BarData ||--|| S_VolFilter_State : "vol_filter_state"
    S_BarData ||--|| S_RegimeFilterState : "regime_filter_state"
    S_BarData ||--|| S_ADXFilterState : "adx_filter_state"
    S_BarData ||--|| S_EmaFilterState : "ema_filter_state"
    S_BarData ||--|| S_SmaFilterState : "sma_filter_state"

    S_RSI_State {
        float avg_gain
        float avg_loss
        float ema_rsi
    }

    S_WT_State {
        float ema1
        float ema2
        float wt1_ema
    }

    S_CCI_State {
        float ema_value
    }

    S_ADX_State {
        float tr_smooth
        float dm_plus_smooth
        float dm_minus_smooth
        float adx_final
    }

    S_VolFilter_State {
        float short_atr_rma
        float long_atr_rma
    }

    S_RegimeFilterState {
        float value1
        float value2
        float klmf
        float ema_slope
    }
```

### Configuration Structures (Python)

```mermaid
classDiagram
    class StrategySettings {
        +ENUM_CUSTOM_SOURCE source
        +int neighborsCount = 8
        +int maxBarsBack = 2000
        +int featureCount = 5
        +int backtestWindow = 500
        +bool useDynamicExits
        +bool useWorstCase
        +List~FeatureConfig~ features
        +FilterSettings filters
        +KernelSettings kernel
    }

    class FeatureConfig {
        +ENUM_FEATURE_TYPE feature_type
        +int param1
        +int param2
    }

    class FilterSettings {
        +bool useVolatilityFilter = True
        +bool useRegimeFilter = True
        +float regimeThreshold = -0.1
        +bool useAdxFilter = False
        +int adxThreshold = 20
        +bool useEmaFilter = False
        +int emaPeriod = 200
        +bool useSmaFilter = False
        +int smaPeriod = 200
    }

    class KernelSettings {
        +bool tradeWithKernel = True
        +bool enhanceKernelSmoothing = False
        +int h = 8
        +float r = 8.0
        +int x = 25
        +int lag = 2
    }

    class StrategySnapshot {
        +List~S_BarData~ History
        +bool is_initialized
        +List~float~ g_FeaturesMin
        +List~float~ g_FeaturesMax
        +int g_long = 1
        +int g_short = -1
        +int g_neutral = 0
        +int total_wins
        +int total_losses
        +int total_trades
        +int early_signal_flips
        +Signals signals
    }

    class Signals {
        +bool startLongTrade
        +bool startShortTrade
        +bool endLongTrade
        +bool endShortTrade
        +float prediction
        +int ml_signal
        +float yhat1
        +float yhat2
    }

    StrategySettings "1" --> "5" FeatureConfig
    StrategySettings "1" --> "1" FilterSettings
    StrategySettings "1" --> "1" KernelSettings
    StrategySnapshot "1" --> "1" Signals
    StrategySnapshot "1" --> "*" S_BarData
```

### Enumerations

| Enum                 | Values                                            | Purpose                               |
| -------------------- | ------------------------------------------------- | ------------------------------------- |
| `ENUM_CUSTOM_SOURCE` | `CLOSE, OPEN, HIGH, LOW, HL2, HLC3, OHLC4, HLCC4` | Price source for feature calculations |
| `ENUM_FEATURE_TYPE`  | `RSI=0, WT=1, CCI=2, ADX=3`                       | Feature type selector                 |
| `Direction`          | `LONG=1, SHORT=-1, NEUTRAL=0`                     | ML signal labels and y-labels         |

---

## 6. Component Reference

### `strategy.py` — Public API

| Function             | Signature                                                             | Description                                                                                                    |
| -------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `build_history`      | `(StrategySettings, List[CandleData]) → StrategySnapshot`             | Full initialization. Loads the ring buffer, runs all three phases. Requires ≥ 2750 candles (default settings). |
| `process_new_candle` | `(StrategySettings, StrategySnapshot, CandleData) → StrategySnapshot` | Processes one new closed candle. Shifts the ring buffer, recalculates indices 0 only. O(maxBarsBack) per call. |
| `execute_trade`      | Internal trade stat helper                                            | Updates `snapshot` win/loss state when a trade opens.                                                          |
| `close_trade`        | Internal trade stat helper                                            | Settles a trade and increments win/loss counters.                                                              |
| `get_trade_stats`    | `(StrategySnapshot) → dict`                                           | Returns win rate, W/L ratio, total trades.                                                                     |
| `print_trade_stats`  | `(StrategySnapshot) → str`                                            | Formatted summary string.                                                                                      |

### `ml_extensions.py` — ML Math

| Function                                                  | Returns                 | Description                                                          |
| --------------------------------------------------------- | ----------------------- | -------------------------------------------------------------------- |
| `n_rsi(history, i, n1, n2)`                               | `float [0,1]`           | Normalized RSI: Wilder RMA smoothed, then EMA smoothed, rescaled 0–1 |
| `n_cci(history, i, n1, n2, min, max)`                     | `(float, float, float)` | Normalized CCI with dynamic min/max tracking                         |
| `n_wt(history, i, n1, n2, min, max)`                      | `(float, float, float)` | Normalized WaveTrend with dynamic min/max tracking                   |
| `n_adx(history, i, n1)`                                   | `float [0,1]`           | Normalized ADX using Wilder smoothing, rescaled 0–1                  |
| `filter_volatility(history, i, min_len, max_len, use)`    | `bool`                  | ATR ratio filter: short ATR > long ATR                               |
| `RegimeFilter(history, i, threshold, use, is_init)`       | `bool`                  | Kalman-like momentum filter using normalized slope                   |
| `Filter_ADX(history, i, period, threshold, use, is_init)` | `bool`                  | ADX value threshold gate                                             |
| `GetLorentzianDistance(history, i, j, featureCount)`      | `float`                 | Core distance metric: `Σ log(1 + \|f_i - f_j\|)`                     |

### `kernel_functions.py` — Nadaraya-Watson Estimators

| Function                                                                  | Returns | Description                                                            |
| ------------------------------------------------------------------------- | ------- | ---------------------------------------------------------------------- |
| `rationalQuadratic(history, index, lookback, relativeWeight, startAtBar)` | `float` | Weighted regression with polynomial decay: `w = (1 + i²/(h²·2r))^(-r)` |
| `gaussian(history, index, lookback, startAtBar)`                          | `float` | Weighted regression with Gaussian decay: `w = exp(-i²/(2h²))`          |

Both functions walk backwards from `index` through the full available history computing a weighted average of `source` values.

---

## 7. Key Design Patterns

### Pattern 1: Exact Cross-Language Parity

All three implementations (Pine Script, MQL5, Python) share **identical function names, struct field names, and algorithm logic**. The Python port uses Python conventions (`snake_case` dataclasses) but every formula, loop boundary, and conditional is a direct translation of the MQL5 version, which itself traces back to the Pine Script original.

This means bugs found in one implementation reveal the same bug in all others, and validation is done by comparing outputs on identical OHLCV input.

### Pattern 2: Self-Contained Ring Buffer

The entire strategy state is held in a **fixed-size array** (`History[]`). Index `0` is always the most recent bar. On each new candle `process_new_candle` calls `ShiftHistoryArray()` which pops the oldest element and inserts an empty slot at `0`. There is no database, no file I/O, and no external state.

```
History[0]   ← newest (just closed)
History[1]   ← 1 bar ago
...
History[N-1] ← oldest
```

### Pattern 3: Per-Bar Indicator State Embedding

Each `S_BarData` record **carries the full intermediate indicator state** at that bar (e.g., `S_RSI_State.avg_gain`, `S_WT_State.ema1`). This is the critical technique that allows the incremental `_rma()` and `_ema()` smoothing functions to read the previous bar's state from `history[i+1]` rather than maintaining separate global accumulator variables. The entire history is thus self-consistent and can be replayed.

### Pattern 4: Ground Truth Label Assignment (`y_label`)

Labels are assigned **4 bars in arrears** using actual future price movement:

```
if price[4] < price[0]:  y_label = SHORT  # price moved up → future label = "was short wrong"
if price[4] > price[0]:  y_label = LONG
else:                    y_label = NEUTRAL
```

This means the training library is fully labeled without look-ahead bias during live prediction (the prediction query bar is never part of its own training window).

### Pattern 5: Modulo-4 KNN Optimization

During `PerformMLSearch`, only training candidates where `relative_index % 4 != 0` are evaluated. This 25% reduction in distance computations matches the original Pine Script behavior and reduces the computational cost from O(N) to O(0.75·N) per prediction.

### Pattern 6: FIFO Nearest-Neighbor Queue with Warp

The KNN algorithm maintains a fixed-size candidate list of `neighborsCount` (default 8) neighbors using a FIFO eviction window. The distance threshold `lastDistance` is updated to the **75th percentile** of the current candidate list (`distances[round(k * 0.75)]`) rather than the maximum, causing the neighborhood to "warp" and continuously refine toward denser clusters of similar patterns.

### Pattern 7: Dual-Kernel Trend Confirmation

Two kernel estimates are computed independently per bar:

- **`yhat1`**: `rationalQuadratic(h=8, r=8.0, x=25)` — broader trend estimate
- **`yhat2`**: `gaussian(h=8-lag=6, x=25)` — shorter/lagged trend estimate

The comparison `yhat2 >= yhat1` (smooth mode) or `yhat1[1] < yhat1[0]` (rate mode) determines kernel bullishness. A trade signal only fires when **ML prediction + all active filters + kernel direction** all agree.

---

## 8. Lorentzian KNN Algorithm

The core distance metric replaces Euclidean distance to better handle the non-linear "warping" of price-time space near major market events:

$$d_{Lorentzian}(i, j) = \sum_{k=1}^{n} \log\left(1 + |f_k^{(i)} - f_k^{(j)}|\right)$$

Where $f_k$ are the $n$ normalized technical features (default $n=5$).

**Properties vs. Euclidean:**

- Logarithmic growth bounds the influence of large outliers
- Small differences are weighted more heavily (better for identifying subtle regime similarities)
- Naturally discounts feature distances caused by black-swan price events

**Search Window:**

```mermaid
graph LR
    NOW["Bar 0\n(Current)"] --> GAP["Gap: 0 bars"]
    GAP --> SEARCH_START["Training Start\n(bar maxBarsBack)"]
    SEARCH_START --> SEARCH_END["Training End\n(bar maxBarsBack + 2000)"]
    SEARCH_END --> OLDEST["Oldest\n(bar N-1)"]

    style SEARCH_START fill:#f90,color:#000
    style SEARCH_END fill:#f90,color:#000
```

Live operation always uses `gap=0` (prediction based on the current bar looking back into the labeled library).

---

## 9. Kernel Regression

Both kernels implement **Nadaraya-Watson non-parametric regression**: a weighted average of all historical `source` values where the weight decays with temporal distance from the current bar.

| Parameter             | Symbol | Default | Effect                                                     |
| --------------------- | ------ | ------- | ---------------------------------------------------------- |
| `h` (lookback)        | $h$    | 8       | Controls bandwidth — higher = smoother estimate            |
| `r` (relative weight) | $r$    | 8.0     | Rational Quadratic only — controls polynomial decay rate   |
| `x` (startAtBar)      | $x$    | 25      | Extends the regression window start point                  |
| `lag`                 | —      | 2       | Shortens lookback for Gaussian: `h_gaussian = h - lag = 6` |

The Gaussian with shorter lookback makes `yhat2` more responsive than `yhat1`, so `yhat2 > yhat1` indicates the fast estimate is above the slow estimate (bullish momentum).

---

## 10. Filter Pipeline

All filters must pass simultaneously (`filter_all = vol_ok AND reg_ok AND adx_ok`) for a signal to fire. Each filter is independently togglable.

```mermaid
graph TD
    RAW[Raw ML Prediction] --> VOL{Volatility\nFilter}
    VOL -- Pass: short_ATR > long_ATR --> REG{Regime\nFilter}
    VOL -- Fail --> BLOCKED[Signal Blocked]
    REG -- Pass: slope > threshold --> ADX{ADX\nFilter}
    REG -- Fail --> BLOCKED
    ADX -- Pass: adx > threshold --> EMA{EMA\nTrend Gate}
    ADX -- Fail --> BLOCKED
    EMA -- Long: close > EMA200 --> SMA{SMA\nTrend Gate}
    EMA -- Short: close < EMA200 --> SMA
    SMA -- Long: close > SMA200 --> KERNEL{Kernel\nDirection}
    SMA -- Long: close > SMA200 --> KERNEL
    KERNEL -- Bullish for Long --> SIGNAL[Trade Signal Emitted]
    KERNEL -- Bearish for Short --> SIGNAL
    KERNEL -- Mismatch --> BLOCKED
```

| Filter         | Mechanism                                                                   | Default  |
| -------------- | --------------------------------------------------------------------------- | -------- |
| **Volatility** | `short_ATR_RMA(1) > long_ATR_RMA(10)` — expanding volatility required       | Enabled  |
| **Regime**     | Normalized KLMF slope > `regimeThreshold (-0.1)` — trending market required | Enabled  |
| **ADX**        | ADX value > `adxThreshold (20)` — trend strength gate                       | Disabled |
| **EMA**        | Price vs. 200-period EMA (directional gate, not a block)                    | Disabled |
| **SMA**        | Price vs. 200-period SMA (directional gate, not a block)                    | Disabled |
| **Kernel**     | `yhat2 >= yhat1` (or rate of change) must agree with trade direction        | Enabled  |

---

## 11. Signal Generation Logic

A trade signal requires the full conjunction of independently gated conditions:

```
startLongTrade  = isNewBuySignal  AND isKernelBullish
startShortTrade = isNewSellSignal AND isKernelBearish

isNewBuySignal  = (ml_signal == LONG)  AND isEmaUptrend AND isSmaUptrend AND isDifferentSignalType
isNewSellSignal = (ml_signal == SHORT) AND isEmaDowntrend AND isSmaDowntrend AND isDifferentSignalType

ml_signal = LONG   if (prediction > 0 AND filter_all)
          = SHORT  if (prediction < 0 AND filter_all)
          = prev_signal  (hold last)
```

**Exit logic** (strict mode) triggers 4 bars after entry:

```
endLongTrade  = (held 4 bars AND last signal was buy) OR (held < 4 AND new sell flip) AND entry[4].startLongTrade
endShortTrade = (held 4 bars AND last signal was sell) OR (held < 4 AND new buy flip) AND entry[4].startShortTrade
```

---

## 12. Extension & Configuration Guide

### Adding a New Feature Type

1. Add the enum value to `ENUM_FEATURE_TYPE` in `types.py` and `LorentzianTypes.mqh`.
2. Implement the normalization function in `ml_extensions.py` and `MlExtensions.mqh` following the `n_rsi()` pattern (accept `history[]`, index `i`, parameters; return `float [0,1]`).
3. Add the dispatch branch in `CalculateFeature()` in `strategy.py` and its MQL5 counterpart.

### Changing the Number of Features

The `featureCount` setting controls how many features are included in `GetLorentzianDistance()`. The array `features[5]` is fixed-size; increase it in `S_BarData` and `FeatureConfig` defaults together.

### Consuming from a Different Exchange

Replace `OHLCVFetcher` in `test_lorentzian.py`. The strategy only needs a sorted `List[CandleData]` (oldest first). The `CandleData` dataclass requires `timestamp`, `open`, `high`, `low`, `close`, `volume`.

### Tuning the KNN Neighborhood

| Parameter                            | Effect                                                      |
| ------------------------------------ | ----------------------------------------------------------- |
| `neighborsCount` (default 8)         | Larger k = smoother, less reactive predictions              |
| `maxBarsBack` (default 2000)         | Larger window = more training data, slower first init       |
| Feature params (e.g., RSI period 14) | Affect the normalized feature values fed to distance metric |

### Architecture Consistency Rules

- **Index 0 is always the newest bar.** All lookbacks use `history[i+1]`, `history[i+2]`, etc.
- **Never mutate `history[i]` from a different bar's calculation context.** Each bar's state is computed once in the processing loop, oldest-to-newest.
- **All features must be normalized to [0, 1]** before being fed to `GetLorentzianDistance`. Raw values would cause the Lorentzian distance to be biased toward high-magnitude features.
- **`build_history` must be called before `process_new_candle`.** The library does not perform lazy initialization.
