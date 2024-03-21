"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Chart from "chart.js/auto"; // Import Chart.js
import { Box } from "lucide-react";

const Page = () => {
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [warehouseData, setWarehouseData] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/warehouse/api");
      const data = response.data;

      let sum = 0;

      const warehouseQuantities = {};
      data.forEach((item) => {
        sum += item.quantity;
        if (warehouseQuantities[item.storagePlace]) {
          warehouseQuantities[item.storagePlace] += item.quantity;
        } else {
          warehouseQuantities[item.storagePlace] = item.quantity;
        }
      });

      setTotalQuantity(sum);
      setWarehouseData(warehouseQuantities);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (warehouseData.length !== 0) {
      if (chartRef.current !== null) {
        chartRef.current.destroy();
      }
      createChart();
    }
  }, [warehouseData]);

  const createChart = () => {
    const ctx = document.getElementById("myChart").getContext("2d");

    const sortedKeys = Object.keys(warehouseData).sort();
    const sortedData = sortedKeys.map(key => warehouseData[key]); // Map sorted keys to corresponding values

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: sortedKeys,
        datasets: [
          {
            label: "จำนวนสินค้าในโกดัง",
            data: sortedData,
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
};


  if (loading)
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col py-3 px-3 w-full gap-3 h-screen overflow-hidden" >
      <div className="h-[50%] bg-[#ffffff] rounded-[20px]  relative">
        <div className="p-10 flex justify-between items-center">
          <h1 className="text-5xl font-medium text-black">แดชบอร์ด</h1>
        </div>


        <div className="px-10 grid grid-cols-4 gap-3">


          <div className=" bg-[#FFF500] rounded-[20px] p-6 px-16 items-center">
            <div className="flex justify-between my-auto">
              <div className="flex flex-col justify-center ">
                <Box size={125} />
                <h1 className=" text-2xl font-semibold mt-2 mx-auto">
                  โกดัง 1
                </h1>
              </div>
              <div className="my-auto relative">
              <h1 className=" text-3xl  items-center align-middle my-auto text-white bg-slate-700 px-5 py-4 rounded-full">
                {warehouseData["โกดัง 1"]}
              </h1>
              </div>
            </div>
          </div>


          <div className=" bg-[#FFF500] rounded-[20px] p-6 px-12 items-center">
            <div className="flex justify-between my-auto">
              <div className="flex flex-col justify-center ">
                <Box size={125} />
                <h1 className=" text-2xl font-semibold mt-2 mx-auto">
                  โกดัง 2
                </h1>
              </div>
              <div className="my-auto relative">
              <h1 className=" text-3xl  items-center align-middle my-auto text-white bg-slate-700 px-5 py-4 rounded-full">
                {warehouseData["โกดัง 2"]}
              </h1>
              </div>
            </div>
          </div>

          
          <div className=" bg-[#FFF500] rounded-[20px] p-6 px-12 items-center">
            <div className="flex justify-between my-auto">
              <div className="flex flex-col justify-center ">
                <Box size={125} />
                <h1 className=" text-2xl font-semibold mt-2 mx-auto">
                  โกดัง 3
                </h1>
              </div>
              <div className="my-auto relative">
              <h1 className=" text-3xl  items-center align-middle my-auto text-white bg-slate-700 px-5 py-4 rounded-full">
                {warehouseData["โกดัง 3"]}
              </h1>
              </div>
            </div>
          </div>

          <div className=" bg-[#FFF500] rounded-[20px] p-6 px-12 items-center">
            <div className="flex justify-between my-auto">
              <div className="flex flex-col justify-center ">
                <Box size={125} />
                <h1 className=" text-2xl font-semibold mt-2 mx-auto">
                  โกดัง 4
                </h1>
              </div>
              <div className="my-auto relative">
              <h1 className=" text-3xl  items-center align-middle my-auto text-white bg-slate-700 px-5 py-4 rounded-full">
                {warehouseData["โกดัง 4"]}
              </h1>
              </div>
            </div>
          </div>


        </div>
      </div>

      <div className="h-[50%] bg-[#ffffff] rounded-[20px] overflow-hidden">
        <div className="p-10">
          <canvas
            id="myChart"
            className="w-full h-full"
            style={{ maxHeight: "350px" }}
          ></canvas>
        </div>
      </div>
    </div>
  );
};

export default Page;
