import React from 'react';
import { Line } from 'react-chartjs-2';

function LineChart(props) {

    const {labels, datas, colors, ticks} = props;

    const hexToRgba = (hex, opacity) => {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
          return r + r + g + g + b + b;
        });
      
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if(result) {
            const r = parseInt(result[1], 16);
            const g = parseInt(result[2], 16);
            const b = parseInt(result[3], 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        } else {
            return null;
        } 
    }  

    const convertDatasets = () => {
        let datasets = [];
        datas.map((element, index) => {
            const dsObject = {
                label: `Quỹ ${String.fromCharCode(index + 65)}`,
                data: element,
                fill: false,
                borderColor: colors[index % colors.length],
                borderWidth: 2,
                pointBackgroundColor: colors[index % colors.length],
                pointHoverBorderColor: hexToRgba(colors[index % colors.length], 0.2),
                pointHoverBorderWidth: 15,
                lineTension: 0,
            }
            datasets.push(dsObject);
        })
        return datasets;
    }

    const generateLegend = () => {
        return datas.map((element, index) => {
            return (
                <div className="legend-item">
                    <div className="legend-rectangle" 
                    style={{backgroundColor: hexToRgba(colors[index % colors.length], 1)}}></div>
                    <label>{`Quỹ ${String.fromCharCode(index + 65)}`}</label>
                </div>
            )
        })
    }

    return (
        <div className="chart-box">
            <div className={`chart-legend justify-content-end ${ticks >= 3 ? 'show' : 'hidden'}`}>
                {generateLegend()}
            </div>

            <div style={{width: '100%', height: '367px', margin: 0}}>
                <Line
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        tooltips: {
                            // mode: 'point',
                            // intersect: false,
                            // caretSize: 0,
                            // xPadding: 10,
                            // yPadding: 15,
                            // backgroundColor: "#FFF",
                            // borderColor: colors[0],
                            // borderWidth: 1,
                            // titleFontColor: "#000",
                            // titleAlign: 'center',
                            // bodyFontColor: "#000",
                            // bodyAlign: "center",
                            // displayColors: false,
                            // titleFontFamily: 'Montserrat',
                            // titleFontStyle: 'normal',
                            // titleFontSize: 14,
                            // bodyFontFamily: 'Montserrat',
                            // bodyFontStyle: 'normal',
                            // bodyFontSize: 14,
                            // titleMarginBottom: 15,
                            // callbacks: {
                            //     label: (tooltipItem, data) => {
                            //         return `Giá trị quỹ: ${tooltipItem.yLabel}`;
                            //     },
                            //     title: (item, data) => {
                            //         return `Ngày: ${item[0].label}`;
                            //     }
                            // }

                            enabled: false,
                            custom: function(tooltipModel) {
                                // Tooltip Element
                                var tooltipEl = document.getElementById('chartjs-tooltip');

                                // Create element on first render
                                if (!tooltipEl) {
                                    tooltipEl = document.createElement('div');
                                    tooltipEl.id = 'chartjs-tooltip';
                                    tooltipEl.innerHTML = '<table></table>';
                                    document.body.appendChild(tooltipEl);
                                }

                                // Hide if no tooltip
                                if (tooltipModel.opacity === 0) {
                                    tooltipEl.style.opacity = 0;
                                    return;
                                }

                                // Set caret Position
                                tooltipEl.classList.remove('above', 'below', 'no-transform');
                                if (tooltipModel.yAlign) {
                                    tooltipEl.classList.add(tooltipModel.yAlign);
                                } else {
                                    tooltipEl.classList.add('no-transform');
                                }

                                function getBody(bodyItem) {
                                    return bodyItem.lines;
                                }

                                // Set Text
                                if (tooltipModel.body) {
                                    var titleLines = tooltipModel.title || [];
                                    var bodyLines = tooltipModel.body.map(getBody);

                                    const borderColor = tooltipModel.labelColors.map(item => item.backgroundColor);

                                    tooltipEl.style.border = `2px solid ${borderColor[0]}`;

                                    var innerHtml = '<thead>';

                                    titleLines.forEach(function(title) {
                                        innerHtml += `<tr><th class="tooltil-css tooltip-title">Ngày: ${title}</th></tr>`;
                                    });
                                    innerHtml += '</thead><tbody>';

                                    bodyLines.forEach(function(body, i) {
                                        const content = `Giá trị ${body.toString().replace('Q', 'q')}`;
                                        innerHtml += `<tr><td class="tooltil-css tooltip-content">${content}</td></tr>`;
                                    });
                                    innerHtml += '</tbody>';

                                    var tableRoot = tooltipEl.querySelector('table');
                                    tableRoot.innerHTML = innerHtml;
                                }

                                // `this` will be the overall tooltip
                                var position = this._chart.canvas.getBoundingClientRect();

                                // Display, position, and set styles for font
                                const tooltipElOffset = 10;
                                tooltipEl.style.minHeight = '60px';
                                tooltipEl.style.minWidth = '166px';
                                
                                tooltipEl.style.opacity = 1;
                                tooltipEl.style.position = 'absolute';
                                tooltipEl.style.right = position.right + window.pageXOffset - tooltipModel.caretX + tooltipElOffset + 'px';
                                tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY - parseInt(tooltipEl.style.minHeight) - tooltipElOffset + 'px';
                                tooltipEl.style.pointerEvents = 'none';
                            }
                        },
                        scales: {
                            xAxes: [{
                                display: true,
                                ticks: {
                                    fontSize: 16,
                                    fontColor: 'black',
                                    fontFamily: 'Montserrat',
                                    padding: 15,
                                    maxTicksLimit: ticks,
                                    maxRotation: 0
                                }
                            }],
                            yAxes: [{
                                display: true,
                                ticks: {
                                    fontSize: 16,
                                    fontColor: 'black',
                                    fontFamily: 'Montserrat',
                                    beginAtZero: false,
                                    padding: 15,
                                    stepSize: 0.02
                                }
                            }]
                        },
                        legend: {
                            display: false,
                            align: 'end',
                        },
                        
                    }}
                    data={{
                        labels: labels,
                        datasets: convertDatasets()
                    }}
                />
            </div>
            <div className={`chart-legend justify-content-start ${ticks < 3 ? 'show' : 'hidden'}`}>
                {generateLegend()}
            </div>
        </div>
    );
}

export default LineChart;