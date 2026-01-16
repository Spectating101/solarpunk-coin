#!/usr/bin/env python3
import pandas as pd

def diagnose_file(path, date_col, numeric_cols):
    print(f"\n=== Diagnosing {path} ===")
    try:
        df = pd.read_csv(path)
    except Exception as e:
        print(f"  ⚠️  Failed to read {path}: {e}")
        return

    # 1. Basic structure
    print("\nColumns & dtypes:")
    print(df.dtypes)

    print("\nNull counts:")
    print(df.isnull().sum())

    # 2. Date parsing check
    if date_col in df.columns:
        parsed = pd.to_datetime(df[date_col], errors='coerce')
        bad = parsed.isna().sum()
        print(f"\nDate parsing → {bad} bad / {len(df)} total")
    else:
        print(f"\n⚠️  Date column '{date_col}' not found")

    # 3. Numeric coercion
    for col in numeric_cols:
        if col in df.columns:
            coerced = pd.to_numeric(df[col], errors='coerce')
            n_bad = coerced.isna().sum()
            print(f"\nColumn '{col}': {n_bad} non-numeric / {len(df)}")
            if n_bad:
                print(" Sample bad rows:")
                print(df.loc[coerced.isna(), [col]].head(5))
        else:
            print(f"\n⚠️  Numeric column '{col}' not found")

    # 4. Quick summary stats
    print("\n-- Summary statistics for numeric columns:")
    print(df.describe(include=[float, int]))

if __name__ == "__main__":
    # adjust filenames/columns as needed
    diagnose_file(
        path="eth_ds_parsed.csv",
        date_col="Date",
        numeric_cols=["Open", "Price"]
    )
    diagnose_file(
        path="bitcoin_ceir_final.csv",
        date_col="Date",
        numeric_cols=["Price", "log_CEIR"]
    )

