<template>
  <div>
    <div>
      <b-navbar variant="faded" type="light">
        <b-navbar-brand :to="{ name: 'index' }" class="navbarTray">
          <img src="trayio.png" class="d-inline-block align-top" alt="TrayioLogo">
          Hoover Run Results
        </b-navbar-brand>
        <b-button :to="{ name: 'index' }" class="defaultButton">Reset</b-button>
      </b-navbar>
    </div>
    <div>
      <b-card-group deck>
        <b-card
          title="End Hoover Position"
          img-src="roomba.png"
          img-alt="Roomba"
          img-top
          style="max-width: 14rem;margin:0 auto;"
          class="mb-2"
        >
          <b-card-text>
            {{ currentHooverPos }}
          </b-card-text>
        </b-card>
        <b-card
          title="Patches of Dirt Cleaned"
          img-src="dust.png"
          img-alt="dust"
          img-top
          style="max-width: 14rem;margin:0 auto;"
          class="mb-2"
        >
          <b-card-text>
            {{ cleanedPatchSet.size }}
          </b-card-text>
        </b-card>
        <b-card
          title="Current Roomba Position"
          img-src="journey.png"
          img-alt="journey"
          img-top
          style="max-width: 14rem;margin:0 auto;"
          class="mb-2"
        >
          <b-card-text v-if="startRun">
            {{ hooverPositions[counter] }}
          </b-card-text>
          <b-card-text v-if="!startRun">
            Run Hoover To Start Position Finding
          </b-card-text>
        </b-card>
        <b-card
          title="Next Cardinal Move"
          img-src="compass.png"
          img-alt="compass"
          img-top
          style="max-width: 14rem;margin:0 auto;"
          class="mb-2"
        >
          <b-card-text v-if="startRun">
            {{ drivingInstructions[counter] }}
          </b-card-text>
          <b-card-text v-if="!startRun">
            Run Hoover To Give Cardinal Direction
          </b-card-text>
        </b-card>
      </b-card-group>
    </div>
    <client-only>
      <div class="bar-chart">
        <Scatterplot v-if="loaded" :chartData="ChartData" :options="options" />
      </div>
    </client-only>
    <b-container>
      <b-row class="justify-content-md-center">
        <b-button v-if="!startRun" class="defaultButton groupButton" @click="animateData">Run Hoover</b-button>
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
      fileLoadedFromMain: state => state.result.fileLoadedFromMain,
      drivingInstructions: state => state.result.drivingInstructions
    })
  },
  mounted () {
    // runs action and mutation necessary to run hoover through all the cardinal direction it was given from the input file.
    // Data then gets loaded to the graph from the results of the run and gets displayed.
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
          left: 30,
          right: 30,
          top: 30,
          bottom: 30
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
    // If the user did not load a file, redirect to index
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
    // function that gets called when you want to play through the graph animation. It loads additional data on the graph.
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
    // function that is used when clicking on the next button of the graph. This moves the hoover by updating the graph data.
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
    // function that is used when clicking on the previous button of the graph. This moves the hoover by updating the graph data.
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
  width: 100%;
  height: 100%;
  max-width: 800px;
  margin-top: 30px;
  margin:auto;
}
.container{
  min-height: auto;
}
.defaultButton{
  margin-right:auto !important;
}
 button[disabled] {
      pointer-events: none;
}
.navbarTray{
  font-size: 2em;
}
.navbarTray img {
  width: 1.5em;
}
p.card-text {
  text-align: center;
  font-weight: 600;
}
h4.card-title {
  text-align: center;
  font-weight: 900;
  font-size: 1.2rem;
}
.card-deck {
  margin-left:0;
  margin-right:0;
}
</style>
