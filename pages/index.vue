<template>
  <b-container>
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
    </div>
  </b-container>
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
      resetResultState: 'result/resetResultState',
      changeFileLoaded: 'result/changeFileLoaded'
    }),
    loadDefaultData () {
      this.fileInput = this.defaultText.split(/\r?\n/)
      this.setInstructions(this.fileInput)
    }
  },
  mounted () {
    this.resetResultState()
    this.changeFileLoaded()
  }
}
</script>

<style scoped>
.container {
  margin: 5em auto;
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
h1.title {
  padding-top: 3em;
}
</style>
