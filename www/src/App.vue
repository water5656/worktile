<style scoped lang="stylus">
  .el-radio{
    margin 100px 0 0 50px
  }
</style>
<template>
  <div>
    <el-row>
      <el-col :span="4">
        <el-row>
          <el-radio v-model="showWhat" label="all" class="el-radio">所有事件</el-radio>
        </el-row>
        <el-row>
          <el-radio v-model="showWhat" label="work" class="el-radio" style="color:red">工作事件</el-radio>
        </el-row>
        <el-row>
          <el-radio v-model="showWhat" label="life" class="el-radio" style="color:green">生活事件</el-radio>
        </el-row>
      </el-col>
      <el-col :span="20">
        <el-row style="margin:10px 0">
          <el-col :offset="3" :span="5"><el-button type="info" @click="jia">+</el-button> {{date.year}}年{{date.month}}月<el-button type="info" @click="jian">-</el-button></el-col>
          <el-col :span="5"><el-button type="primary" @click="add">添加事件</el-button></el-col>
        </el-row>
        <el-row>
          <el-col :span="16"><month :propSetting="propSetting" :showWhat="showWhat"></month></el-col>
        </el-row>
      </el-col>
    </el-row>
    <tools :propSetting="propSetting"></tools>
    <options :propSetting="propSetting"></options>
  </div>
</template>
<script>
import month from "./components/month.vue";
import tools from "./components/tools.vue";
import options from "./components/options.vue";
export default {
  data(){
    return{
        propSetting: {
          isShowTools: false,
          isShowOptions: false,
          name:'',
          title: '',
          start: '',
          end: '',
          type: ''
        },
        showWhat:'all'
      }
  },
  computed:{
    date(){
      this.$store.dispatch("GETALL");
      return this.$store.state.date;
    }
  },
  methods:{
    jia(){
      this.$store.commit("GOTO",{
        year: this.date.month == 12 ? this.date.year + 1: this.date.year,
        month: this.date.month == 12 ? 1 : this.date.month + 1
      });
    },
    jian(){
      this.$store.commit("GOTO",{
        year: this.date.month == 1 ? this.date.year - 1 : this.date.year,
        month: this.date.month == 1 ? this.date.month = 12 : this.date.month - 1
      });
    },
    add(){     
      this.propSetting.name = "添加事件";
      this.propSetting.isShowTools = true;
    }
  },
  components:{
    month,
    tools,
    options
  }
}
</script>


