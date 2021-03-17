<template>
    <mx-button :editor="editor" action="bring2front" label=""
               image="/src/images/bring2front.png"></mx-button>
</template>

<script>
  import mxButton from '@/components/buttons/mxComponents/mxButton.vue';

  export default {
    name: "mxBring2Front",
    components: {
      mxButton
    },
    data: function() {
      return {
        editor: {}
      }
    },
    mounted() {
      this.editor = this.$store.getters.getEditor;
      let editor = this.editor;
      let that = this;
      this.editor.addAction('bring2front', function(editor, cell) {
        let graph = editor.graph;
        if (cell != null) {
          graph.orderCells(false, [cell]);
        }
      });
    }
  }
</script>

<style scoped>

</style>