<template>

</template>

<script>
import mxSqlserverConfig from "./ConfigForms/mxSqlserverConfig";

export default {
  name: "mxDatabaseConfig",
  components: {},
  props: ['cell'],
  data() {
    return {
      _config: null,
      background: null,
      wndConfig: null,
      graph: this.$store.getters.getEditor.graph,
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
    showModalConfigWindow: function(graph, title, content, width, height) {
      this.background = this.getBackground();
      document.body.appendChild(this.background);
      if (mxClient.IS_IE) {
        new mxDivResizer(this.background);
      }
      let x = Math.max(0, document.body.scrollWidth / 2 - width / 2);
      let y = Math.max(10, ( document.body.scrollHeight ||
          document.documentElement.scrollHeight ) / 2 - height * 2 / 3);
      this.wndConfig = new mxWindow(title, content, x, y, width, height, false, true);
      this.wndConfig.setClosable(true);
      this.wndConfig.destroyOnClose = true;
      graph.setEnabled(false);
      graph.tooltipHandler.hide();
      this.wndConfig.setVisible(true);
      // Fades the background out after after the window has been closed
      let that = this;
      this.wndConfig.addListener(mxEvent.DESTROY, function(evt) {
        graph.setEnabled(true);
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
        this._config = {
         /* name: "mxSqlserverConfig",*/
          components: {mxSqlserverConfig},
          props: ['store', 'cell'],
          template: '<mx-sqlserver-config :cell="cell" :store="store" @ok="configOk()" @cancel="configCancel"></mx-sqlserver-config>',
          methods: {
            configCancel: function() {
              that.wndConfig.destroy();
              that.graph.setEnabled(true);
              mxEffects.fadeOut(that.background, 50, true, 10, 30, true);
              that.$emit('close');
            },
            configOk: function() {
              //that.cell.setData({...that.cell.getData(), ...{config: $event}});
              that.wndConfig.destroy();
              that.graph.setEnabled(true);
              mxEffects.fadeOut(that.background, 50, true, 10, 30, true);
              that.$emit('close');
            }
          },
        };
        break;
    }
    const ComponentClass = Vue.extend(this._config);
    let instance = new ComponentClass({
      propsData: { store: this.$store, cell: this.cell }
    });
    instance.$mount();
    this.showModalConfigWindow(this.$store.getters.getEditor.graph, "SQL Server Configuration", instance.$el, 500, 232);
  }
}
</script>

<style scoped>

</style>