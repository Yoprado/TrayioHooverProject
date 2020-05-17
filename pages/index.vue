<template>
  <div class="container">
    <div>
      <div class="wrapper">
        <logo />
      </div>
      <h1 class="title">
        Tray.io Project Hoover
      </h1>
      <h2 class="subtitle">
        To Get Started, Click On An Option Below
      </h2>
      <div class="links">
        <b-button class="defaultButton" :to="{ name: 'result' }" @click="loadDefaultData">Use Default File</b-button>
        <label for="file-upload" class="custom-file-upload">
          <i class="fa fa-cloud-upload"></i> Upload Custom File
        </label>
        <b-form-file v-model="file" id="file-upload" ref="myFile"  plain></b-form-file>
      </div>
      <b-form-checkbox
        v-model="status"
        class="visualCheckbox"
        name="checkbox-1"
        value="true"
        unchecked-value="false"
      >
        Visualize Hoover Activity
      </b-form-checkbox>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import txt from '@/static/input.txt'
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  },
  data () {
    return {
      file: null,
      status: false,
      fileInput: [],
      defaultText: txt
    }
  },
  computed: {
  },
  watch: {
    file (val) {
      const reader = new FileReader()
      reader.readAsText(val, 'UTF-8')
      reader.onload = (evt) => {
        const text = evt.target.result
        this.fileInput = text.split(/\r?\n/)
        this.setInstructions(this.fileInput)
        this.setVisualizeBoolean(this.status)
        this.$router.push('result')
      }
      reader.onerror = (evt) => {
        console.error(evt)
      }
    }
  },
  methods: {
    ...mapActions({
      setInstructions: 'result/setInstructions',
      setVisualizeBoolean: 'result/setVisualizeBoolean',
      resetResultState: 'result/resetResultState'
    }),
    loadDefaultData () {
      this.fileInput = this.defaultText.split(/\r?\n/)
      this.setInstructions(this.fileInput)
      this.setVisualizeBoolean(this.status)
    }
  },
  mounted () {
    this.resetResultState()
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Brown","Helvetica",sans-serif;
  display: block;
  font-weight: 300;
  font-size: 5rem;
  color: #1a1a3b;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 2rem;
  color: #1a1a3b;
  word-spacing: 5px;
  padding-bottom: 15px;
  font-family: "Brown","Helvetica",sans-serif;
}

.links {
  padding-top: 15px;
}

.importFile {
  width:inherit;
  display: inline-block;
}
input[type="file"] {
    display: none;
}
.custom-file-upload {
    border: 1px solid var(--button-color);
    display: inline-block;
    padding: 4px 11px 6px 11px;
    margin-top: 2px;
    color: var(--button-color);
    cursor: pointer;
    font-size: 1.2rem;
    border-radius: 4px;
    margin: 0 0 0 0;
    font-family: Akkurat, Helvetica, sans-serif;
}
.custom-file-upload:hover {
  background-color: var(--button-color-selected);
  border: 1px solid var(--button-color-selected);
  color: #ffffff;
}
.visualCheckbox{
  margin-top:.75rem;
}
.wrapper {
  position: relative;
  height: 0;
  padding-top: calc(100 / 100 * 25%);
}
.wrapper img {
  position: absolute;
  top: 0;
  left: 37%;
  max-width: 100%;
  height: auto;
}

@media screen and (max-width: 990px) {
  .wrapper {
  position: relative;
  height: 0;
  padding-top: calc(100 / 100 * 35%);
}
}

@media screen and (max-width: 767px) {
  .wrapper {
  position: relative;
  height: 0;
  padding-top: calc(100 / 100 * 45%);
}
.wrapper img {
  position: absolute;
  top: 0;
  left: 33%;
  max-width: 100%;
  height: auto;
}
}
</style>
