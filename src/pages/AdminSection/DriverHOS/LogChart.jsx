import React from "react";

export default function LogChart() {
    return (
        // <div className="table-responsive">
        //     <div className="custom-chart-table">
        //         <div className="header-content">
        //             <div className="table-row d-flex justify-content-center fs-12 fw-bold text-body">
        //                 <div className="table-cell">M</div>
        //                 <div className="table-cell">1</div>
        //                 <div className="table-cell">2</div>
        //                 <div className="table-cell">3</div>
        //                 <div className="table-cell">4</div>
        //                 <div className="table-cell">5</div>
        //                 <div className="table-cell">6</div>
        //                 <div className="table-cell">7</div>
        //                 <div className="table-cell">8</div>
        //                 <div className="table-cell">9</div>
        //                 <div className="table-cell">10</div>
        //                 <div className="table-cell">11</div>
        //                 <div className="table-cell">N</div>
        //                 <div className="table-cell">1</div>
        //                 <div className="table-cell">2</div>
        //                 <div className="table-cell">3</div>
        //                 <div className="table-cell">4</div>
        //                 <div className="table-cell">5</div>
        //                 <div className="table-cell">6</div>
        //                 <div className="table-cell">7</div>
        //                 <div className="table-cell">8</div>
        //                 <div className="table-cell">9</div>
        //                 <div className="table-cell">10</div>
        //                 <div className="table-cell">11</div>
        //                 <div className="table-cell">M</div>
        //             </div>
        //         </div>
        //         <div className="body-content">
        //             {/* {[...Array(5)].map((elementInArray, index) => ( */}
        //                 <div  className="table-row d-flex align-items-center fs-12 fw-bold text-center border-bottom border-secondary border-opacity-75">
        //                     <div className="table-cell">OFF</div>
        //                     {[...Array(23)].map((elementInArray, idx) => (
        //                         <div key={idx} className="table-cell bg-success bg-opacity-25 striped-cell border-end flex-fill"></div>
        //                     ))}
        //                     <div className="table-cell">05:04</div>
        //                 </div>
        //                 <div  className="table-row d-flex align-items-center fs-12 fw-bold text-center border-bottom border-secondary border-opacity-75">
        //                     <div className="table-cell">OFF</div>
        //                     {[...Array(23)].map((elementInArray, idx) => (
        //                         <div key={idx} className="table-cell bg-theme6 bg-opacity-25 striped-cell border-end flex-fill"></div>
        //                     ))}
        //                     <div className="table-cell">05:04</div>
        //                 </div>
        //             {/* ))} */}
        //         </div>
        //     </div>
        // </div>
        <div className="custom-chart-table table-responsive">
            <table className="table table-bordered align-middle fs-12 fw-bold text-body text-center">
                <thead>
                    <tr className="">
                        <td>M</td>
                        <td>1</td>
                        <td>2</td>
                        <td>3</td>
                        <td>4</td>
                        <td>5</td>
                        <td>6</td>
                        <td>7</td>
                        <td>8</td>
                        <td>9</td>
                        <td>10</td>
                        <td>11</td>
                        <td>N</td>
                        <td>1</td>
                        <td>2</td>
                        <td>3</td>
                        <td>4</td>
                        <td>5</td>
                        <td>6</td>
                        <td>7</td>
                        <td>8</td>
                        <td>9</td>
                        <td>10</td>
                        <td>11</td>
                        <td>M</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="text-uppercase">OFF</td>
                        {[...Array(23)].map((elementInArray, idx) => (
                            <td key={idx} className="bg-success bg-opacity-25 striped-cell"></td>
                        ))}
                        <td>05:04</td>
                    </tr>
                    <tr>
                        <td className="text-uppercase">SB</td>
                        {[...Array(23)].map((elementInArray, idx) => (
                            <td key={idx} className="bg-theme6 bg-opacity-25 striped-cell"></td>
                        ))}
                        <td>00:00</td>
                    </tr>
                    <tr>
                        <td className="text-uppercase">DR</td>
                        {[...Array(23)].map((elementInArray, idx) => (
                            <td key={idx} className="bg-theme3 bg-opacity-25 striped-cell"></td>
                        ))}
                        <td>00:00</td>
                    </tr>
                    <tr>
                        <td className="text-uppercase">ON</td>
                        {[...Array(23)].map((elementInArray, idx) => (
                            <td key={idx} className="bg-warning bg-opacity-25 striped-cell"></td>
                        ))}
                        <td>00:00</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
