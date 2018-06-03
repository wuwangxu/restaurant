<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="订单号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="orders" highlight-current-row v-loading="loading" style="width: 100%;">
				<el-table-column type="expand">
					<template slot-scope="props">
						<el-card class="box-card">
							<span v-for="order in props.row.menuOrderVos" :key="o" class="text item" style="padding-left: 10px;padding-right: 10px">
								<span>
								{{ order.menuDishName }} x{{ order.orderDishNumber }}
								</span>
								<span>
									{{ order.menuDishPrice }}元/份
								</span>
							</span>
						</el-card>
					</template>
				</el-table-column>
				<el-table-column type="index" width="60">
				</el-table-column>
				<el-table-column prop="orderCode" label="订单编号" min-width="120" sortable>
				</el-table-column>
				<el-table-column prop="customerName" label="顾客姓名" min-width="100" sortable>
				</el-table-column>
				<el-table-column prop="customerNumber" label="顾客学号" min-width="120" sortable>
				</el-table-column>
				<el-table-column prop="totalManey" label="订单金额" min-width="100" :formatter="formatMoney" sortable>
				</el-table-column>
				<el-table-column prop="orderPickNumber" label="取餐号" min-width="100" sortable>
				</el-table-column>
				<el-table-column prop="orderTime" label="订单时间" min-width="120" sortable>
				</el-table-column>
			</el-table>
		</template>

	</section>
</template>
<script>
	import { getWindowOrders } from '../../api/api';
	//import NProgress from 'nprogress'
	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				loading: false,
				orders: []
			}
		},
		methods: {
            //价格显示转换
            formatMoney: function (row, column) {
                console.log(row)
				let discount=row.discount*10;
                if (discount===10) {
                    return `￥${row.totalManey}`;
                }else {
                    return `￥${row.totalManey} (${discount}折)`;
                }
            },
			//获取订单列表
            getOrders: function () {
				let para = sessionStorage.getItem('windowId');
				this.loading = true;
				//NProgress.start();
                getWindowOrders(para).then((res) => {
					this.loading = false;
                    this.orders=res.data.data
                    //NProgress.done();
				});
			}
		},
		mounted() {
			this.getOrders();
		}
	};

</script>

<style scoped>

</style>