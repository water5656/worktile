<template>
    <el-dialog
    title="請選擇"
    :visible.sync="propSetting.isShowOptions"
    width="30%"
    :before-close="handleClose">
        <el-button type="primary" @click="change">修改</el-button>
        <el-button type="danger" @click="del">刪除</el-button>
        <span slot="footer" class="dialog-footer">
        <el-button @click="propSetting.isShowOptions = false">取 消</el-button>
        </span>
    </el-dialog>
</template>
<script>
  export default {
    props:["propSetting"],
    methods: {
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                done();
                })
                .catch(_ => {});
        },
        del(){    
            this.$store.dispatch("DEL",this.propSetting.id);
            this.propSetting.isShowOptions = false;
        },
        change(){
            var obj = this.$store.state.morenshuju.filter(item=>item.id==this.propSetting.id)[0];
            console.log(obj.start);
            this.propSetting.title = obj.title;
            this.propSetting.start = new Date(obj.start.toString().substr(0,4), obj.start.toString().substr(4,2)-1, obj.start.toString().substr(6,2));
            this.propSetting.end = new Date(obj.end.toString().substr(0,4), obj.end.toString().substr(4,2)-1, obj.end.toString().substr(6,2));
            this.propSetting.type = obj.type;
            this.propSetting.isShowOptions = false;
            this.propSetting.name = "修改事件";
            this.propSetting.isShowTools = true;
        }
    }
    
  };
</script>