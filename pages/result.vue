<template>
  <div>
  <div>
    {{ content }}
    {{ currentHooverPos }}
    {{ cleanedPatchSet.size}}
    {{ hooverPositions }}
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex'
import { mapActions } from 'vuex'
export default {
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
    // this.makeRows(this.dims[0], this.dims[1])
    this.makeRows(this.dims[0], this.dims[1])
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
    })
  }
}
</script>

<style scoped>

</style>
