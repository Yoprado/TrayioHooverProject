<template>
  <div class="container">
    <div>
      <logo />
      <h1 class="title">
        Tray.io Project Hoover
      </h1>
      <h2 class="subtitle">
        To Get Started, Click On An Option Below
      </h2>
      <div class="links">
        <b-button class="defaultButton" :to="{ name: 'result' }" >Use Default File</b-button>
        <label for="file-upload" class="custom-file-upload">
          <i class="fa fa-cloud-upload"></i> Upload Custom File
        </label>
        <b-form-file v-model="file" id="file-upload" ref="myFile"  plain></b-form-file>
      </div>
      <b-form-checkbox
        class="visualCheckbox"
        v-model="status"
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
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  },
  data () {
    return {
      file: null,
      status: false,
      fileInput: []
    }
  },
  watch: {
    file (val) {
      const reader = new FileReader()
      reader.readAsText(val, 'UTF-8')
      reader.onload = (evt) => {
        const text = evt.target.result
        this.fileInput = text.split(/\r?\n/)
      }
      reader.onerror = (evt) => {
        console.error(evt)
      }
    }
  },
  methods: {
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
  font-size: 100px;
  color: #1a1a3b;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
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
.defaultButton{
  background-color: var(--button-color);
  color: #ffffff;
  border: none;
  font-size: 1.2rem;
  border-radius: 4px;
  font-family: Akkurat, Helvetica, sans-serif;
}
.defaultButton:hover{
  background-color: var(--button-color-selected);
}

input[type="file"] {
    display: none;
}
.custom-file-upload {
    border: 1px solid var(--button-color);
    display: inline-block;
    padding: 5px 11px;
    color: var(--button-color);
    cursor: pointer;
    font-size: 1.2rem;
    border-radius: 4px;
    margin: 0 0 0 0;
    font-family: Akkurat, Helvetica, sans-serif;
}
.custom-file-upload:hover {
  background-color: var(--button-color-selected);
  color: #ffffff;
}
.visualCheckbox{
  margin-top:.75rem;
}
</style>
