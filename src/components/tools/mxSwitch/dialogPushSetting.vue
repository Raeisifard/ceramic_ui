<template>
  <div style="margin: 0px 0px; height: 100%; width: 100%">
    <div ref="jsoneditor" :style="updateStyleObject">

    </div>
    <div style="display: flex;justify-content: space-around; background: url(src/images/window-title.gif) repeat-x;
                background-size: auto 100%; padding-bottom: 6px;margin-right: 2px;">
      <button class="button-dark" tabindex="11" style="color: mediumspringgreen;"
              @click="settingOk">OK
      </button>
      <button class="button-dark" tabindex="12" style="color: gold;"
              @click="$emit('close')">Cancel
      </button>
    </div>
  </div>
</template>

<script>
import "jsoneditor/dist/jsoneditor.min.css";
import JSONEditor from 'jsoneditor/dist/jsoneditor.min.js';

export default {
  name: "dialogPushSetting",
  components: {},
  data() {
    return {
      data: this.cell.getData(),
      options: {},
      editor: null,
      styleObject: { height: this.cmd.style.height - 31 + 'px' },
    }
  },
  props: ['cell', 'cmd'],
  methods: {
    settingOk(evt) {
      let setting = this.editor.get();
      this.data.setting = setting;
      this.$emit('close');
    },
  },
  mounted() {
    this.options = {
      mode: 'tree',
      modes: ['tree', 'view', 'form', 'code', 'text']
    };
    this.editor = new JSONEditor(this.$refs.jsoneditor, this.options);
    this.editor.set(this.data.setting);
  },
  computed: {
    updateStyleObject: function(){
      this.styleObject = { height: this.cmd.style.height - 31 + 'px', width: this.cmd.style.width - 2 + 'px' };
      return this.styleObject;
    }
  }
}
</script>

<style scoped>
* {
  user-select: none;
}

.button-dark {
  background: url(/src/images/button-dark.gif) repeat-x;
  width: 60px;
  margin-top: 5px;
}

label {
  padding-right: 5px;
}
</style>