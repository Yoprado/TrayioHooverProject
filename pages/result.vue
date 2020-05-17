<template>
  <div>
    {{ content }}
    {{ currentHooverPos }}
    {{ cleanedPatchSet.size}}
    {{ hooverPositions }}
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'
export default {
  computed: {
    ...mapState({
      content: state => state.result.hooverInstructions,
      currentHooverPos: state => state.result.currentHooverPos,
      hooverPositions: state => state.result.hooverPositions,
      hooverInstructions: state => state.result.hooverInstructions,
      dirtPatchSet: state => state.result.dirtPatchSet,
      cleanedPatchSet: state => state.result.cleanedPatchSet
    }),
    ...mapGetters({
      cleanedCount: 'result/getCleanedCount'
    })
  },
  mounted () {
    this.runInstructions()
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
