import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('bitcoin_complete_integrated.csv', parse_dates=['Date'])
plt.figure(figsize=(10,3))
plt.plot(df.Date, df.CEIR, label='Original CEIR')
plt.plot(df.Date, df.CEIR_enhanced, label='Enhanced CEIR', alpha=0.8)
plt.legend()
plt.show()

