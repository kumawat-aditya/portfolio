# Lorentzian Classification Strategy

A multi-language implementation of the **Machine Learning: Lorentzian Classification** trading strategy, ported faithfully from its original Pine Script (TradingView) definition into **MQL5** (MetaTrader 5) and **Python**. The strategy uses K-Nearest Neighbors with a Lorentzian distance metric combined with Nadaraya-Watson kernel regression to generate directional trade signals.

---

## Tech Stack

| Layer                     | Technology     | Version / Notes                                         |
| ------------------------- | -------------- | ------------------------------------------------------- |
| Original Reference        | Pine Script v5 | TradingView indicator by `jdehorty`                     |
| Live Signal Indicator     | MQL5           | MetaTrader 5 – visual/alert only, no order execution    |
| Reusable Library          | Python 3       | Pure Python port, no external ML libraries required     |
| HTTP Client (test script) | `aiohttp`      | Async OHLCV fetching from Delta Exchange                |
| Exchange API              | Delta Exchange | `https://api.india.delta.exchange` (crypto derivatives) |

---

## Prerequisites & Installation

### MQL5 (MetaTrader 5)

1. Open **MetaEditor** (F4 from MT5).
2. Copy the `mql/Lorentzian/` folder into your MT5 `MQL5/Include/` directory:
   ```
   MQL5/Include/Lorentzian/LorentzianTypes.mqh
   MQL5/Include/Lorentzian/MlExtensions.mqh
   MQL5/Include/Lorentzian/KernelFunctions.mqh
   ```
3. Copy `mql/Lorentzian_ML_Strategy.mq5` into `MQL5/Indicators/`.
4. Compile from MetaEditor (F7). The compiled `.ex5` is written to `MQL5/Indicators/`.
5. Attach the indicator to any chart — no trading account funds are required; it is a signal indicator only.

### Python Library

**Requirements:** Python 3.9+ (uses `dataclasses`, `asyncio`, standard library features).

```bash
# Clone / navigate to the python directory
cd lorentzian_strategy/python

# Install the only runtime dependency (needed for the test script)
pip install aiohttp
```

No `requirements.txt` is needed for the core library itself — `lorentzian/` depends only on the Python standard library.

### Running the Test Script

The test script fetches live OHLCV data from Delta Exchange and runs the strategy end-to-end.

```bash
cd lorentzian_strategy/python

python test_lorentzian.py
```

---

## Environment Variables

The codebase does not use `.env` files or environment variables. All configuration is provided programmatically via Python dataclasses (`StrategySettings`, `FilterSettings`, `KernelSettings`) or via MT5 indicator input parameters.

---

## Folder Structure

```
lorentzian_strategy/
├── README.md                          ← You are here
├── Lorentzian_Strategy.ex5            ← Pre-compiled MT5 indicator binary
├── default.tpl                        ← MT5 chart template
│
├── mql/                               ← MetaTrader 5 source code
│   ├── Lorentzian_ML_Strategy.mq5     ← Main MQL5 indicator
│   └── Lorentzian/                    ← MQL5 include headers
│       ├── LorentzianTypes.mqh        ← Shared enums & structs
│       ├── MlExtensions.mqh           ← ML functions (RSI/WT/CCI/ADX, filters, KNN)
│       └── KernelFunctions.mqh        ← Nadaraya-Watson kernel estimators
│
├── python/                            ← Python library & test harness
│   ├── README.md                      ← Python-specific docs
│   ├── test_lorentzian.py             ← End-to-end test via Delta Exchange API
│   └── lorentzian/                    ← Installable Python package
│       ├── __init__.py                ← Public API exports
│       ├── types.py                   ← Data structures (S_BarData, configs, enums)
│       ├── ml_extensions.py           ← Core ML math (normalization, KNN distance)
│       ├── kernel_functions.py        ← rationalQuadratic & gaussian kernels
│       └── strategy.py                ← Main API: build_history, process_new_candle
│
├── Pine_script/                       ← Original Pine Script reference files
│   ├── main.py                        ← Pine Script source (indicator definition)
│   ├── kernelfunctions.py             ← Pine Script kernel library reference
│   └── mlextensions.py                ← Pine Script ML library reference
│
└── doc/                               ← Project documentation
    ├── improvement_proposal.md
    ├── strategy_blueprint.md
    └── windows_server.md
```

---

## Python Quick Start

```python
from lorentzian import (
    build_history,
    process_new_candle,
    get_trade_stats,
    print_trade_stats,
    CandleData,
    StrategySettings,
    FilterSettings,
    KernelSettings,
    FeatureConfig,
    ENUM_FEATURE_TYPE,
)

# Minimum candle count = maxBarsBack (2000) + warmup (250) + backtestWindow (500) = 2750
candles = [
    CandleData(timestamp=1700000000, open=100.0, high=101.0, low=99.0, close=100.5, volume=1000.0),
    # ... 2750+ candles, OLDEST FIRST
]

settings = StrategySettings()                  # Use all defaults
snapshot = build_history(settings, candles)    # Initialise + run backtest

# On every new closed candle thereafter:
new_candle = CandleData(...)
snapshot = process_new_candle(settings, snapshot, new_candle)

if snapshot.signals.startLongTrade:
    print("LONG signal")
elif snapshot.signals.startShortTrade:
    print("SHORT signal")

# Print backtest performance stats
print_trade_stats(snapshot)
```

---

## Quick Links

- [Architecture & Data Flow](docs/ARCHITECTURE.md)
- [Python Package README](python/README.md)
