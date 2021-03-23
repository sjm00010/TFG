<template>
    <div>
        <highcharts ref="grafico" :options="configGrafica"></highcharts>
    </div>
</template>

<script>
import { Chart } from "highcharts-vue";
import { linea0 } from '@/assets/js/vigas/calculos.js';
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
        },
        unidad: {
            type: String,
            required: true
        },
        precision: {
            type: Number,
            required: true
        },
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
                        text: 'Magnitud ('+this.unidad+')',
                    }
                },
                xAxis: [{
                    title: {
                        text: 'Distancia (m)'
                    },
                }],
                tooltip: {
                    formatter: ((unidad, precision) => function () {
                        if(precision > 3){
                            return this.points.reduce(function (s, point) {
                                if(point.series.name !== '0')
                                    return s + '<br/><b>' + point.series.name + '</b>: ' + point.y.toExponential(precision).replace(/(-?[0-9]*\.[0-9]*)e?([-+]?[0-9]*)/, '$1·10^($2) ')+unidad;
                                else
                                    return s; 
                            }, '<b>x</b>: '+ this.x+' m');
                            
                        }else{
                            return this.points.reduce(function (s, point) {
                                if(point.series.name !== '0')
                                    return s + '<br/><b>' + point.series.name + '</b>: ' + parseFloat(point.y.toFixed(precision)) + ' '+unidad;
                                else
                                    return s;
                            }, '<b>x</b>: '+ this.x+' m');
                        }
                        
                    })(this.unidad, this.precision),
                    shared: true
                },
                series: [
                    {
                        name: this.titulo,
                        data: this.datos,
                        color: this.color
                    },
                    {
                        name: '0',
                        data: linea0(),
                        color: 'black',
                        marker: {
                            enabled: false,
                            symbol: 'circle',
                            radius: 3,
                            states: {
                                hover: {
                                    enabled: false
                                }
                            }
                        }
                    },
                ],
                responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 500
                        },
                        chartOptions: {
                            legend: {
                                layout: 'horizontal',
                                align: 'center',
                                verticalAlign: 'bottom'
                            }
                        }
                    }]
                }
            }
        };
    }
}
</script>