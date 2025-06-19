import React, { Component } from "react";
import Chart from "react-apexcharts";

class MonthlyRevenueChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            options: {
                chart: {
                    id: "basic-bar"
                },
                xaxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                }
            },
            series: [
                {
                    name: "Total Revenue in $",
                    data: [5000, 4200, 4175, 3250, 4449, 3460, 4370, 2384, 3291, 3265, 4747, 5368]
                }
            ]
        };
    }

    render() {
        return (
            <Chart
                options={this.state.options}
                series={this.state.series}
                type="area"
                width="100%"
            />
        );
    }
}

export default MonthlyRevenueChart;
