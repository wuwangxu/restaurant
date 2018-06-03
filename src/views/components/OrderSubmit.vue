<template>
    <section>

        <div v-for="i in orders" style="display: flex;justify-content: space-around">
            <template>
                <div style="width: 100px;text-align: center">{{i.menuName}}</div>
                <div style="width: 100px;text-align: center">{{i.menuDishPrice}}元/份</div>
                <div style="width: 100px;text-align: center">{{i.oNumber}}</div>
                <div style="width: 100px;text-align: center">{{i.menuDishPrice*i.oNumber}}元</div>
                <!--<el-input-number v-model="i.oNumber" @change="itemHandleChange" :min="0" :max="10" label="描述文字"></el-input-number>-->
            </template>
        </div>

        <footer>
            <el-input
                    placeholder="请输入学号"
                    v-model="customerNumber">
            </el-input>
            <el-input
                    placeholder="总价"
                    v-model="totalOrder"
                    :readonly="true"
                    :disabled="true">
                <template slot="append">元</template>
            </el-input>
            <el-button type="primary" @click="submitOrder" v-show="!showDiv">确认订单</el-button>
            <div v-show="showDiv" style="transform: translateY(-15px)">订单号：{{orderInfo.orderCode}} 取餐码：{{orderInfo.orderPickNumber}} </div>
        </footer>

    </section>
</template>

<script>
    import {submitOrderapi} from "../../api/api";

    export default {
        data() {
            return {
                activeNames: ['1'],
                totalOrder: '总价：50',
                total: 0,
                orders: [],
                customerNumber: '1530200060',
                showDiv: false,
                orderInfo:{
                    orderTime:'',
                    orderPickNumber:'',
                    orderCode:''
                }

            };
        },
        methods: {
            itemHandleChange(...val) {
                // console.log(val);
                // this.total+=(newv-oldv)*1
            },
            handleChange(val) {

                // console.log(val);
            },
            //获取菜单列表
            getOrders: function () {
                this.loading = true;

                this.orders = this.$store.state.orders
                console.log(this.orders);

            },
            submitOrder() {
                let menuOrderVos = []
                for (let i = 0; i < this.orders.length; i++) {
                    let obj = {
                        menuDishName: this.orders[i].menuName,
                        menuDishPrice: this.orders[i].menuDishPrice,
                        orderDishNumber: this.orders[i].orderDishNumber,
                        windowId: this.orders[i].windowId,
                        menuId: this.orders[i].menuId,
                    }
                    menuOrderVos.push(obj)
                }
                let data = {
                    menuOrderVos: menuOrderVos,
                    customerNumber: this.customerNumber,
                }

                if (this.$store.state.ordersTotal > 0) {
                    this.$confirm('确认订单, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        submitOrderapi(data).then((res) => {
                            this.showDiv=true;
                            this.orderInfo.orderCode=res.data.data.orderCode
                            this.orderInfo.orderPickNumber=res.data.data.orderPickNumber
                            this.orderInfo.orderTime=res.data.data.orderTime
                            console.log(res);
                        })
                    }).catch(() => {
                    });
                }
            }
        },
        mounted() {
            if (this.$store.state.ordersTotal === 0) {
                this.$router.push('/Order')
            } else {
                this.getOrders()
                this.totalOrder = '总价：' + this.$store.state.ordersTotal
            }

        }
    }

</script>

<style scoped lang="scss">
    section {
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

    .el-collapse {
        margin-bottom: 60px;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
    }

    .menus {
        width: 100%;
    }

    footer {
        position: fixed;
        height: 60px;
        bottom: 0;
        align-self: flex-end;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        /*align-items: center;*/
        /*justify-items: flex-start;*/
        & :nth-child(n) {
            margin: 10px;
        }
    }

</style>