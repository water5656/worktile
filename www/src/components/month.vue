<style scoped lang="stylus">
    div{
        width 840px
        position relative
        margin 0 auto
        .calendar{
            width 100%
            border: 1px solid black;
            border-collapse: collapse;
            position absolute
            top 0
            left 0
            th{
                border: 1px solid black;  
                height 30px
            }
            td{
                border: 1px solid black;                
                width 120px
                height 90px
                text-align right
                vertical-align top
                font-size 12px
                line-height 14px
                &.current{
                    background-color pink
                }
            }
            .cur{
                background #eeeeee
                color #aaaaaa
            }
        }
        .schedule{
            width 100%
            position relative
            top 50px 
            left 0
            margin-bottom 20px
            tr{
                width 100%
                td{
                    height 20px
                    padding 1px 0
                    div{
                        width 100%
                        height 18px
                        &.work{
                            background-color red
                        }
                        &.life{
                            background-color green
                        }                       
                    }
                }
            }
            
        }
    }
</style>
<template>
    <div>
        <table class="calendar">
            <thead>
                <tr>
                    <th>周日</th>
                    <th>周一</th>
                    <th>周二</th>
                    <th>周三</th>
                    <th>周四</th>
                    <th>周五</th>
                    <th>周六</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item,index) of calendar.length / 7">
                    <td v-for="child of calendar.slice(index*7, (index+1)*7)" :class="{cur:!child.cur}">
                        {{child.fullday}}
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="schedule" v-for="item of schedule">
            <table>
                <tr v-for="child of item">
                    <td v-for="td of child" :colspan="td.colspan" :style="{width:120*td.colspan+'px'}">
                        <div :class="[td.type]" 
                        @dblclick="setOptions(td.id)" 
                        :data-id="td.id" 
                        class="draggable" >
                            {{td.title}}
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>
<script>
export default {
    props:["propSetting","showWhat"],
    computed:{
        show(){
            if(this.showWhat == "all"){
                return this.$store.state.morenshuju;
            }else if(this.showWhat == "work"){
                return this.$store.state.morenshuju.filter(item=>item.type=='work');
            }else if(this.showWhat == "life"){
                return this.$store.state.morenshuju.filter(item=>item.type=='life');
            }else{
                return [];
            }
        },
        calendar(){
            var arr = [];
            var nowMonthLength = new Date(this.$store.state.date.year, this.$store.state.date.month, 0).getDate();
            var prevMonthLength = new Date(this.$store.state.date.year, this.$store.state.date.month - 1, 0).getDate();
            var firstDay = new Date(this.$store.state.date.year, this.$store.state.date.month - 1).getDay();
            var pmonth = this.$store.state.date.month == 1 ? 12 : this.$store.state.date.month - 1;
            var pyear = this.$store.state.date.month == 1 ? this.$store.state.date.year - 1 : this.$store.state.date.year;
            var nmonth = this.$store.state.date.month == 12 ? 1 : this.$store.state.date.month + 1;
            var nyear = this.$store.state.date.month == 12 ? this.$store.state.date.year + 1 : this.$store.state.date.year;            
            function buling(n){
                if(n < 10){
                    return '0'+ n;
                }
                return n;
            }
            while(firstDay--){
                arr.unshift({
                    day: prevMonthLength,
                    fullday: `${pyear}${buling(pmonth)}${prevMonthLength}`,
                    cur: false
                });                
                prevMonthLength --
            };
            var count = 1;
            while(nowMonthLength--){
                arr.push({
                    day: count,
                    fullday: `${this.$store.state.date.year}${buling(this.$store.state.date.month)}${buling(count)}`,
                    cur: true
                });
                count ++;
            };
            count = 1;
            while(arr.length != 35 && arr.length != 42){
                arr.push({
                    day: count,
                    fullday: `${nyear}${buling(nmonth)}${buling(count)}`,
                    cur: false
                });
                count ++;
            };
            return arr;
        },
        schedule(){
            var arr = [];
            var vm = this;
            for(let i=0;i<this.calendar.length/7;i++){
                arr.push([]);
                for(let j=0;j<3;j++){
                    arr[i].push([]);
                    for(let k=0;k<7;k++){
                        arr[i][j].push({
                            colspan:1,
                            xingqi:k,
                            fullday:this.calendar[i*7+k].fullday
                        })
                    }
                }
            }
            this.show.forEach((item)=>{
                if(vm.calendar[0].fullday > item.start && vm.calendar[0].fullday < item.end){
                    item.start = vm.calendar[0].fullday;
                }
                var flag = true;
                var start = new Date(item.start.toString().substr(0,4), item.start.toString().substr(4,2)-1, item.start.toString().substr(6,2));
                var end = new Date(item.end.toString().substr(0,4), item.end.toString().substr(4,2)-1, item.end.toString().substr(6,2));
                var during = (end - start)/1000/60/60/24 + 1;   
                arr.forEach((week,weekidx)=>{
                    for(let i=0;i<3;i++){
                        for(let j=0;j<7;j++){
                            if(week[i][j]){
                                if(flag && week[i][j].fullday == item.start && !week[i][j].title){
                                    var nowWeekDuring = during + week[i][j].xingqi > 7 ? 7 - week[i][j].xingqi : during;
                                    week[i][j].title = item.title;
                                    week[i][j].type = item.type;
                                    week[i][j].colspan = nowWeekDuring;
                                    week[i][j].id = item.id;
                                    week[i].splice(j+1,during-1);
                                    flag = false;
                                    var rest = during - nowWeekDuring;
                                    var count = 0;
                                    while(rest > 0){
                                        count++;
                                        var nextWeekDuring = rest > 7 ? 7 : rest;
                                        if(arr.length <= count+weekidx) return;
                                        for(let k=0;k<3;k++){
                                            if(arr[count+weekidx][k][0].title){
                                                continue;
                                            }
                                            arr[count+weekidx][k][0].title = item.title;
                                            arr[count+weekidx][k][0].colspan = nextWeekDuring;
                                            arr[count+weekidx][k][0].type = item.type;
                                            arr[count+weekidx][k][0].id = item.id;
                                            arr[count+weekidx][k].splice(1, nextWeekDuring-1);  
                                            break;  
                                        }
                                        rest -= 7;
                                    }
                                }        
                            }
                            
                        }
                    }
                })
            })            
            return arr;
        }
    },
    methods:{
        setOptions(id){
            this.propSetting.isShowOptions = true;
            this.propSetting.id = id;
        }
    },
    updated(){
        var vm = this;
        var toucha,weicha,id;
        function buling(n){
            if(n < 10){
                return '0'+ n;
            }
            return n+'';
        }
        $(".draggable").draggable({
            //x:253 y 54 w:120 h:90 1tian:86400000ms
            start(event){
                var $td = $(".calendar tbody tr td");
                var col = ~~((event.clientX - 228)/120);
                var row = ~~((event.clientY - 55)/90);
                var nowDay = $.trim($td.eq(row*7+col).text());
                id = $(event.target).data("id");
                var obj = vm.$store.state.morenshuju.filter(item=>item.id==id)[0];
                var startDay = new Date(obj.start.substr(0,4), obj.start.substr(4,2)-1, obj.start.substr(6,2));
                var endDay = new Date(obj.end.substr(0,4), obj.end.substr(4,2)-1, obj.end.substr(6,2));
                var today = new Date(nowDay.substr(0,4), nowDay.substr(4,2)-1, nowDay.substr(6,2));
                toucha = today - startDay;
                weicha = endDay - today;
            },
            drag(event){
                var $td = $(".calendar tbody tr td");
                var col = ~~((event.clientX - 228)/120);
                var row = ~~((event.clientY - 55)/90);
                $(`div[data-id=${id}]`).hide();  
                $td.removeClass("current");
                $td.eq(row*7+col).addClass("current");
            },
            stop(event){
                var $td = $(".calendar tbody tr td");
                $td.removeClass("current");
                var col = ~~((event.clientX - 228)/120);
                var row = ~~((event.clientY - 55)/90);
                var nowDay = $.trim($td.eq(row*7+col).text());
                var today = new Date(nowDay.substr(0,4), nowDay.substr(4,2)-1, nowDay.substr(6,2));
                var newStart = new Date(Date.parse(today) - toucha);
                var newEnd = new Date(Date.parse(today) + weicha);
                var start = new Date(newStart).getFullYear()+buling(new Date(newStart).getMonth()+1)+buling((new Date(newStart).getDate()));
                var end = new Date(newEnd).getFullYear()+buling(new Date(newEnd).getMonth()+1)+buling((new Date(newEnd).getDate()));
                vm.$store.dispatch("DRAG",{start,end,id});
                $(".draggableDiv").css("position",'static');
                $(`div[data-id=${id}]`).show();  
            }
        });
    }
}
</script>


