"use client";
import Image from 'next/image'
import { useEffect, useState } from 'react'

// Declare API Response Type
type forexAPIResponse = {
    success: boolean;
    timestamp: number;
    base: string;
    date: string;
    rates: Record<string, number>;
}

export default function Home() {

  const [forex, setforex] = useState<forexAPIResponse | null>(null);
  const [modifiedForex, setModifiedForex] = useState<Record<string, number> | null>(null);

  useEffect(() => {

    // Task 1: Fetch Function
    const fetchData = async () => {
      try{
        const response = await fetch('https://api.apilayer.com/fixer/latest', {
          method: 'GET',
          headers: {
            'apikey': '9sOx2d1gWYZrKY0uD4hCbOMIQzLcL4KQ',
          },
        });

        // Task 1.5: Transfering Forex Result To JSON Format
        const result:forexAPIResponse = await response.json();
        
        // Task 1.5: Updating the Previous State
        setforex(result);
        
        // Task 2: New Variable With Modified Forex Rate
        const modifiedForexRates: Record<string, number> = {};
        const newRate = 10.0002;
        for (let currency in result.rates){
          modifiedForexRates[currency] = result.rates[currency] + newRate;
        }

        // Task 2: Updating The Previous State
        setModifiedForex(modifiedForexRates);
      }catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const isEven = (forexRate: number) => {
    if (parseFloat(forexRate.toFixed(6).replace('.','')) % 2 === 0) {
      return true;
    }

    else{
      return false;
    }
  } 

  return (

      <section className="min-h-screen bg-black text-white font-sans flex flex-col justify-center items-center">
        <h1 className="text-5xl font-bold mb-10 mt-20">Forex API Rate</h1>

        <div className="overflow-x-auto bg-gray-900 shadow-lg rounded-lg mx-4 md:mx-0 w-full md:max-w-4xl">
          <table className="w-full text-left text-sm font-light">
            <thead>
              <tr>
                <th className="px-4 py-2 bg-gray-800 text-gray-300 font-semibold">#</th>
                <th className="px-4 py-2 bg-gray-800 text-gray-300 font-semibold">Currency</th>
                <th className="px-4 py-2 bg-gray-800 text-gray-300 font-semibold">Original Rate</th>
                <th className="px-4 py-2 bg-gray-800 text-gray-300 font-semibold">Modified Rate</th>
              </tr>
            </thead>
            <tbody>
              {forex && Object.entries(forex.rates).map(([currency, value], index) => (
                <tr key={currency} className={`hover:bg-gray-800 transition duration-300 ${index % 2 === 0 ? "bg-gray-850" : "bg-gray-900"}`}>
                  <td className="whitespace-nowrap px-4 py-2">{index + 1}</td>
                  <td className={`whitespace-nowrap px-4 py-2 ${currency === 'HKD' ? 'border-red-500 border-l-4' : ''}`}>{currency}</td>
                  <td className={`whitespace-nowrap px-4 py-2 ${isEven(value) ? 'border-red-500 border-l-4' : ''}`}>{value}</td>
                  <td className={`whitespace-nowrap px-4 py-2 ${modifiedForex && isEven(modifiedForex[currency]) ? 'border-red-500 border-l-4' : ''}`}>{modifiedForex ? modifiedForex[currency] : 'Loading...'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
  )
}

