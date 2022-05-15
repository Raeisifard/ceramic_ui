<template>
  <div style="margin: 0px 0px; height: 100%; width: 100%">
    <div class="flex-dist" style="margin: 2px 10px;">
      <div style="">
        <Label for="period_id" align="center">Period:</Label>
        <NumberBox inputId="period_id" v-model="period" suffix="ms" :increment="1000" :value="0" :min="0"
                   :max="99000000">
          <Addon>
            <span v-if="period!=null" class="textbox-icon icon-clear" @click="period=null"></span>
          </Addon>
        </NumberBox>
      </div>
      <div>
        <Label for="delay_id" align="center" style="margin-left: 50px;">Delay:</Label>
        <NumberBox inputId="delay_id" v-model="delay" suffix="ms" :increment="100" :value="0" :min="0"
                   :max="3600000">
          <Addon>
            <span v-if="delay!=null" class="textbox-icon icon-clear" @click="delay=null"></span>
          </Addon>
        </NumberBox>
      </div>
    </div>
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
  name: "dialogTriggerSetting",
  components: {},
  data() {
    return {
      period: 0,
      delay: 0,
      data: this.cell.getData(),
      options: {},
      editor: null,
      styleObject: { height: this.cmd.style.height - 98 + 'px' },
    }
  },
  props: ['cell', 'cmd'],
  //computed: {},
  methods: {
    settingOk(evt) {
      let setting = this.editor.get();
      setting._ = this.data.setting._
      setting._.period = this.period;
      setting._.delay = this.delay;
      this.data.setting = setting;
      this.$emit('close');
    },
  },
  mounted() {
    this.period = this.data.setting._.period;
    this.delay = this.data.setting._.delay;
    this.options = {
      mode: 'tree',
      modes: ['tree', 'view', 'form', 'code', 'text']
    };
    this.editor = new JSONEditor(this.$refs.jsoneditor, this.options);
    let cloneSetting = Object.assign({}, this.data.setting);
    delete cloneSetting._
    this.editor.set(cloneSetting);
  },
  computed: {
    updateStyleObject: function(){
      this.styleObject = { height: this.cmd.style.height - 66 + 'px', width: this.cmd.style.width - 2 + 'px' };
      return this.styleObject;
    }
  }/*,
  watch: {
    "cmd.style.height": function(oldVal, newVal) {
      console.log(oldVal + " " + newVal);
    }
  }*/
}
</script>

<style scoped>
* {
  user-select: none;
}

.f-full {
  flex-direction: column;
  display: flex;
  margin: 10px 10px 0 10px;
}

.button-dark {
  background: url(/src/images/button-dark.gif) repeat-x;
  width: 60px;
  margin-top: 5px;
}

label {
  padding-right: 5px;
}

.flex-dist {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.textbox-label {
  width: unset;
}

.mxWindowPane{
  overflow: unset;
}

.mxWindow{
  overflow: visible;
}
</style>