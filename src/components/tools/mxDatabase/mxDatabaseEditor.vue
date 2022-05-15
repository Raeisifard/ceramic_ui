<template>

</template>

<script>
import mxSqlEditor from "./QueryEditors/mxSqlEditor"

export default {
  name: "mxDatabaseEditor",
  components: {},
  props: ['cell'],
  data() {
    return {
      _editor: null,
      background: null,
      wndEditor: null,
      graph: this.$store.getters.getEditor.graph,
      mxRectangle: new mxRectangle(0, 0, 0, 0)
    }
  },
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
    showModalEditorWindow: function(graph, title, content, width, height) {
      let that = this;
      this.background = this.getBackground();
      document.body.appendChild(this.background);
      if (mxClient.IS_IE) {
        new mxDivResizer(this.background);
      }
      let x = Math.max(0, document.body.scrollWidth / 2 - width / 2);
      let y = Math.max(10, ( document.body.scrollHeight ||
          document.documentElement.scrollHeight ) / 2 - height * 2 / 3);
      this.wndEditor = new mxWindow(title, content, x, y, width, height, false, true);
      this.wndEditor.addListener(mxEvent.RESIZE, function(evt) {
        //console.dir(evt);
        let content = evt.content;
        that.mxRectangle.height = content.offsetHeight;
        that.mxRectangle.width = content.offsetWidth;
      });
      this.wndEditor.setClosable(true);
      this.wndEditor.destroyOnClose = true;
      this.wndEditor.setResizable(true);
      let minRect = new mxRectangle(0, 0, 440, 140);
      this.wndEditor.minimumSize = minRect;

      graph.setEnabled(false);
      graph.tooltipHandler.hide();
      this.wndEditor.setVisible(true);
      this.mxRectangle.height = this.wndEditor.content.offsetHeight;
      this.mxRectangle.width = this.wndEditor.content.offsetWidth;

      this.wndEditor.addListener(mxEvent.DESTROY, function(evt) {
        graph.setEnabled(true);
        // Fades the background out after after the window has been closed
        mxEffects.fadeOut(that.background, 50, true, 10, 30, true);
        that.$emit('close');
      });
    },
  },
  computed: {
    getCell: function() {
      return this.cell;
    }
  },
  mounted() {
    let that = this;
    switch (this.cell.getData().dbType.toLowerCase()) {
      case 'sqlserver':
        this._editor = {
          components: { mxSqlEditor },
          props: ['mxRectangle', 'cell'],
          template: '<mx-sql-editor :cell="cell" :mxRectangle="mxRectangle" @ok="editorOk()" @cancel="editorCancel"></mx-sql-editor>',
          methods: {
            editorCancel: function() {
              that.wndEditor.destroy();
              that.graph.setEnabled(true);
              mxEffects.fadeOut(that.background, 50, true, 10, 30, true);
              that.$emit('close');
            },
            editorOk: function() {
              that.wndEditor.destroy();
              that.graph.setEnabled(true);
              mxEffects.fadeOut(that.background, 50, true, 10, 30, true);
              that.$emit('close');
            }
          },
        };
        break;
    }
    const ComponentClass = Vue.extend(this._editor);
    let instance = new ComponentClass({
      propsData: { mxRectangle: this.mxRectangle, cell: this.cell }
    });
    instance.$mount();
    this.showModalEditorWindow(this.$store.getters.getEditor.graph, "SQL Query Editor", instance.$el, 500, 232);
  }
}
</script>

<style scoped>

</style>