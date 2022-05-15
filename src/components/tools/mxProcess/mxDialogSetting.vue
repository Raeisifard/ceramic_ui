<template>
  <div style="display: flex; flex-direction: column;">
    <div ref="jsoneditor" :style="{height: height}"></div>
    <div style="display: flex;justify-content: space-around;
    background: url(src/images/window-title.gif) repeat-x; background-size: auto 100%; height: 30px; padding-bottom: 5px;">
      <button class="button-dark" style="color: mediumspringgreen;"
              @click="send">Send
      </button>
      <button class="button-dark" style="color: #4cbdff;"
              @click="save">Save
      </button>
      <button class="button-dark" style="color: gold;"
              @click="cancel">Cancel
      </button>
    </div>
  </div>
</template>

<script>
import "jsoneditor/dist/jsoneditor.min.css";
import JSONEditor from 'jsoneditor/dist/jsoneditor.min.js';

export default {
  name: "dialogSetting",
  components: {},
  data() {
    return {
      value: 0,
      config: {},
      setting: this.cell.getData().setting,
      options: {},
      editor: null,
      background: null,
      wndSetting: null,
      graph: this.$store.getters.getGraph,
      height: '235px',
    }
  },
  props: ['cell'],
  methods: {
    getBackground: function() {
      let background = document.createElement('div');
      background.style.position = 'absolute';
      background.style.left = '0px';
      background.style.top = '0px';
      background.style.right = '0px';
      background.style.bottom = '0px';
      background.style.background = 'black';
      background.style.zIndex = '1';
      mxUtils.setOpacity(background, 50);
      return background;
    },
    save(evt) {
      this.cell.data.setting = { ...this.editor.get() };
    },
    send(evt) {
      this.save();
      this.$store.dispatch("sendSetting2VX", this.cell);
      this.wndSetting.destroy();
    },
    cancel(evt) {
      this.wndSetting.destroy();
    }
  },
  mounted() {
    let that = this;
    this.options = {
      mode: 'tree',
      modes: ['tree', 'view', 'form', 'code', 'text']
    };
    this.editor = new JSONEditor(this.$refs.jsoneditor, this.options);
    this.editor.set(this.setting);
    this.background = this.getBackground();
    document.body.appendChild(this.background);
    if (mxClient.IS_IE) {
      new mxDivResizer(this.background);
    }
    let width = 500;
    let height = 290;
    let x = Math.max(0, document.body.scrollWidth / 2 - width / 2);
    let y = Math.max(10, ( document.body.scrollHeight ||
        document.documentElement.scrollHeight ) / 2 - height * 2 / 3);
    this.wndSetting = new mxWindow("Process Settings", this.$el, x, y, width, height, false, true);
    this.wndSetting.setClosable(true);
    this.wndSetting.setResizable(true);
    this.wndSetting.minimumSize = new mxRectangle(0, 0, 460, 280);
    this.wndSetting.destroyOnClose = true;
    this.graph.setEnabled(false);
    this.graph.tooltipHandler.hide();
    this.wndSetting.setVisible(true);
    this.wndSetting.table.nextSibling.style.right = 0
    this.wndSetting.div.style.overflow = 'visible';
    this.wndSetting.content.parentElement.style.overflow = 'unset';
    this.wndSetting.addListener(mxEvent.DESTROY, function(evt) {
      that.graph.setEnabled(true);
      mxEffects.fadeOut(that.background, 50, true, 10, 30, true);
      that.$emit('close');
    });
    this.wndSetting.addListener(mxEvent.RESIZE, function(evt) {
      that.height = ( evt.div.offsetHeight - 55 ) + 'px';
    });
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
</style>