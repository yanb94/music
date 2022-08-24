import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

function createChart(selector)
{
    /**
     * @type HTMLElement
     */
    const ctx = document.querySelector(selector)

    const datas = eval(ctx.dataset.datas)
    const labels = eval(ctx.dataset.labels)

    const myChart = new Chart(ctx,{
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: "Nombre d'écoutes",
                data: datas,
                borderWidth: 1,
                backgroundColor: "#fff",
                fill: false,
                borderWidth: 4,
                borderColor:'rgb(0,191,255,0.7)'
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })
}

createChart("#statsChart")