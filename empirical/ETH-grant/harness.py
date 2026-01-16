import pandas as pd
import numpy as np

def create_representative_sample(input_file, output_file, rows_per_period=40):
    """
    Extract strategic data samples from different time periods.
    
    Parameters:
    - input_file: Path to the full bitcoin_ceir_final.csv
    - output_file: Path to save the sample data
    - rows_per_period: Number of rows to extract from each period
    """
    print(f"Reading data from {input_file}...")
    
    # Read the full dataset
    df = pd.read_csv(input_file)
    
    # Convert Date to datetime for filtering
    df['Date'] = pd.to_datetime(df['Date'])
    
    # Define key periods
    periods = [
        # Pre-ban baseline (early 2019-2020)
        ('2019-01-01', '2019-12-31', 'Pre-ban baseline'),
        
        # Right before China ban (early 2021)
        ('2021-01-01', '2021-06-20', 'Pre-ban (2021)'),
        
        # Right after China ban (mid-2021)
        ('2021-06-21', '2021-12-31', 'Post-ban (2021)'),
        
        # Ethereum Merge period (Sept 2022)
        ('2022-08-15', '2022-10-15', 'ETH Merge period')
    ]
    
    # Initialize an empty dataframe for the samples
    samples = []
    
    # Extract samples from each period
    for start_date, end_date, label in periods:
        period_data = df[(df['Date'] >= start_date) & (df['Date'] <= end_date)]
        
        # If period has fewer rows than requested, take all rows
        if len(period_data) <= rows_per_period:
            period_sample = period_data
        else:
            # Take evenly spaced rows to cover the full period
            indices = np.linspace(0, len(period_data)-1, rows_per_period, dtype=int)
            period_sample = period_data.iloc[indices]
        
        print(f"Selected {len(period_sample)} rows from {label} ({start_date} to {end_date})")
        samples.append(period_sample)
    
    # Combine all samples
    combined_sample = pd.concat(samples)
    
    # Sort by date for readability
    combined_sample = combined_sample.sort_values('Date')
    
    # Add a period label column for clarity
    combined_sample['period'] = 'Pre-ban'
    combined_sample.loc[combined_sample['Date'] >= '2021-06-21', 'period'] = 'Post-ban'
    combined_sample.loc[combined_sample['Date'] >= '2022-08-15', 'period'] = 'ETH Merge'
    
    # Save to output file
    combined_sample.to_csv(output_file, index=False)
    print(f"Saved {len(combined_sample)} sample rows to {output_file}")
    
    return combined_sample

# Execute the function
if __name__ == "__main__":
    sample_data = create_representative_sample(
        input_file="bitcoin_ceir_final.csv",
        output_file="bitcoin_ceir_sample.csv",
        rows_per_period=40
    )
    
    # Print summary statistics as a quick check
    print("\nSample Data Summary:")
    print(f"Date range: {sample_data['Date'].min()} to {sample_data['Date'].max()}")
    print(f"Total rows: {len(sample_data)}")
    
    # Display period counts
    period_counts = sample_data['period'].value_counts()
    for period, count in period_counts.items():
        print(f"{period}: {count} rows")
