<template>
  <span style="display: none;">
    <div ref="curtain"
         style="position: absolute; left: 0; top: 0; right: 0; bottom: 0; background: black; opacity: 0.01;"></div>
    <span style="visibility: hidden">
      <div ref="redeploy">
        <div style="display: flex; flex-direction: row">
          <img src="/src/images/alert.png" style="padding: 10px;">
          <div style="flex-direction: column; width: 100%; margin: auto;">
            <div>Graph ID:</div>
             <div style="font-size: 2em; text-align: center;">{{ $store.getters.getGraphId }}</div>
            <div>Graph Name:</div>
            <div style="font-size: 2em; text-align: center;">{{ $store.getters.getGraphName }}</div>
          </div>
        </div>
        <p style="text-align: center; font-size: 1.5em; margin: 3px 0; color: mediumvioletred;">Are you sure to replace existing graph?</p>
        <span style="display: flex; flex-direction: row; justify-content: space-around; margin-top: 6px;">
          <button class="button-dark" tabindex="11" style="color: mediumspringgreen;"
                  @click="confirm">OK
          </button>
          <button class="button-dark" tabindex="12" style="color: gold;"
                  @click="cancel">Cancel
          </button>
        </span>
      </div>
      <div ref="undeploy">
        <div style="display: flex; flex-direction: row">
          <img src="/src/images/alert.png" style="padding: 10px;">
          <div style="flex-direction: column; width: 100%; margin: auto;">
            <div>Graph ID:</div>
             <div style="font-size: 2em; text-align: center;">{{ $store.getters.getGraphId }}</div>
            <div>Graph Name:</div>
            <div style="font-size: 2em; text-align: center;">{{ $store.getters.getGraphName }}</div>
          </div>
        </div>
        <p style="text-align: center; font-size: 1.5em; margin: 3px 0; color: mediumvioletred;">Are you sure to undeploy this graph?</p>
        <span style="display: flex; flex-direction: row; justify-content: space-around; margin-top: 6px;">
          <button class="button-dark" tabindex="11" style="color: mediumspringgreen;"
                  @click="confirm">OK
          </button>
          <button class="button-dark" tabindex="12" style="color: gold;"
                  @click="cancel">Cancel
          </button>
        </span>
      </div>
    </span>
  </span>
</template>

<script>
export default {
  name: "ConfirmAlert",
  data() {
    return {
      editor: this.$store.getters.getEditor,
      graph: this.$store.getters.getEditor.graph,
      wnd: null
    };
  },
  props: {
    action: String,
    label: String,
    content: String
  },
  methods: {
    confirm() {
      this.wnd.destroy();
      mxEffects.fadeOut(this.$refs.curtain, 50, true,
          10, 30, true);
      this.$emit('confirm', this.action);
    },
    cancel() {
      this.wnd.destroy();
      mxEffects.fadeOut(this.$refs.curtain, 50, true,
          10, 30, true);
      this.$emit('cancel');
    }
  },
  mounted() {
    this.graph.setEnabled(false);
    document.body.appendChild(this.$refs.curtain);
    let width = 300, height = 200;
    let x = Math.max(0, document.body.scrollWidth / 2 - width / 2);
    let y = Math.max(10, ( document.body.scrollHeight ||
        document.documentElement.scrollHeight ) / 2 - height * 2 / 3);
    if (this.action === 'redeploy')
      this.wnd = new mxWindow('Confirmation!', this.$refs.redeploy, x, y, width, height, false, true);
    else if (this.action === 'undeploy')
      this.wnd = new mxWindow('Confirmation!', this.$refs.undeploy, x, y, width, height, false, true);
    this.wnd.setScrollable(false);
    this.wnd.setVisible(true);
  },
  beforeDestroy() {
    this.graph.setEnabled(true);
  }
}
</script>

<style scoped>
/** {
  user-select: none;
}*/

.button-dark {
  background: url(/src/images/button-dark.gif) repeat-x;
  width: 60px;
  margin-top: 5px;
}
</style>