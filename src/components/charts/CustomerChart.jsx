import React, { Component } from "react";
import Chart from "react-apexcharts";

class CustomerChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            options: {
                chart: {
                    id: "basic-bar"
                },
                xaxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                },
            },
            series: [
                {
                    name: "New Customer",
                    data: [80, 70, 75, 50, 49, 60, 70, 84, 91, 65, 47, 68]
                }
            ]
        };
    }

    render() {
        return (
            <Chart
                options={this.state.options}
                series={this.state.series}
                type="bar"
                width="100%"
            />
        );
    }
}

export default CustomerChart;
