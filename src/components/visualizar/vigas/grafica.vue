<template>
    <div>
        <highcharts ref="grafico" :options="configGrafica"></highcharts>
    </div>
</template>

<script>
import { Chart } from "highcharts-vue";
export default {
    name: 'grafica',
    props: {
        datos: {
            type: Array,
            required: true
        },
        titulo: {
            type: String,
            required: true
        },
        color: {
            type: String,
            required: true
        },
        invertida: {
            type: Boolean,
            required: true
        }
    },
    components:{
        highcharts: Chart,
    },
    data() {
        return{
            configGrafica: {
                title: {
                    text: this.titulo
                },
                yAxis: { // Eje principal
                    reversed: this.invertida,
                    title: {
                        text: 'Magnitud',
                    },
                    labels: {
                        format: '{value}',
                    }
                },
                xAxis: [{
                    title: {
                        text: 'Distancia (m)'
                    },
                    crosshair: true
                }],
                tooltip: {
                    formatter: function () {
                        return this.points.reduce(function (s, point) {
                            return s + '<br/><b>' + point.series.name + '</b>: ' + point.y;
                        }, '<b>x</b>:'+ this.x+' m');
                    },
                    shared: true,
                },
                series: [
                    {
                        name: this.titulo,
                        data: this.datos,
                        color: this.color
                    }
                ],
            },
        };
    }
    
}
</script>