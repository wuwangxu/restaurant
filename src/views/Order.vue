<template>
	<section>
		<el-collapse v-model="activeNames" @change="handleChange" class="menus">
			<el-collapse-item :title="item.windowName" :name="item.windowId" v-for="(item,index) in orders" :key="item.windowId+index">
				<div v-for="i in item.menus" style="display: flex;justify-content: space-around">
					<template>
						<div style="width: 100px;text-align: center">{{i.menuName}}</div>
						<div style="width: 100px;text-align: center">{{i.menuDishPrice}}元/份</div>
						<el-input-number v-model="i.oNumber" @change="itemHandleChange" :min="0" :max="10" label="描述文字"></el-input-number>
					</template>
				</div>
			</el-collapse-item>
		</el-collapse>
		<footer>
			<!--<el-input-->
					<!--placeholder="总价"-->
					<!--v-model="totalOrder"-->
					<!--:readonly="true"-->
					<!--:disabled="true">-->
				<!--<template slot="append">元</template>-->
			<!--</el-input>-->
			<el-button type="primary" @click="submitOrder">提交订单</el-button>
		</footer>
	</section>
</template>

<script>
	import {getMenus} from "../api/api";

    export default {
        data() {
            return {
                activeNames: ['1'],
                totalOrder:'总价：50',
				total:0,
				orders:[]
            };
        },
        methods: {
            itemHandleChange(...val){
                // console.log(val);
				// this.total+=(newv-oldv)*1
            },
            handleChange(val) {

                // console.log(val);
            },
            //获取菜单列表
            getMenu: function () {
                this.loading = true;
                //NProgress.start();
                getMenus().then((res) => {
                    this.loading = false;
                    this.orders=res.data.data
					// for (let i=0;i<this.orders.length;i++) {
                     //    for (let j=0;j<this.orders[i].menus.length;j++){
                     //        this.orders[i].menus[j].oNumber=0
					// 	}
					// }
                    //NProgress.done();
                });
                // await console.log(this.orders);
            },
            submitOrder(){
                for (let i=0;i<this.orders.length;i++) {
                    for (let j=0;j<this.orders[i].menus.length;j++){
                        if (this.orders[i].menus[j].oNumber!==0&&this.orders[i].menus[j].oNumber){
                            // console.log(this.orders[i].menus[j].oNumber)
							let obj=this.orders[i].menus[j]
							obj.windowId=this.orders[i].windowId
							obj.windowName=this.orders[i].windowName
                            this.$store.state.orders.push(obj)

                            this.$store.state.ordersTotal+=this.orders[i].menus[j].menuDishPrice*this.orders[i].menus[j].oNumber
                            // console.log(this.$store.state.ordersTotal);
                        }
                    }
                }
                if(this.$store.state.ordersTotal>0){
                    this.$confirm('将提交订单, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$router.push('/OrderSubmit')

                    }).catch(() => {
                    });
				}else{
                    this.$message.error('错了哦，请先选择菜品');
				}


			}
        },
		mounted(){
            this.getMenu()
            this.$store.state.ordersTotal=0
            this.$store.state.orders=[]
		}
	}

</script>

<style scoped lang="scss">
	section{
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		width: 50%;
		justify-content: space-between;
		margin: 19px auto;
		padding: 5px;
		align-items: center;
		height: calc(100% - 40px);
	}
	.el-collapse{
		margin-bottom: 60px;
		height: 100%;
		overflow-x: hidden;
		overflow-y: auto;
	}
	.menus{
		width: 100%;
	}
	footer{
		position: fixed;
		height: 60px;
		bottom: 0;
		align-self: flex-end;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		/*align-items: center;*/
		/*justify-items: flex-start;*/
		& :nth-child(n){
			margin: 10px;
		}
	}

</style>