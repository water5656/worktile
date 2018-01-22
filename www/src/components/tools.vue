<style>

</style>
<template>
    <el-dialog
        :title="propSetting.name"
        :visible.sync="propSetting.isShowTools"
        width="30%"
        :before-close="handleClose">
        <el-row>
            <el-col :offset="2" :span="6">事件：</el-col>
            <el-col :span="14">
                <el-input
                placeholder="请输入内容"
                v-model.trim="propSetting.title"
                clearable>
                </el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col :offset="2" :span="6">開始時間：</el-col>
            <el-col :span="14">
                <el-date-picker
                v-model="propSetting.start"
                type="date"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyyMMdd">
                </el-date-picker>
            </el-col>
        </el-row>
        <el-row>
            <el-col :offset="2" :span="6">結束時間：</el-col>
            <el-col :span="14">
                <el-date-picker
                v-model="propSetting.end"
                type="date"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyyMMdd">
                </el-date-picker>
            </el-col>
        </el-row>
        <el-row>
            <el-col :offset="2" :span="6">事件類型：</el-col>
            <el-col :span="14">
                <el-select v-model="propSetting.type" placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
            <el-button @click="propSetting.isShowTools = false">取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
export default {
    props:["propSetting"],
    data(){
        return{
            options: [{
                value: 'work',
                label: '工作'
                }, {
                value: 'life',
                label: '生活'
                }]
        }
    },
    methods: {
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                done();
                })
                .catch(_ => {});
        },
        submit(){
            if(this.propSetting.name == "添加事件"){
                if(this.propSetting.title == ""){
                   this.$message({
                        showClose: true,
                        message: '事件不能爲空',
                        type: 'error'
                    });
                    return 
                };
                if(this.propSetting.start > this.propSetting.end){
                    this.$message({
                        showClose: true,
                        message: '開始日期不能晚於結束日期',
                        type: 'error'
                    });
                    return
                };
                // this.$store.dispatch("ADD",{
                //     title: this.propSetting.title,
                //     start: this.propSetting.start,
                //     end: this.propSetting.end,
                //     type: this.propSetting.type
                // })
            }else if(this.propSetting.name == "修改事件"){
                this.$store.dispatch("CHANGE",{
                    id: this.propSetting.id,
                    title: this.propSetting.title,
                    start: this.propSetting.start,
                    end: this.propSetting.end,
                    type: this.propSetting.type
                })
            }
            this.propSetting.isShowTools = false;    
        }
    }
};
</script>


