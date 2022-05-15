<template>
  <span>
    <div>
      <img src="/src/images/icons48/process.png" width="48" height="48">
    </div>
      <a :class="{alert: alertView}" style="font-size: large;" href="#" @click="openChart">view</a>
  </span>
</template>

<script>

export default {
  name: "mxWindow",
  data() {
    return {
      frame: null,
      wnd: null,
      editor: null,
      alertView: false,
    }
  },
  props: {
    cell: {
      required: true
    },
    store: {
      required: true
    }
  },
  methods: {
    openChart: function() {
      let w = document.body.clientWidth;
      let h = ( document.body.clientHeight || document.documentElement.clientHeight );
      if (this.wnd && this.wnd.isVisible()) {
        let div = this.wnd.getElement();
        this.wnd.setLocation(( w - div.offsetWidth ) / 2, ( h - div.offsetHeight ) / 3);
        this.wnd.fit();
        this.wnd.activate();
        //console.dir(this.frame.contentWindow);
      } else {
        let title = this.cell.getValue().title || `${this.cell.getData().fName}#${this.cell.getId()}`
        let wnd = new mxWindow(title, this.frame, ( w - 200 ) / 2, ( h - 200 ) / 3, 200, 200);
        wnd.setClosable(true);
        wnd.setResizable(true);
        wnd.setVisible(true);
        this.wnd = wnd;
        this.editor.windows.add(wnd);
      }
    },
    alertData: function(data) {
      this.alertView = true;
      setTimeout(() => {
        this.alertView = false;
      }, 500);
      if (this.frame.contentWindow && typeof this.frame.contentWindow.updateChart === 'function')
        this.frame.contentWindow.updateChart(data);
      //if (this.frame && this.frame.contentWindow.newData && typeof this.frame.contentWindow.newData === 'function')
      //this.frame.contentWindow.newData(data);
    }
  },
  watch: {
    'cell.parent'(val) {
      if (this.wnd) {
        this.wnd.destroy();
      }
    },
  },
  mounted() {
    let frame = document.createElement('iframe');
    frame.setAttribute('width', '100%');
    frame.setAttribute('height', '100%');
    frame.setAttribute('src', `./chart?gid=${this.store.getters.getGraphId}&cid=${this.cell.getId()}`);
    //frame.onload = function(event){console.dir(event)};
    frame.style.backgroundColor = 'white';
    frame.style.overflow = 'hidden';
    frame.scrolling = 'no';
    this.frame = frame;
    this.editor = this.store.getters.getEditor;
  }
}
</script>

<style scoped>
.alert {
  font-weight: bold;
}
</style>