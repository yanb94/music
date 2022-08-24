import "./styles/admin.scss"
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

function createChart(selector,type,label,backgroundColor="#fff",borderColor="rgb(0,191,255,0.7)",fill=false)
{
    /**
     * @type HTMLElement
     */
    const ctx = document.querySelector(selector)

    const datas = eval(ctx.dataset.datas)
    const labels = eval(ctx.dataset.labels)

    const myChart = new Chart(ctx,{
        type: type,
        data: {
            labels: labels,
            datasets: [
                {
                    label: label,
                    data: datas,
                    borderWidth: 1,
                    backgroundColor: backgroundColor,
                    fill: fill,
                    borderWidth: 4,
                    borderColor: borderColor
                }
            ]
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

createChart("#dailyViewSong",'line',"Nombre d'écoutes")
createChart("#dailyViewPlaylist",'line',"Nombre d'écoutes")
createChart('#monthlyInvoice','bar',"Montant des factures","rgb(0,191,255,0.7)","#fff",true)