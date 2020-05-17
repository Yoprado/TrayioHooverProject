<template>
  <div>
    <div>
      {{ content }}
      {{ currentHooverPos }}
      {{ cleanedPatchSet.size}}
      {{ hooverPositions }}
    </div>
    <client-only>
      <div class="bar-chart">
        <Scatterplot v-if="loaded" :chartData="ChartData" :options="options" />
      </div>
    </client-only>
        <b-container>
    <b-row class="justify-content-md-center">
    <b-button v-if="!startRun" class="defaultButton" @click="animateData">Run Hoover</b-button>
    <b-button :disabled="(counter===0)" v-if="startRun" class="defaultButton groupButton" @click="prevAction">Previous Action</b-button>
    <b-button :disabled="(counter>(this.dataPoints.length-2))" v-if="startRun" class="defaultButton groupButton" @click="nextAction">Next Action</b-button>
    </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mapActions } from 'vuex'
import Scatterplot from '~/components/scatterplot'
export default {
  components: {
    Scatterplot
  },
  data () {
    return {
      ChartData: null,
      loaded: false,
      options: null,
      dataPoints: null,
      dirtyPatchPoints: null,
      cleanPatchPoints: null,
      startRun: false,
      counter: 0
    }
  },
  computed: {
    ...mapState({
      content: state => state.result.hooverInstructions,
      currentHooverPos: state => state.result.currentHooverPos,
      hooverPositions: state => state.result.hooverPositions,
      hooverInstructions: state => state.result.hooverInstructions,
      dirtPatchSet: state => state.result.dirtPatchSet,
      cleanedPatchSet: state => state.result.cleanedPatchSet,
      dims: state => state.result.dimensions,
      fileLoadedFromMain: state => state.result.fileLoadedFromMain
    })
  },
  mounted () {
    this.runInstructions()
    this.dirtyPatchPoints = (Array.from(this.dirtPatchSet)).map(coord => this.convertSetStringToCoordinates(coord))
    this.cleanPatchPoints = (Array.from(this.cleanedPatchSet)).map(coord => this.convertSetStringToCoordinates(coord))
    this.loaded = false
    this.dataPoints = this.hooverPositions.map((coord) => { return { x: coord[0], y: coord[1] } })
    this.ChartData = {
      datasets: [
        {
          label: 'Hoover Movement',
          backgroundColor: '#0DBF73',
          pointRadius: 15,
          // data: this.hooverPositions.map((coord) => { return { x: coord[0], y: coord[1] } })
          data: []
        },
        {
          label: 'Dirty Patches',
          backgroundColor: '#1A1A3B',
          pointRadius: 25,
          data: this.dirtyPatchPoints.map((coord) => { return { x: coord[0], y: coord[1] } })
        },
        {
          label: 'Cleaned Patches',
          backgroundColor: '#37996F',
          pointRadius: 25,
          data: this.cleanPatchPoints.map((coord) => { return { x: coord[0], y: coord[1] } })
        }
      ]
    }
    this.options = {
      legend: {
        position: 'bottom'
      },
      layout: {
        padding: {
          left: 20,
          right: 20,
          top: 20,
          bottom: 20
        }
      },
      tooltips: {
        enabled: false,
        callbacks: {
          label (tooltipItem, data) {
            let label = tooltipItem.index
            if (!label) {
              label = '0'
            }
            return label
          }
        }
      },
      plugins: {
        datalabels: {
          display (context) {
            if (context.datasetIndex === 0) {
              return 'auto'
            } else {
              return false
            }
          },
          formatter (value, context) {
            if (context.datasetIndex === 0) {
              return context.dataIndex
            } else {
              return ''
            }
          }
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            max: this.dims[1] - 1,
            stepSize: 1
          }
        }
        ],
        xAxes: [{
          ticks: {
            beginAtZero: true,
            max: this.dims[0] - 1,
            stepSize: 1
          }
        }]
      }
    }
    this.loaded = true
  },
  middleware ({ store, redirect }) {
    // If the user is not authenticated
    if (!store.state.result.fileLoadedFromMain) {
      return redirect('/')
    }
  },
  methods: {
    ...mapActions({
      runInstructions: 'result/runInstructions'
    }),
    convertSetStringToCoordinates (str) {
      const coords = str.split(',').map(str => parseInt(str))
      return coords
    },
    animateData () {
      this.startRun = true
      this.ChartData = {
        datasets: [
          {
            label: 'Hoover Movement',
            backgroundColor: '#0DBF73',
            pointRadius: 15,
            data: [this.dataPoints[0]]
          },
          {
            label: 'Dirty Patches',
            backgroundColor: '#1A1A3B',
            pointRadius: 25,
            data: this.dirtyPatchPoints.map((coord) => { return { x: coord[0], y: coord[1] } })
          },
          {
            label: 'Cleaned Patches',
            backgroundColor: '#37996F',
            pointRadius: 25,
            data: this.cleanPatchPoints.map((coord) => { return { x: coord[0], y: coord[1] } })
          }
        ]
      }
    },
    nextAction () {
      this.counter++
      const newArr = []
      newArr.push(this.dataPoints[this.counter])
      for (let i = 0; i < this.counter; i++) {
        newArr.unshift(null)
      }
      this.ChartData = {
        datasets: [
          {
            label: 'Hoover Movement',
            backgroundColor: '#0DBF73',
            pointRadius: 15,
            data: newArr
          },
          {
            label: 'Dirty Patches',
            backgroundColor: '#1A1A3B',
            pointRadius: 25,
            data: this.dirtyPatchPoints.map((coord) => { return { x: coord[0], y: coord[1] } })
          },
          {
            label: 'Cleaned Patches',
            backgroundColor: '#37996F',
            pointRadius: 25,
            data: this.cleanPatchPoints.map((coord) => { return { x: coord[0], y: coord[1] } })
          }
        ]
      }
    },
    prevAction () {
      this.counter--
      const newArr = []
      newArr.push(this.dataPoints[this.counter])
      for (let i = 0; i < this.counter; i++) {
        newArr.unshift(null)
      }
      this.ChartData = {
        datasets: [
          {
            label: 'Hoover Movement',
            backgroundColor: '#0DBF73',
            pointRadius: 15,
            data: newArr
          },
          {
            label: 'Dirty Patches',
            backgroundColor: '#1A1A3B',
            pointRadius: 25,
            data: this.dirtyPatchPoints.map((coord) => { return { x: coord[0], y: coord[1] } })
          },
          {
            label: 'Cleaned Patches',
            backgroundColor: '#37996F',
            pointRadius: 25,
            data: this.cleanPatchPoints.map((coord) => { return { x: coord[0], y: coord[1] } })
          }
        ]
      }
    }
  }
}
</script>

<style scoped>
 .bar-chart {
  width: 50%;
  height: 50%;
  margin-top: 30px;
  margin: auto;
}
.container{
  min-height: auto;
}
.defaultButton{
  margin-right:5px;
}
</style>
