<template>
	<section>
		<div class="index-page">
			<h1 style="text-align: center;font-size: 35px">欢迎使用天津师范大学就餐预订</h1>
			<el-carousel :interval="4000" type="card" height="300px">
				<el-carousel-item v-for="(item,index) in swiperSrc" :key="index">
					<img :src=item.src width="100%" height="100%" @click="toOrder"/>
				</el-carousel-item>
			</el-carousel>
			<el-row>
				<el-col :span="12">
					<el-card :body-style="{ padding: '0px' }" style="height: 400px;">
						<div style="height: 400px;cursor: pointer" class="lb"  @click="toOrder">
							<div style="margin-bottom: 30px">品质生活，安全送达</div>
							<div>美好生活，触手可得</div>
						</div>
					</el-card>
				</el-col>
				<el-col :span="12">
					<el-card :body-style="{ padding: '0px' }" style="">
						<img src="../assets/rbb.jpg" class="image" height="400px" width="100%">
					</el-card>
				</el-col>
			</el-row>
			<footer style="text-align: center">
				版权归校园就餐预定项目组所有
			</footer>
		</div>
	</section>
</template>

<script>
	export default {
	    data(){
	        return{
				swiperSrc: [
					{
					    src: require('../assets/sw1.jpg')
                    },{
					    src: require('../assets/sw2.jpg')
                    },{
					    src: require('../assets/sw3.jpg')
                    },{
					    src: require('../assets/sw4.jpg')
                    }
				]
			}
		},
		methods:{
			toOrder(){
			    console.log("111")
				this.$router.push('/Order')
			}
		}
	}

</script>

<style scoped>

	.el-carousel__item h3 {
		color: #475669;
		font-size: 14px;
		opacity: 0.75;
		line-height: 200px;
		margin: 0;
	}

	.el-carousel__item:nth-child(2n) {
		background-color: #99a9bf;
	}

	.el-carousel__item:nth-child(2n+1) {
		background-color: #d3dce6;
	}
	.lb{
		background-image: url('../assets/lbb.jpg');
		color: #606266;
		font-size: 30px;
		font-weight: bold;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>