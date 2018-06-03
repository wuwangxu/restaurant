<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="菜名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getFoodsMenuByName">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--新增Dialog-->
        <el-dialog title="新增菜品" :visible.sync="addFormVisible" width="30%">
            <el-form :model="addForm" style="margin: auto;padding: 0 60px 0 60px" label-position="left"
                     :rules="addFormRules" ref="addForm">
                <el-form-item label="菜名" :label-width="formLabelWidth" required>
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="单价" :label-width="formLabelWidth" required>
                    <el-input v-model="addForm.price" auto-complete="off">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
        <!--列表-->
        <el-table border :data="foods" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="selection" width="55" align="center">
            </el-table-column>
            <el-table-column type="index" width="60" align="center">
            </el-table-column>
            <el-table-column prop="menuName" label="菜名" min-width="120" align="center" sortable>
            </el-table-column>
            <el-table-column prop="menuDishPrice" label="单价" min-width="100" align="center" :formatter="formatMoney"
                             sortable>
            </el-table-column>
            <el-table-column label="操作" min-width="80" align="center">
                <template slot-scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <!--<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20"
                           :total="total" style="float:right;">
            </el-pagination>
        </el-col>
        <!--编辑Dialog-->
        <el-dialog title="修改菜品" :visible.sync="editFormVisible" width="30%">
            <el-form :model="editForm" style="margin: auto;padding: 0 60px 0 60px" label-position="left"
                     :rules="editFormRules" ref="editForm">
                <el-form-item label="菜名" :label-width="formLabelWidth" required>
                    <el-input v-model="editForm.menuName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="单价" :label-width="formLabelWidth" required>
                    <el-input v-model="editForm.menuDishPrice" auto-complete="off">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import {
        getFoodsListPage,
        removeFood,
        batchRemoveUser,
        editFood,
        addFood,
        getFoodsListPageByName
    } from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    name: ''
                },
                foods: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    menuName: [
                        {required: true, message: '请输入菜名', trigger: 'blur'}
                    ]
                },
                //编辑界面数据
                editForm: {
                    menuDishPrice: 0,
                    menuId: '',
                    menuName: '',
                    windowId: ''
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    name: [
                        {required: true, message: '请输入菜名', trigger: 'blur'}
                    ]
                },
                //新增界面数据
                addForm: {
                    name: '',
                    price: 0
                },
                formLabelWidth: '60px',
                windowId: ''

            }
        },
        methods: {
            //价格显示转换
            formatMoney: function (row, column) {
                return `￥${row.menuDishPrice}`;
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getFoodsMenu();
            },
            //获取列表
            getFoodsMenu() {
                let para = sessionStorage.getItem('user')
                this.listLoading = true;
                if (para) {
                    let user = JSON.parse(para);
                    para = user.id || '';
                }
                getFoodsListPage(para).then((res) => {
                    this.foods = res.data.data.menus;
                    this.listLoading = false;
                });
            },
            //按菜名获取列表
            getFoodsMenuByName() {
                if (this.filters.name !== '') {
                    let para = {
                        menuName: this.filters.name,
                        windowId: this.windowId
                    }
                    getFoodsListPageByName(para).then((res) => {
                        this.foods = res.data.data.menus;
                        this.listLoading = false;
                    });
                } else {
                    this.getFoodsMenu()
                }
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = row.menuId;
                    removeFood(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getFoodsMenu();
                    });
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                // console.log('hh');
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
                console.log(this.editForm);
            },
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.addForm = {
                    name: '',
                    price: 0
                };
            },
            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let param = new URLSearchParams();
                            param.append("menuDishPrice", this.editForm.menuDishPrice);
                            param.append("menuName", this.editForm.menuName);
                            param.append("windowId", this.windowId);
                            param.append("menuId", this.editForm.menuId);

                            editFood(param).then((res) => {
                                this.editLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getFoodsMenu();
                            });
                        });
                    }
                });
            },
            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;

                            let param = new URLSearchParams();
                            param.append("menuDishPrice", this.addForm.price);
                            param.append("menuName", this.addForm.name);
                            param.append("windowId", this.windowId);

                            addFood(param).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getFoodsMenu();
                            });
                        });
                    }
                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            //批量删除
            batchRemove: function () {
                var ids = this.sels.map(item => item.id).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {ids: ids};
                    batchRemoveUser(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getFoodsMenu();
                    });
                }).catch(() => {

                });
            }
        },
        mounted() {
            this.getFoodsMenu();
            let para = sessionStorage.getItem('user')
            //NProgress.start();
            if (para) {
                let user = JSON.parse(para);
                para = user.id || '';
            }
            this.windowId = para;
        }
    }

</script>

<style scoped>

</style>