import React, { Component } from "react";
import Chart from "react-apexcharts";

class PetTypeChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [44, 55, 41, 37, 25],
            options: {
                labels: ['2025', '2024', '2023', '2022', '2021'],
                legend: {
                    position: 'bottom',
                },
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return val + " Cr";
                        }
                    }
                }
            },
        }
    }

    render() {
        return (
            <Chart options={this.state.options} series={this.state.series} type="pie" />
        )
    }
}

export default PetTypeChart;
