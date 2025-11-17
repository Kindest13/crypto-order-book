import { useState, type FC } from "react"

import { OrderBookData } from "../../types"
import ReactApexChart from "react-apexcharts"
import { candlestickChartData } from "./candlestickChartData.constants"

interface Props {
  data: OrderBookData
}

export const OrderBookChart: FC<Props> = ({ data }) => {
  const [state] = useState({
    series: [
      {
        data: candlestickChartData,
      },
    ],
    options: {
      chart: {
        type: "candlestick" as "candlestick",
        height: 350,
      },
      xaxis: {
        type: "datetime" as "datetime",
      },
      yaxis: {
        tooltip: {
          enabled: true,
        },
      },
    },
  })

  return (
    <div className="h-full bg-white dark:bg-gray-900 p-4 flex flex-col">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Price Chart
      </h2>
      <div id="chart">
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="candlestick"
          height={350}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  )
}
