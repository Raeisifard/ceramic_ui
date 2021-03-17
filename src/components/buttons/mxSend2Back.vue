<template>
    <mx-button :editor="editor" action="send2back" label=""
               image="/src/images/send2back.png"></mx-button>
</template>

<script>
  import mxButton from '@/components/buttons/mxComponents/mxButton.vue';

  export default {
    name: "mxSend2Back",
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
      this.editor.addAction('send2back', function(editor, cell) {
        let graph = editor.graph;
        if (cell != null) {
          graph.orderCells(true, [cell]);
        }
      });
    }
  }
</script>

<style scoped>

</style>