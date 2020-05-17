<template>
  <div>
    <client-only>
      <VLazyImage
        class="trayimage"
        src="trayio.png"
        src-placeholder="trayiotiny.png"
      />
    </client-only>
  </div>
</template>
<style>
</style>

<script>
import VLazyImage from 'v-lazy-image'
export default {
  components: {
    VLazyImage
  }
}
</script>

<style scoped>
.trayimage{
  width:15em;
}
.v-lazy-image {
  filter: blur(20px);
  transition: filter 1.1s;
}

.v-lazy-image-loaded {
  filter: blur(0);
}
</style>
