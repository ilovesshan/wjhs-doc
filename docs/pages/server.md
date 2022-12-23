## 服务端开发文档

### 一、数据库设计

#### 1、数据表预览

```
-- 系统字典表 system_dict
-- 用户操作日志表 operation_log
-- 用户登录日志表 login_log
-- 小程序用户信息表 wx_user
-- 小程序用户地址信息表 adress
-- 小程序用户信息和地址信息关联表 wx_user_address_rel
-- 骑手/回收中心/平台用户表 user
-- 角色表 role
-- 用户角色关联表 user_role
-- 权限表 menu 
-- 角色权限关联表 role_menu
-- 附件表 attachment
-- 轮播图表 swiper
-- 公告栏表 notice
-- 回收商品分类表 recycle_goods_type
-- 回收商品表 recycle_goods
-- 回收商品订单表 recycle_order
-- 回收商品订单详情表 recycle_order_detail
-- 积分商品分类表 integral_goods_type
-- 积分商品表 integral_goods
-- 积分商品表订单表 integral_order
-- 账户表 account
-- 账户流水表 account_record
-- 回收统计表 recycle_statistical
-- 用户积分表 wx_integral

-- 省份表
-- 市、区表
-- 区域表(区/县)
-- 街道表
```



#### 2、数据表设计

```sql
DROP DATABASE IF EXISTS wjhs;
CREATE DATABASE wjhs;

USE  wjhs;

-- 备注： 
-- 			1、省市区街道sql语句, 从文件中自行导入
-- 			2、CODE状态码参考：系统字典表(system_dict)



-- ----------------------------
-- 创建 系统字典表
-- ----------------------------
DROP TABLE IF EXISTS `system_dict`;
CREATE TABLE `system_dict` (
    `id` VARCHAR(32) NOT NULL  COMMENT '主键id',
    `dict_code` int(3) NOT NULL COMMENT '数据类型编码',
    `dict_name` VARCHAR(30) NOT NULL COMMENT '数据类型名称',
    `dict_describe` VARCHAR(100) DEFAULT NULL COMMENT '描述',
    `sort` int(5) DEFAULT '1' COMMENT '排序',
    `create_by` VARCHAR(50) NOT NULL COMMENT '创建人',
    `create_by_user_id` VARCHAR(32) NOT NULL COMMENT '创建人id',
    `update_by` VARCHAR(50) DEFAULT NULL COMMENT '修改人',
    `update_by_user_id` VARCHAR(32) DEFAULT NULL COMMENT '修改人id',
    `is_delete`  CHAR(3) DEFAULT 15  NOT NULL COMMENT '是否删除(14:已删除、15:未删除)',
    `create_time` DATETIME(0) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME(0) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `idx_dict_code` (`dict_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='系统字典类型表';


-- ----------------------------
-- 创建 用户操作日志表
-- ----------------------------
DROP TABLE IF EXISTS `operation_log`;
CREATE TABLE `operation_log` (
    `id` VARCHAR(32) NOT NULL COMMENT '主键id',
    `business_module` VARCHAR(20) NOT NULL COMMENT '业务模块',
    `business_type` VARCHAR(20) NOT NULL COMMENT '业务类型',
    `business_describe` VARCHAR(30) DEFAULT NULL COMMENT '描述信息',
    `api_method` VARCHAR(10)  NOT NULL COMMENT 'api方法',
    `request_method` VARCHAR(10)  NOT NULL  COMMENT '请求方式',
    `user_id` VARCHAR(32)  NOT NULL  COMMENT '操作人员id',
    `user_name` VARCHAR(10)  NOT NULL  COMMENT '操作人员姓名',
    `user_type` CHAR(3) NOT NULL COMMENT '用户类型(0:平台用户、1:微信用户、 2:骑手用户、 3:回收中心用户)',
    `url` VARCHAR(30) NOT NULL COMMENT '请求url',
    `ip` VARCHAR(32) DEFAULT NULL COMMENT '源IP地址',
    `status` CHAR(3) NOT NULL COMMENT '操作状态(22:成功、23:失败)',
    `is_delete`  CHAR(3) DEFAULT 15 NOT NULL COMMENT '是否删除(14:已删除、15:未删除)',
    `error_message` VARCHAR(255) DEFAULT NULL COMMENT '错误消息',
    `operation_time` DATETIME(0) DEFAULT NULL COMMENT '操作时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='操作日志';


-- ----------------------------
-- 创建 用户登录日志表
-- ----------------------------
DROP TABLE IF EXISTS `login_log`;
CREATE TABLE `login_log`(
    `id` VARCHAR(32) NOT NULL  COMMENT '主键id',
    `user_type` CHAR(3) NOT NULL COMMENT '用户类型(0:平台用户、1:微信用户、 2:骑手用户、 3:回收中心用户)',
    `user_id` VARCHAR(32) NOT NULL COMMENT '用户id',
    `token` VARCHAR(100) NOT NULL COMMENT '登录凭证',
    `user_name` VARCHAR(10) NOT NULL COMMENT '用户名称',
    `login_ip` VARCHAR(128) DEFAULT NULL COMMENT '登录IP',
    `login_time` DATETIME(0) DEFAULT NULL COMMENT '登录时间',
    `login_location` VARCHAR(50) DEFAULT NULL COMMENT '用户登录地址',
    `is_delete` CHAR(3) DEFAULT 15 NOT NULL COMMENT '是否删除(14:已删除、15:未删除)',
    `browser` VARCHAR(50)  NULL DEFAULT '' COMMENT '浏览器类型',
    `system_os` VARCHAR(50)  NULL DEFAULT '' COMMENT '操作系统',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT= '用户登录表';


-- ----------------------------
-- 创建 小程序用户信息表
-- ----------------------------
DROP TABLE IF EXISTS `wx_user`;
CREATE TABLE `wx_user`  (
    `id` VARCHAR(32) NOT NULL  COMMENT '主键id',
    `open_id` VARCHAR(100) NOT NULL COMMENT 'open_id',
    `skey` VARCHAR(100) NOT NULL COMMENT 'skey',
    `session_key` VARCHAR(100) NOT NULL COMMENT 'session_key',
    `gender` CHAR(3) DEFAULT NULL COMMENT '性别(20:男、21:女)',  
    `avatar_url` VARCHAR(255) DEFAULT NULL COMMENT '头像',
    `city` VARCHAR(255) DEFAULT NULL COMMENT '市',
    `province` VARCHAR(255) DEFAULT NULL COMMENT '省',
    `country` VARCHAR(255) DEFAULT NULL COMMENT '国',
    `nick_name` VARCHAR(255) DEFAULT NULL COMMENT '昵称',
    `is_delete`  CHAR(3) DEFAULT 15 NOT NULL COMMENT '是否删除(14:已删除、15:未删除)',
    `last_visit_time` DATETIME(0) DEFAULT NULL COMMENT '最后登录时间',  
    `create_time` DATETIME(0) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME(0) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='小程序用户信息表';


-- ----------------------------
-- 创建 小程序用户地址信息表
-- ----------------------------
DROP TABLE IF EXISTS `adress`;
CREATE TABLE `adress`  (
    `id` VARCHAR(32) NOT NULL  COMMENT '主键id',
    `base_addrerss` VARCHAR(50) NOT NULL COMMENT '基本地址(省市区地址)',
    `detail_address` VARCHAR(150) NOT NULL COMMENT '详细地址',
    `phone` VARCHAR(11) NOT NULL COMMENT '收件人手机号',
    `user_name` VARCHAR(10) NOT NULL COMMENT '收件人姓名',
    `longitude` VARCHAR(20) NOT NULL COMMENT '经度',
    `latitude` VARCHAR(20) NOT NULL COMMENT '纬度',
    `is_DEFAULT` CHAR(3) DEFAULT 19 NOT NULL COMMENT '是否是默认地址(18:默认地址、19:非默认地址)',
    `is_delete`  CHAR(3) DEFAULT 15 COMMENT '是否删除(14:已删除、15:未删除)',
    `create_time` DATETIME(0) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME(0) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='小程序用户地址信息表';


-- ----------------------------
-- 创建 小程序用户信息和地址信息关联表
-- ----------------------------
DROP TABLE IF EXISTS `wx_user_address_rel`;
CREATE TABLE `wx_user_address_rel`  (
    `id` VARCHAR(32) NOT NULL  COMMENT '主键id',
    `user_id` VARCHAR(32) NOT NULL COMMENT '用户id',
    `address_id` VARCHAR(32) NOT NULL COMMENT '地址id',
    FOREIGN KEY(`user_id`) REFERENCES wx_user(`id`),
    FOREIGN KEY (`address_id`) REFERENCES adress(`id`),
    UNIQUE (`user_id` ,`address_id`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='小程序用户信息和地址信息关联表';


-- ----------------------------
-- 创建 骑手/回收中心用户/平台用户表
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
    `id` VARCHAR(32) NOT NULL  COMMENT '主键id',
    `username` VARCHAR(32) NOT NULL COMMENT '用户名称',
    `password` VARCHAR(255) NOT NULL COMMENT '用户密码',
    `user_type` CHAR(3) NOT NULL COMMENT '用户类型(0:平台用户、1:微信用户、 2:骑手用户、 3:回收中心用户)',
    `gender` CHAR(3) DEFAULT NULL COMMENT '性别(20:男、21:女)',  
    `attachment_id` VARCHAR(32) DEFAULT NULL COMMENT '附件id(头像)',
    `nick_name` VARCHAR(255) DEFAULT NULL COMMENT '昵称',
    `phone` VARCHAR(11) NOT NULL COMMENT '手机号',
    `is_delete`  CHAR(3) DEFAULT 15 NOT NULL COMMENT '是否删除(14:已删除、15:未删除)',
    `last_visit_time` DATETIME(0) DEFAULT NULL COMMENT '最后登录时间',  
    `create_time` DATETIME(0) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME(0) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='骑手/回收中心用户/平台用户表';


-- ----------------------------
-- 创建 角色表
-- ----------------------------`
CREATE TABLE `role` (
    `id` VARCHAR(32) NOT NULL COMMENT '角色id',
    `role_name` varchar(20) NOT NULL DEFAULT '' COMMENT '角色名称',
    `role_code` varchar(40) DEFAULT NULL COMMENT '角色编码',
    `description` varchar(255) DEFAULT NULL COMMENT '描述',
    `is_delete`  CHAR(3) DEFAULT 15 NOT NULL COMMENT '是否删除(14:已删除、15:未删除)',
    `create_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COMMENT='角色表';


-- ----------------------------
-- 创建 用户角色关联表
-- ----------------------------
DROP TABLE IF EXISTS `user_role`;
create table `user_role`(
    `id` VARCHAR(32) COMMENT '主键id',
    `user_id` VARCHAR(32) COMMENT '用户id',
    `role_id` VARCHAR(32) COMMENT '角色id',
    `is_delete`  CHAR(3) DEFAULT 15 NOT NULL COMMENT '是否删除(14:已删除、15:未删除)',
    `create_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户角色关联表';


-- ----------------------------
-- 创建 权限表
-- ----------------------------
CREATE TABLE `menu` (
    `id` VARCHAR(32) NOT NULL COMMENT '编号',
    `parent_id` VARCHAR(32) NOT NULL DEFAULT '0' COMMENT '所属上级',
    `name` varchar(20) NOT NULL DEFAULT '' COMMENT '名称',
    `type` tinyint(3) NOT NULL DEFAULT '0' COMMENT '类型(28:目录, 29:菜单,30:按钮)',
    `path` varchar(100) DEFAULT NULL COMMENT '路由地址',
    `component` varchar(100) DEFAULT NULL COMMENT '组件路径',
    `perms` varchar(100) DEFAULT NULL COMMENT '权限标识',
    `icon` varchar(100) DEFAULT NULL COMMENT '图标',
    `sort_value` int(11) DEFAULT NULL COMMENT '排序',
    `is_delete`  CHAR(3) DEFAULT 15 NOT NULL COMMENT '是否删除(14:已删除、15:未删除)',
    `create_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COMMENT='权限表';

-- ----------------------------
-- 创建 角色权限关联表
-- ----------------------------
CREATE TABLE `role_menu` (
    `id` VARCHAR(32) NOT NULL,
    `role_id` VARCHAR(32) NOT NULL DEFAULT '0',
    `menu_id` VARCHAR(32) NOT NULL DEFAULT '0',
    `is_delete`  CHAR(3) DEFAULT 15 NOT NULL COMMENT '是否删除(14:已删除、15:未删除)',
    `create_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8 COMMENT='角色权限关联表';


-- ----------------------------
-- 创建 附件表
-- ----------------------------
DROP TABLE IF EXISTS `attachment`;
CREATE TABLE `attachment` (
    `id` VARCHAR(32) NOT NULL  COMMENT '主键id',
    `url` VARCHAR(100) NOT NULL COMMENT '访问地址',
    `create_by_user_id` VARCHAR(32) NOT NULL COMMENT '创建人id',
    `create_by_user_name` VARCHAR(10) NOT NULL COMMENT '创建人name',
    `create_by_user_type` CHAR(3) NOT NULL COMMENT '用户类型(0:平台用户、1:微信用户、 2:骑手用户、 3:回收中心用户)',
    `is_delete`  CHAR(3) DEFAULT 15 NOT NULL COMMENT '是否删除(14:已删除、15:未删除)',
    `create_time` DATETIME(0) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME(0) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='系统附件表';


-- ----------------------------
-- 创建 轮播图表
-- ----------------------------
DROP TABLE IF EXISTS `swiper`;
CREATE TABLE `swiper`  (
    `id` VARCHAR(32) NOT NULL  COMMENT '主键id',
    `type` VARCHAR(100) DEFAULT NULL COMMENT '类型',
    `attachment_id` VARCHAR(32) NOT NULL COMMENT '附件id',
    `title` VARCHAR(30) DEFAULT NULL COMMENT '标题',
    `sub_title` VARCHAR(100) DEFAULT NULL COMMENT '子标题',
    `detail` VARCHAR(100) DEFAULT NULL COMMENT '详细信息',
    `link` VARCHAR(100) DEFAULT NULL COMMENT '跳转链接',
    `is_delete`  CHAR(3) DEFAULT 15 NOT NULL COMMENT '是否删除(14:已删除、15:未删除)',
    `create_time` DATETIME(0) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME(0) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='轮播图表';


-- ----------------------------
-- 创建 公告栏表
-- ----------------------------
DROP TABLE IF EXISTS `notice`;
CREATE TABLE `notice`  (
    `id` VARCHAR(32) NOT NULL COMMENT '主键id',
    `type` VARCHAR(100) DEFAULT NULL COMMENT '类型',
    `title` VARCHAR(30) NOT NULL COMMENT '标题',
    `sub_title` VARCHAR(100) DEFAULT NULL COMMENT '子标题',
    `detail` VARCHAR(100) DEFAULT NULL COMMENT '详细信息',
    `link` VARCHAR(100) DEFAULT NULL COMMENT '跳转链接',
    `is_delete`  CHAR(3) DEFAULT 15 NOT NULL COMMENT '是否删除(14:已删除、15:未删除)',
    `create_time` DATETIME(0) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME(0) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='公告栏表';


-- ----------------------------
-- 创建 回收商品分类表
-- ----------------------------
DROP TABLE IF EXISTS `recycle_goods_type`;
CREATE TABLE `recycle_goods_type`  (
    `id` VARCHAR(32) NOT NULL  COMMENT '主键id',
    `name` VARCHAR(30) NOT NULL COMMENT '类别名称',
    `describe` VARCHAR(100) DEFAULT NULL COMMENT '类别描述',
    `is_delete`  CHAR(3) DEFAULT 15 NOT NULL COMMENT '是否删除(14:已删除、15:未删除)',
    `create_time` DATETIME(0) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME(0) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='回收商品分类表';


-- ----------------------------
-- 创建 回收商品表
-- ----------------------------
DROP TABLE IF EXISTS `recycle_goods`;
CREATE TABLE `recycle_goods`  (
    `id` VARCHAR(32) NOT NULL  COMMENT '主键id',
    `type_id` VARCHAR(32) NOT NULL COMMENT '类别id',
    `name` VARCHAR(30) NOT NULL COMMENT '商品名称',
    `describe` VARCHAR(100) DEFAULT NULL COMMENT '商品描述',
    `integral` double(7,2) NOT NULL COMMENT '商品可兑换积分',
    `attachment_id` VARCHAR(32) NOT NULL COMMENT '附件id',
    `user_price` double(7,2) NOT NULL COMMENT '用户价格',
    `driver_price` double(7,2) NOT NULL COMMENT '骑手价格',
    `recycle_center__price` double(7,2) NOT NULL COMMENT '回收中心用户价格',
    `is_delete`  CHAR(3) DEFAULT 15 NOT NULL COMMENT '是否删除(14:已删除、15:未删除)',
    `create_time` DATETIME(0) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME(0) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='回收商品表';


-- ----------------------------
-- 创建 回收商品订单表
-- ----------------------------
DROP TABLE IF EXISTS `recycle_order`;
CREATE TABLE `recycle_order`  (
    `id` VARCHAR(32) NOT NULL  COMMENT '主键id',
    `submit_user_id` VARCHAR(32) NOT NULL COMMENT '下单用户id',
    `receive_user_id` VARCHAR(32) NOT NULL COMMENT '接单用户id',
    `order_type` CHAR(3) NOT NULL COMMENT '订单类别(10:用户到骑手, 11:骑手到回收中心用户)',
    `status` CHAR(3) NOT NULL COMMENT '订单类别(4:待接单, 5:待上门, 6:待结算, 7:已完结, 8:待已超时, 9:取消订单)',
    `trading_money` double(7,2) NOT NULL COMMENT '交易金额',
    `note` VARCHAR(255) DEFAULT NULL COMMENT '下单备注',
    `is_delete`  CHAR(3) DEFAULT 15  NOT NULL COMMENT '是否删除(14:已删除、15:未删除)',
    `create_time` DATETIME(0) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME(0) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='回收商品订单表';


-- ----------------------------
-- 创建 回收商品订单详情表
-- ----------------------------
DROP TABLE IF EXISTS `recycle_order_detail`;
CREATE TABLE `recycle_order_detail`(
    `id` VARCHAR(32) NOT NULL  COMMENT '主键id',
    `order_id` VARCHAR(32) NOT NULL COMMENT '订单id',
    `goods_id` VARCHAR(32) NOT NULL COMMENT '商品id',
    `weight` double(7,2)  NOT NULL COMMENT '商品重量(KG)',
    `is_delete`  CHAR(3) DEFAULT 15 NOT NULL COMMENT '是否删除(14:已删除、15:未删除)',
    `create_time` DATETIME(0) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME(0) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='回收商品订单详情表';


-- ----------------------------
-- 创建 积分商品分类表
-- ----------------------------
DROP TABLE IF EXISTS `integral_goods_type`;
CREATE TABLE `integral_goods_type`  (
    `id` VARCHAR(32) NOT NULL  COMMENT '主键id',
    `name` VARCHAR(30) NOT NULL COMMENT '类别名称',
    `describe` VARCHAR(100) DEFAULT NULL COMMENT '类别描述',
    `is_delete`  CHAR(3) DEFAULT 15  NOT NULL COMMENT '是否删除(14:已删除、15:未删除)',
    `create_time` DATETIME(0) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME(0) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='积分商品分类表';


-- ----------------------------
-- 创建 积分商品表
-- ----------------------------
DROP TABLE IF EXISTS `integral_goods`;
CREATE TABLE `integral_goods`  (
    `id` VARCHAR(32) NOT NULL  COMMENT '主键id',
    `type_id`  int(11) NOT NULL COMMENT '类别id',
    `name` VARCHAR(30) NOT NULL COMMENT '商品名称',
    `describe` VARCHAR(100) DEFAULT NULL COMMENT '商品描述',
    `integral` double(7,2) NOT NULL COMMENT '兑换商品需要的积分',
    `attachment_id` VARCHAR(32) NOT NULL COMMENT '附件id',
    `is_delete`  CHAR(3) DEFAULT 15 NOT NULL COMMENT '是否删除(14:已删除、15:未删除)',
    `status`  CHAR(3) DEFAULT 16 COMMENT '商品状态(16:正常、17:已下架)',
    `create_time` DATETIME(0) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME(0) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='积分商品表';


-- ----------------------------
-- 创建 积分商品表订单表
-- ----------------------------
DROP TABLE IF EXISTS `integral_order`;
CREATE TABLE `integral_order`  (
    `id` VARCHAR(32) NOT NULL  COMMENT '主键id',
    `user_id` VARCHAR(32) NOT NULL COMMENT '下单用户id',
    `status` CHAR(3) NOT NULL COMMENT '订单类别(20:待发货, 21:待收货, 22:已完成)',
    `trading_money` double(7,2) NOT NULL COMMENT '交易金额',
    `note` VARCHAR(255) DEFAULT NULL COMMENT '下单备注',
    `is_delete`  CHAR(3) DEFAULT 15 NOT NULL COMMENT '是否删除(14:已删除、15:未删除)',
    `create_time` DATETIME(0) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME(0) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='积分商品表订单表';


-- ----------------------------
-- 创建 账户表
-- ----------------------------
DROP TABLE IF EXISTS `account`;
CREATE TABLE `account`  (
    `id` VARCHAR(32) NOT NULL  COMMENT '主键id',
    `user_type` CHAR(3) NOT NULL COMMENT '用户类型(0:平台用户、1:微信用户、 2:骑手用户、 3:回收中心用户)',
    `user_id` VARCHAR(32) NOT NULL COMMENT '用户id',
    `balance` double(7,2) NOT NULL COMMENT '用户余额',
    `create_time` DATETIME(0) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME(0) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='账户表';


-- ----------------------------
-- 创建 账户流水表
-- ----------------------------
DROP TABLE IF EXISTS `account_record`;
CREATE TABLE `account_record`  (
    `id` VARCHAR(32) NOT NULL  COMMENT '主键id',
    `user_type_from` CHAR(3) NOT NULL COMMENT '支出用户类型(0:平台用户、1:微信用户、 2:骑手用户、 3:回收中心用户)',
    `user_type_to` CHAR(3) NOT NULL COMMENT '收入用户类型(0:平台用户、1:微信用户、 2:骑手用户、 3:回收中心用户)',
    `user_id_from` VARCHAR(32) NOT NULL COMMENT '支出用户id',
    `user_id_to` VARCHAR(32) NOT NULL COMMENT '收入用户id',
    `trading_id` VARCHAR(32) NULL COMMENT '交易id(订单id)',
    `trading_money` double(7,2) NOT NULL COMMENT '交易金额',
    `trading_type` CHAR(3) NOT NULL COMMENT '交易方式',
    `trading_note` VARCHAR(255) DEFAULT NULL COMMENT '交易备注',
    `create_time` DATETIME(0) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME(0) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='账户流水';

```



#### 3、字典预览

```
用户类型(yhlx)
0：平台用户
1：微信用户
2：骑手用户
3：回收中心用户


回收订单状态(hsddzt)
4：待接单
5：待上门
6：待结算
7：已完结
8：已超时
9：取消订单


回收订单流程(hsddlc)
10：用户到骑手
11：骑手到回收中心


用户状态(yhzt)
12：正常
13：停用


数据状态(sjzt)
14：逻辑删除(已经删除)
15：逻辑删除(未删除)


积分商品状态(jfspzt)
16：正常
17：已下架


地址信息状态(dzxxzt)
18：默认地址
19：非默认地址


性别状态(xbzt)
20：男
21：女


操作状态(czzt)
22：成功
23：失败


交易方式(jyfs)
24：微信
25：支付宝
26：现金
27：刷卡
27：平台充值


菜单类型(cdlx)
28：目录
29：菜单
30：按钮


终端类型(zdlx)
31：小程序
32：App


商品状态(spzt)
33：上架
34：下架

出入账状态(crzzt)
35：支出
36：收入
```



#### 4、初始化数据

```sql
-- 初始化 用户表数据
INSERT INTO 
  `wjhs`.`user` (`id`, `username`, `password`, `user_type`, `gender`, `attachment_id`, `nick_name`, `phone`, `is_delete`, `last_visit_time`, `create_time`, `update_time`) 
VALUES 
  ('369BCFE480454D22A07A8644F6DF0349', 'admin', '123456', 0, 20, NULL, '管理员', 15989874455, 15, NULL, '2022-11-24 10:22:34', '2022-11-24 10:22:34'),
  ('ADBD5F0E46474696B65140568E43385E', 'sunlei', 'sunlei123456!@#', 2, 20, NULL, '孙雷', 15854231177, 15, NULL, '2022-11-24 10:22:34', '2022-11-24 10:22:34'),
  ('F2532E33786F4B8D9FA2DB00F03352FB', 'ilovesshan', 'ilovesshan123456!@#', 3, 20, NULL, NULL, 18856492388, 15, NULL, '2022-11-24 10:22:34', '2022-11-24 10:22:34');




-- 初始化 角色表数据
INSERT INTO 
  `wjhs`.`role` (`id`, `role_name`, `role_code`,`description`, `is_delete` ,`create_time`, `update_time`) 
VALUES 
  ('612F7B30836B4698959AE2954F58922A', '平台用户', 'PTYH', '', 15,'2022-11-24 10:22:34', '2022-11-24 10:22:34'),
  ('D4B32DEE01E845DEA40EC55120F44973','微信用户', 'WXYH', '', 15, '2022-11-24 10:22:34', '2022-11-24 10:22:34'),
  ('509E0E6D5A464248BBB60F1869B701FA', '骑手用户','QSYH', '', 15,'2022-11-24 10:22:34', '2022-11-24 10:22:34'),
  ('D3E36342C3C943AA99587F23D60EB272', '回收中心用户', 'HSZXYH', '', 15, '2022-11-24 10:22:34', '2022-11-24 10:22:34');


	

-- 初始化 字典表数据
INSERT INTO 
  `wjhs`.`system_dict` (`id`, `dict_code`, `dict_name`, `dict_describe`, `sort`, `create_by`, `create_by_user_id`, `update_by`, `update_by_user_id`, `is_delete`, `create_time`, `update_time`) 
VALUES 
  ('F3A6A71BD8FD4A25B3E3D61520EBEBEF', 0, '用户类型(yhlx)', '平台用户', 1 , 'admin', '369BCFE480454D22A07A8644F6DF0349', NULL, NULL, 15, '2022-11-24 10:22:34', '2022-11-24 10:22:34'),
  ('497F4D3CAC91476EBBEB1C679D4CBBF5', 1, '用户类型(yhlx)', '微信用户', 1 , 'admin', '369BCFE480454D22A07A8644F6DF0349', NULL, NULL, 15, '2022-11-24 10:22:34', '2022-11-24 10:22:34'),
  ('F5ADC7D21F3E48C4B296D44D019ABF38', 2, '用户类型(yhlx)', '骑手用户', 1 , 'admin', '369BCFE480454D22A07A8644F6DF0349', NULL, NULL, 15, '2022-11-24 10:22:34', '2022-11-24 10:22:34'),
  ('A619507790284EF882492DDB4CE3B0FD', 3, '用户类型(yhlx)', '回收中心用户', 1 , 'admin', '369BCFE480454D22A07A8644F6DF0349', NULL, NULL, 15, '2022-11-24 10:22:34', '2022-11-24 10:22:34'),

  ('6D1E77DC642445FA994A84115A75A1B7', 4, '回收订单状态(hsddzt)', '待接单', 1 , 'admin', '369BCFE480454D22A07A8644F6DF0349', NULL, NULL, 15, '2022-11-24 10:22:34', '2022-11-24 10:22:34'),
  ('E7D531B8D6FE4A288C8AEBF403924118', 5, '回收订单状态(hsddzt)', '待上门', 1 , 'admin', '369BCFE480454D22A07A8644F6DF0349', NULL, NULL, 15, '2022-11-24 10:22:34', '2022-11-24 10:22:34'),
  ('089E5E6A67714279B987A31AF97131C0', 6, '回收订单状态(hsddzt)', '待结算', 1 , 'admin', '369BCFE480454D22A07A8644F6DF0349', NULL, NULL, 15, '2022-11-24 10:22:34', '2022-11-24 10:22:34'),
  ('AAF67629CAF84590AF9E0ECACD2DAF6A', 7, '回收订单状态(hsddzt)', '已完结', 1 , 'admin', '369BCFE480454D22A07A8644F6DF0349', NULL, NULL, 15, '2022-11-24 10:22:34', '2022-11-24 10:22:34'),
  ('217D885919544570B41D3C222C967BE8', 8, '回收订单状态(hsddzt)', '已超时', 1 , 'admin', '369BCFE480454D22A07A8644F6DF0349', NULL, NULL, 15, '2022-11-24 10:22:34', '2022-11-24 10:22:34'),
  ('EFF59628C8CE4AD4BFDDAC155CA82058', 9, '回收订单状态(hsddzt)', '取消订单', 1 , 'admin', '369BCFE480454D22A07A8644F6DF0349', NULL, NULL, 15, '2022-11-24 10:22:34', '2022-11-24 10:22:34'),
  
  ('8CF00400B3CE420BAAE6F40687BDE431', 10, '回收订单流程(hsddlc)', '用户到骑手', 1 , 'admin', '369BCFE480454D22A07A8644F6DF0349', NULL, NULL, 15, '2022-11-24 10:22:34', '2022-11-24 10:22:34'),
  ('1E20CEADCB444D0DA3AB0A46000E552F', 11, '回收订单流程(hsddlc)', '骑手到回收中心', 1 , 'admin', '369BCFE480454D22A07A8644F6DF0349', NULL, NULL, 15, '2022-11-24 10:22:34', '2022-11-24 10:22:34'),

  ('B40D87D666144596973B909E5D4E3BB4', 12, '用户状态(yhzt)', '正常', 1 , 'admin', '369BCFE480454D22A07A8644F6DF0349', NULL, NULL, 15, '2022-11-24 10:22:34', '2022-11-24 10:22:34'),
  ('D0F3A88D099642A498AB77C497C5165D', 13, '用户状态(yhzt)', '停用', 1 , 'admin', '369BCFE480454D22A07A8644F6DF0349', NULL, NULL, 15, '2022-11-24 10:22:34', '2022-11-24 10:22:34'),

  ('C536B35929B24A7B8FC5A01B04181259', 14, '数据状态(sjzt)', '逻辑删除(已经删除)', 1 , 'admin', '369BCFE480454D22A07A8644F6DF0349', NULL, NULL, 15, '2022-11-24 10:22:34', '2022-11-24 10:22:34'),
  ('CE15758CA04B4CB887A851B9E459FE68', 15, '数据状态(sjzt)', '逻辑删除(未删除)', 1 , 'admin', '369BCFE480454D22A07A8644F6DF0349', NULL, NULL, 15, '2022-11-24 10:22:34', '2022-11-24 10:22:34'),
  
  ('41C8973B5AFE4F8A84820AA83B8FE6B7', 16, '积分商品状态(jfspzt)', '正常', 1 , 'admin', '369BCFE480454D22A07A8644F6DF0349', NULL, NULL, 15, '2022-11-24 10:22:34', '2022-11-24 10:22:34'),
  ('91B47BF061D34301BE521FA283839CEF', 17, '积分商品状态(jfspzt)', '已下架', 1 , 'admin', '369BCFE480454D22A07A8644F6DF0349', NULL, NULL, 15, '2022-11-24 10:22:34', '2022-11-24 10:22:34'),
  
  ('968294A4D44D46DD8775990144DFBF40', 18, '地址信息状态(dzxxzt)', '默认地址', 1 , 'admin', '369BCFE480454D22A07A8644F6DF0349', NULL, NULL, 15, '2022-11-24 10:22:34', '2022-11-24 10:22:34'),
  ('A1915E353BB54DF4A32DF0B9AAE6FABF', 19, '地址信息状态(dzxxzt)', '非默认地址', 1 , 'admin', '369BCFE480454D22A07A8644F6DF0349', NULL, NULL, 15, '2022-11-24 10:22:34', '2022-11-24 10:22:34'),
  
  ('538FB84080D24AC9B1904F5270D33C85', 20, '性别状态(xbzt)', '男', 1 , 'admin', '369BCFE480454D22A07A8644F6DF0349', NULL, NULL, 15, '2022-11-24 10:22:34', '2022-11-24 10:22:34'),
  ('9D73A5790DCD4CF2815CF8119976D116', 21, '性别状态(xbzt)', '女', 1 , 'admin', '369BCFE480454D22A07A8644F6DF0349', NULL, NULL, 15, '2022-11-24 10:22:34', '2022-11-24 10:22:34'),
  
  ('6E90BCA2A59D4F6EA4874820B7251536', 22, '操作状态(czzt)', '成功', 1 , 'admin', '369BCFE480454D22A07A8644F6DF0349', NULL, NULL, 15, '2022-11-24 10:22:34', '2022-11-24 10:22:34'),
  ('99FABB30FF9E47D4BF3DB044C01AC85C', 23, '操作状态(czzt)', '失败', 1 , 'admin', '369BCFE480454D22A07A8644F6DF0349', NULL, NULL, 15, '2022-11-24 10:22:34', '2022-11-24 10:22:34'),

  ('CE374C948A334E21A25257EF858971A3', 24, '交易方式(jyfs)', '微信', 1 , 'admin', '369BCFE480454D22A07A8644F6DF0349', NULL, NULL, 15, '2022-11-24 10:22:34', '2022-11-24 10:22:34'),
  ('37E05F1636BD4D8080992B515B7FD344', 25, '交易方式(jyfs)', '支付宝', 1 , 'admin', '369BCFE480454D22A07A8644F6DF0349', NULL, NULL, 15, '2022-11-24 10:22:34', '2022-11-24 10:22:34'),
  ('0B7EBDE2702B410AA2B14A408B99B75F', 26, '交易方式(jyfs)', '现金', 1 , 'admin', '369BCFE480454D22A07A8644F6DF0349', NULL, NULL, 15, '2022-11-24 10:22:34', '2022-11-24 10:22:34'),
  ('1BA5D4E14ACC4EDC9E8BBACC478D1603', 27, '交易方式(jyfs)', '刷卡', 1 , 'admin', '369BCFE480454D22A07A8644F6DF0349', NULL, NULL, 15, '2022-11-24 10:22:34', '2022-11-24 10:22:34'),

  ('763A480C51BC4D68AC49F6652D1BF0D2', 28, '菜单类型(cdlx)', '目录', 1 , 'admin', '369BCFE480454D22A07A8644F6DF0349', NULL, NULL, 15, '2022-11-24 10:22:34', '2022-11-24 10:22:34'),
  ('E72D13A4320B41D08452C127174E5392', 29, '菜单类型(cdlx)', '菜单', 1 , 'admin', '369BCFE480454D22A07A8644F6DF0349', NULL, NULL, 15, '2022-11-24 10:22:34', '2022-11-24 10:22:34'),
  ('6F07165F9BF54089B781D91F125283C7', 30, '菜单类型(cdlx)', '按钮', 1 , 'admin', '369BCFE480454D22A07A8644F6DF0349', NULL, NULL, 15, '2022-11-24 10:22:34', '2022-11-24 10:22:34');




-- 初始化 账户表数据
INSERT INTO 
  `wjhs`.`account` (`id`, `user_type`, `user_id`, `balance`, `create_time`, `update_time`) 
VALUES 
  ('11D26E088CDA47D581DD6290AEC61BB7', 0, '369BCFE480454D22A07A8644F6DF0349', 5000, '2022-11-24 10:22:34', '2022-11-24 10:22:34'),
  ('EC9A069267EC4DC5A25AA3A2C5F0A741', 0, 'ADBD5F0E46474696B65140568E43385E', 200, '2022-11-24 10:22:34', '2022-11-24 10:22:34');



-- 初始化 账户流水表数据
INSERT INTO 
  `wjhs`.`account_record` (`id`, `user_type_from`, `user_type_to`, `user_id_from`, `user_id_to`, `trading_id`, `trading_money`, `trading_type`, `trading_note`, `create_time`, `update_time`) 
VALUES 
  ('1331266BF62E47DBBFC277D098B25233', 0, 3, '369BCFE480454D22A07A8644F6DF0349', 'F2532E33786F4B8D9FA2DB00F03352FB', NULL, 5000, 28, '用户注册，系统首次充值', '2022-11-24 10:22:34', '2022-11-24 10:22:34'),
  ('E527EADFA76A46A48164ECEDC65721FD', 0, 2, '369BCFE480454D22A07A8644F6DF0349', 'ADBD5F0E46474696B65140568E43385E', NULL, 200, 28, '用户注册，系统首次充值', '2022-11-24 10:22:34', '2022-11-24 10:22:34');

```



#### 5、数据库脚本更新

`V20221203.01__update_user_password.sql`

```sql
-- 更新密码
update `user` set password = '_hSF8lwCW9Ha2zdsii0AjaOSsVwKQ28Ti3SUe144KXU=' where id = '369BCFE480454D22A07A8644F6DF0349';

update `user` set password = 'qtLSKnRZzQ6j7ERhHQLLfu9Nx1WsdWe87EfQ6mABoTU=' where id = 'ADBD5F0E46474696B65140568E43385E';

update `user` set password = 'Vm4gI_I5r6uH6FaHvT17168U_HhMxNfQCYgN1Ro6Jz23fkEPuSL_W0PkYsW1u27P=' where id = 'F2532E33786F4B8D9FA2DB00F03352FB';
```



`V20221204.01__update_operation_log_table_structure.sql`

```sql
-- 更改字段长度
alter table operation_log modify `url` VARCHAR(255) NOT NULL COMMENT '请求url';
```



`V20221204.02__insert_system_dict_table.sql`

```sql
-- 添加数据
INSERT INTO
  `wjhs`.`system_dict` (`id`, `dict_code`, `dict_name`, `dict_describe`, `sort`, `create_by`, `create_by_user_id`, `update_by`, `update_by_user_id`)
VALUES
  ('7B780A0BF5EB46248FB77D800AD7024D', 31, '终端类型(zdlx)', '小程序', 1 , 'admin', '369BCFE480454D22A07A8644F6DF0349', NULL, NULL),
  ('B81A602284B44052AE1BE0D5EBBA9A2E', 32, '终端类型(zdlx)', 'App', 1 , 'admin', '369BCFE480454D22A07A8644F6DF0349', NULL, NULL);

```



`V20221204.03__update_swiper_and_notice_structure_table.sql`

```sql
-- 更改type字段备注说明
alter table swiper modify `type` char(3)  NOT NULL COMMENT '类型(31:小程序端、32:App端)';

-- 更改type字段备注说明
alter table notice modify `type` char(3)  NOT NULL COMMENT '类型(31:小程序端、32:App端)';
```



`V20221209.01__update_attachment_table_structure.sql`

```sql
-- 更改字段长度
alter table attachment modify `create_by_user_name` varchar(32) not null comment '创建人姓名';

```



`V20221209.02__update_operation_log_table_structure.sql`

```sql
-- 更改字段长度
alter table operation_log modify `user_name` varchar(100) not null comment '操作人员姓名';
alter table operation_log modify `api_method` varchar(255) not null comment 'api方法';
alter table operation_log modify `error_message` text  not null comment '错误消息';

```



`V20221211.01__insert_system_dict_table.sql`

```sql
-- 添加数据
INSERT INTO
  `wjhs`.`system_dict` (`id`, `dict_code`, `dict_name`, `dict_describe`, `sort`, `create_by`, `create_by_user_id`, `update_by`, `update_by_user_id`)
VALUES
  ('6EB0678757884A29870847A2A625526D', 33, '商品状态(spzt)', '上架', 1 , 'admin', '369BCFE480454D22A07A8644F6DF0349', NULL, NULL),
  ('FED74C098E4543BE9B1C82DA06F49985', 34, '商品状态(spzt)', '下架', 1 , 'admin', '369BCFE480454D22A07A8644F6DF0349', NULL, NULL);


```



`V20221211.02__update_recycle_goods_type_table_structure.sql.sql`

```sql
-- 添加上下架状态字段(status)
alter table `recycle_goods_type` add `status` char(3) default 33 COMMENT '商品状态(33:上架、34:下架)' after `is_delete`;
```



`V20221211.03__update_recycle_goods_table_structure.sql.sql`

```sql
-- 添加上下架状态字段(status)
alter table `recycle_goods` add `status` char(3) default 33  COMMENT '商品状态(33:上架、34:下架)' after `is_delete`;
```



`V20221211.04__update_recycle_goods_table_structure.sql`

```sql
-- 更改字段名称
alter table `recycle_goods` change `recycle_center__price` `recycle_center_price` double(7,2) NOT NULL COMMENT '回收中心用户价格';
```









### 二、项目初始化

#### 1、添加依赖

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.5.14</version>
        <relativePath/>
    </parent>

    <groupId>com.ilovesshan.wjhs</groupId>
    <artifactId>wjhs</artifactId>
    <version>0.0.1</version>

    <name>wjhs</name>
    <description>wjhs</description>

    <properties>
        <java.version>1.8</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- mysql 驱动 -->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>

        <!-- lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>


        <!-- druid -->
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid-spring-boot-starter</artifactId>
            <version>1.2.14</version>
        </dependency>

        <!-- mybatis -->
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>2.2.2</version>
        </dependency>


        <!-- Swagger2 -->
        <dependency>
            <groupId>com.github.xiaoymin</groupId>
            <artifactId>knife4j-spring-boot-starter</artifactId>
            <version>2.0.9</version>
        </dependency>


        <!-- DTO字段校验 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- flyway -->
        <dependency>
            <groupId>org.flywaydb</groupId>
            <artifactId>flyway-core</artifactId>
            <version>5.2.4</version>
        </dependency>

        <!-- h2 数据库 -->
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- 单元测试  -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>


        <!-- mapstruct 实体类映射工具-->
        <dependency>
            <groupId>org.mapstruct</groupId>
            <artifactId>mapstruct</artifactId>
            <version>1.4.2.Final</version>
        </dependency>

        <dependency>
            <groupId>org.mapstruct</groupId>
            <artifactId>mapstruct-processor</artifactId>
            <version>1.4.2.Final</version>
        </dependency>


        <!-- token -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt</artifactId>
            <version>0.9.0</version>
        </dependency>


        <!-- Spring-Security 授权认证框架 -->
        <!--        <dependency>-->
        <!--            <groupId>org.springframework.boot</groupId>-->
        <!--            <artifactId>spring-boot-starter-security</artifactId>-->
        <!--        </dependency>-->


        <!-- redis 缓存中间件 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>

        <!-- fastjson -->
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>fastjson</artifactId>
            <version>1.2.68</version>
        </dependency>


        <!-- HTTP协议的客户端编程工具包 -->
        <dependency>
            <groupId>org.apache.httpcomponents</groupId>
            <artifactId>httpclient</artifactId>
            <version>4.5.2</version>
        </dependency>

        <!-- 支持 切面编程 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-aop</artifactId>
        </dependency>

    </dependencies>

    <build>
        <resources>
            <resource>
                <directory>src/main/java</directory>
                <includes>
                    <include>**/*.xml</include>
                </includes>
            </resource>
            <resource>
                <directory>src/main/resources</directory>
            </resource>
        </resources>

        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>

```



#### 2、添加配置文件

+ application.yml

  ```yaml
  server:
    port: ${PORT}
  
  spring:
    application:
      name: wjhs
  
    mvc:
      pathmatch:
        # 配置策略(swagger文档<https://doc.xiaominfo.com/docs/quick-start>)
        matching-strategy: ant-path-matcher
  
    profiles:
      active: dev
  
    datasource:
      druid:
        driver-class-name: com.mysql.cj.jdbc.Driver
        url: jdbc:mysql://${MYSQL_ADDRESS}/${MYSQL_DATABASE}?serverTimezone=Asia/Shanghai&allowMultiQueries=true&useUnicode=true&characterEncoding=UTF-8&useSSL=false
        username: ${MYSQL_USER_NAME}
        password: ${MySQL_PASSWORD}
  
    # redis 配置
    redis:
      port: ${REDIS_PORT}
      host: ${REDIS_HOST}
  
    flyway:
      # 是否启用flyway
      enabled: true
      # 编码格式，默认UTF-8
      encoding: UTF-8
      # 迁移sql脚本文件存放路径，默认db/migration
      locations: classpath:db/migration
      # 迁移sql脚本文件名称的前缀，默认V
      sql-migration-prefix: V
      # 迁移sql脚本文件名称的分隔符，默认2个下划线__
      sql-migration-separator: __
      # 迁移sql脚本文件名称的后缀
      sql-migration-suffixes: .sql
      # 迁移时是否进行校验，默认true
      validate-on-migrate: true
      # 当迁移发现数据库非空且存在没有元数据的表时，自动执行基准迁移，新建schema_version表
      baseline-on-migrate: true
  
    # 文件上传配置
    servlet:
      multipart:
        # 单个文件大小限制
        max-file-size: 5MB
        # 一次请求中所有上传文件总大小限制
        max-request-size: 20MB
  
  
  mybatis:
    # 将包内的映射器接口实现全部注册为映射器
    type-aliases-package: com.ilovesshan.wjhs.beans
  
    # 配置mybatis的mapper路径
    mapper-locations: classpath:mapper/*.xml
  
    configuration:
      # 是否开启驼峰命名自动映射，即从经典数据库列名 A_COLUMN 映射到经典 Java 属性名 aColumn。
      map-underscore-to-camel-case: true
      # 指定 MyBatis 所用日志的具体实现，未指定时将自动查找
      log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
  
  
  # 日志打印级别
  logging:
    level:
      wjhsService: debug
  
    group:
      wjhsService: com.ilovesshan.wjhs.service
  ```

  

  application-dev.yml(开发环境地址)

  ```yaml
  PORT: 80
  
  MYSQL_ADDRESS: localhost:3306
  MYSQL_DATABASE: wjhs
  MYSQL_USER_NAME: root
  MySQL_PASSWORD: 123456
  
  REDIS_HOST: localhost
  REDIS_PORT: 6379
  
  ```

  

  application-pro.yml(生产环境地址)

  ```yaml
  PORT: 8127
  
  MYSQL_ADDRESS: localhost:3306
  MYSQL_DATABASE: wjhs
  MYSQL_USER_NAME: root
  MySQL_PASSWORD: 123456
  
  REDIS_HOST: localhost
  REDIS_PORT: 6379
  ```

  

  application.yml( 测试环境的配置文件)

  ```yaml
  spring:
    application:
      name: wjhs
  
    datasource:
      driver-class-name: org.h2.Driver
      url: jdbc:h2:mem:wjhs # MODE=MySQL;LOCK_MODE=0;DB_CLOSE_ON_EXIT=FALSE;database_to_upper=true;NON_KEYWORDS=USER,account,value,key,month
      username: sa
      password:
  
    sql:
      init:
        continue-on-error: false
        platform: h2
  
    flyway:
      enabled: false
  
    h2:
      console:
        path: /h2
        enabled: true
        settings:
          web-allow-others: true
  ```




#### 3、常量配置文件

```java
public class Constants {
    // JWT有效期(1天)
    public static final Long JWT_EXPIRATION = 1000 * 60 * 60 * 24L;

    // JWT令牌信息
    public static final String JWT_KEY = "RANDOM";

    // 请求头键
    public static final String HEADER_KEY = "Authorization";

    // 请求头值(前缀)
    public static final String HEADER_VALUE_PREFIX = "Bearer ";

    // 小程序请求头值(前缀)
    public static final String HEADER_WX_VALUE_PREFIX = "Openid ";

    // redis中缓存用户信息(前缀)
    public static final String REDIS_USER_PREFIX = "user:";

    // redis中缓存小程序用户信息(前缀)
    public static final String REDIS_WX__USER_PREFIX = "wx:";

    // 附件上传地址(windows)
    public static final String ATTACHMENT_UPLOAD_WINDOWS_DEST = "D:/www/wjhs/upload/";

    // 附件上传地址(linux)
    public static final String ATTACHMENT_UPLOAD_LINUX_DEST = "/home/www/wjhs/upload/";

    // 文件预览前缀
    public static final String FILE_PREVIEW_PREFIX = "/preview/";

}

```



#### 4、搭建swagger文档库

+ 添加依赖

  ```xml
  <!-- Swagger2 -->
  <dependency>
      <groupId>com.github.xiaoymin</groupId>
      <artifactId>knife4j-spring-boot-starter</artifactId>
      <version>2.0.9</version>
  </dependency>
  ```

  

+ 创建Swagger配置依赖

  需要注意knife4j和springBoot版本(参考项目代码)，版本不兼容可能会造成项目启动失败。

  ```java
  @Configuration
  @EnableSwagger2WebMvc
  public class Knife4jConfig {
      @Bean(value = "dockerBean")
      public Docket dockerBean() {
          //指定使用Swagger2规范
          Docket docket = new Docket(DocumentationType.SWAGGER_2)
                  .apiInfo(new ApiInfoBuilder()
                          //描述字段支持Markdown语法
                          .description("# 网捷回收 APIs")
                          .termsOfServiceUrl("https://ilovesshan.com")
                          .contact(new Contact("ilovesshan", "http://localhost/doc.html", "2665939276@qq.com"))
                          .version("1.0")
                          .build())
                  //分组名称
                  .groupName("用户服务")
                  .select()
                  //这里指定Controller扫描包路径
                  .apis(RequestHandlerSelectors.basePackage("com.ilovesshan.wjhs.controller"))
                  .paths(PathSelectors.any())
                  .build();
          return docket;
      }
  }
  ```
  
  如果开发者使用的是Knife4j 2.x版本，并且Spring Boot版本高于2.4,那么需要在Spring Boot的yml文件中做如下配置：
  
  ```yaml
  spring:
      mvc:
          pathmatch:
              # 配置策略
              matching-strategy: ant-path-matcher
  ```
  
  
  
+ 使用swagger、新建一个接口Controller类，如下

  ```java
  @Api(tags = "首页")
  @Controller
  @RequestMapping
  public class IndexController {
      @GetMapping
      @ResponseBody
      @ApiOperation("index")
      public String index() {
          return "欢迎访问wjhs项目接口API文档,详细地址: http://localhost/doc.html";
      }
  }
  ```
  
  万事俱备，启动Spring Boot项目，浏览器访问Knife4j的文档地址即可查看效果，http://localhost/doc.html
  
  

#### 5、配置跨域 

```java
@Configuration
public class CrossConfig {
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        //允许所有域名进行跨域调用
        config.addAllowedOriginPattern("*");
        //允许跨越发送cookie
        config.setAllowCredentials(true);
        //放行全部原始头信息
        config.addAllowedHeader("*");
        //允许所有请求方法跨域调用
        config.addAllowedMethod("*");
        config.addExposedHeader("*");
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
```



### 三、常用工具类

#### 1、客户端响应工具类

```java
package com.ilovesshan.wjhs.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class ResponseUtil {

    /**
     * 响应给客户端数据工具类(JSON格式)
     *
     * @param response     响应对象
     * @param responseData 响应数据
     * @throws IOException
     */
    public static void write(HttpServletResponse response, Object responseData) throws IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Cache-Control", "no-cache");
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        String responseJson = new ObjectMapper().writeValueAsString(responseData);
        response.getWriter().print(responseJson);
        response.getWriter().flush();
    }


    /**
     * 响应给客户端数据工具类(JSON格式)
     *
     * @param response     响应对象
     * @param status       Http状态码
     * @param responseData 响应数据
     * @throws IOException
     */
    public static void write(HttpServletResponse response, int status, Object responseData) throws IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Cache-Control", "no-cache");
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");
        response.setStatus(status);
        String responseJson = new ObjectMapper().writeValueAsString(responseData);
        response.getWriter().print(responseJson);
        response.getWriter().flush();
    }

}

```



#### 2、缓存用户信息工具类

```java
package com.ilovesshan.wjhs.core.base;

import java.util.HashMap;
import java.util.Map;

public class UserCache {

    private static final ThreadLocal<Map<String, String>> THREAD_LOCAL = new ThreadLocal<>();

    //判断线程map是否为空，为空就添加一个map
    public static Map<String, String> getLocalMap() {
        Map<String, String> map = THREAD_LOCAL.get();
        if (map == null) {
            map = new HashMap<>(16);
            THREAD_LOCAL.set(map);
        }
        return map;
    }

    //把用户信息添加到线程map中
    public static void set(String key, String name) {
        Map<String, String> map = getLocalMap();
        map.put(key, name);
    }

    //获得线程map中的数据
    public static String get(String key) {
        Map<String, String> map = getLocalMap();
        return map.get(key);
    }
}

```



#### 3、Redis 工具类

+ 序列化

  ```java
  package com.ilovesshan.wjhs.core.config;
  
  import com.alibaba.fastjson.JSON;
  import org.springframework.beans.factory.annotation.Autowired;
  import org.springframework.data.redis.core.RedisTemplate;
  import org.springframework.stereotype.Component;
  
  import java.util.Set;
  import java.util.concurrent.TimeUnit;
  
  @Component
  public class RedisCache {
  
      @Autowired
      private RedisTemplate<String, String> redisTemplate;
  
      public void set(String key, Object value, long timeout) {
          redisTemplate.opsForValue().set(key, JSON.toJSONString(value), timeout, TimeUnit.MILLISECONDS);
      }
  
      public void set(String key, Object value) {
          redisTemplate.opsForValue().set(key, JSON.toJSONString(value));
      }
  
      public <T> T get(String key, Class<T> clazz) {
          return JSON.parseObject(redisTemplate.opsForValue().get(key), clazz);
      }
  
      public void remove(String key) {
          redisTemplate.delete(key);
      }
  
      public Set<String> keys() {
          return redisTemplate.keys(null);
      }
  
      public Set<String> keys(String pattern) {
          return redisTemplate.keys(pattern);
      }
  }
  ```

  

+ 常用方法封装

  ```java
  package com.ilovesshan.wjhs.core.config;
  
  import com.alibaba.fastjson.support.spring.GenericFastJsonRedisSerializer;
  import org.springframework.context.annotation.Bean;
  import org.springframework.context.annotation.Configuration;
  import org.springframework.data.redis.connection.RedisConnectionFactory;
  import org.springframework.data.redis.core.RedisTemplate;
  import org.springframework.data.redis.serializer.RedisSerializer;
  
  @Configuration
  public class RedisConfig {
  
      @Bean(name = "redisTemplate")
      public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
          RedisTemplate<String, Object> template = new RedisTemplate<>();
          // 使用fastjson进行序列化
          RedisSerializer<Object> redisSerializer = new GenericFastJsonRedisSerializer();
          template.setConnectionFactory(factory);
          //key序列化方式
          template.setKeySerializer(redisSerializer);
          //value序列化
          template.setValueSerializer(redisSerializer);
          //value hashmap序列化
          template.setHashValueSerializer(redisSerializer);
          //key hashmap序列化
          template.setHashKeySerializer(redisSerializer);
          return template;
      }
  }
  
  ```

  



#### 4、Uuid工具类

```java
public class UuidUtil {
    public static String generator() {
        return UUID.randomUUID().toString().replace("-", "");
    }
}
```



#### 5、token工具类

```java
package com.ilovesshan.wjhs.utils;

import com.ilovesshan.wjhs.contants.Constants;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.impl.DefaultClaims;

import java.util.Date;

public class JwtUtil {

    // 生成token+
    public static String generatorToken(String userId, String username) {
        Claims claims = new DefaultClaims();
        claims.put("userId", userId);
        claims.put("username", username);
        return Jwts.builder()
                .setId(userId)
                .setClaims(claims)
                .signWith(SignatureAlgorithm.HS256, Constants.JWT_KEY.getBytes())
                .setExpiration(new Date(System.currentTimeMillis() + Constants.JWT_EXPIRATION))
                .compact();
    }

    // 获取Claims对象
    public static Claims parseToken(String token) {
        Claims claims = null;
        try {
            claims = Jwts.parser().setSigningKey(Constants.JWT_KEY.getBytes()).parseClaimsJws(token).getBody();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        return claims;
    }

    // 获取用户Id
    public static String getUserId(String token) {
        return (String) parseToken(token).get("userId");
    }


    // 获取用户名
    public static String getUsername(String token) {
        return (String) parseToken(token).get("username");
    }
}
```



#### 6、HttpClient工具类

```java
package com.ilovesshan.wjhs.utils;


import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;

import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;


public class HttpClientUtil {

    public static String doGet(String url, Map<String, String> param) {

        // 创建Httpclient对象
        CloseableHttpClient httpclient = HttpClients.createDefault();

        String resultString = "";
        CloseableHttpResponse response = null;
        try {
            // 创建uri
            URIBuilder builder = new URIBuilder(url);
            if (param != null) {
                for (String key : param.keySet()) {
                    builder.addParameter(key, param.get(key));
                }
            }
            URI uri = builder.build();

            // 创建http GET请求
            HttpGet httpGet = new HttpGet(uri);

            // 执行请求
            response = httpclient.execute(httpGet);
            // 判断返回状态是否为200
            if (response.getStatusLine().getStatusCode() == 200) {
                resultString = EntityUtils.toString(response.getEntity(), "UTF-8");
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (response != null) {
                    response.close();
                }
                httpclient.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return resultString;
    }

    public static String doGet(String url) {
        return doGet(url, null);
    }

    public static String doPost(String url, Map<String, String> param) {
        // 创建Httpclient对象
        CloseableHttpClient httpClient = HttpClients.createDefault();
        CloseableHttpResponse response = null;
        String resultString = "";
        try {
            // 创建Http Post请求
            HttpPost httpPost = new HttpPost(url);
            // 创建参数列表
            if (param != null) {
                List<NameValuePair> paramList = new ArrayList<>();
                for (String key : param.keySet()) {
                    paramList.add(new BasicNameValuePair(key, param.get(key)));
                }
                // 模拟表单
                UrlEncodedFormEntity entity = new UrlEncodedFormEntity(paramList);
                httpPost.setEntity(entity);
            }
            // 执行http请求
            response = httpClient.execute(httpPost);
            resultString = EntityUtils.toString(response.getEntity(), "utf-8");
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                response.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return resultString;
    }

    public static String doPost(String url) {
        return doPost(url, null);
    }

    public static String doPostJson(String url, String json) {
        // 创建Httpclient对象
        CloseableHttpClient httpClient = HttpClients.createDefault();
        CloseableHttpResponse response = null;
        String resultString = "";
        try {
            // 创建Http Post请求
            HttpPost httpPost = new HttpPost(url);
            // 创建请求内容
            StringEntity entity = new StringEntity(json, ContentType.APPLICATION_JSON);
            httpPost.setEntity(entity);
            // 执行http请求
            response = httpClient.execute(httpPost);
            resultString = EntityUtils.toString(response.getEntity(), "utf-8");
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                response.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return resultString;
    }
}
```



#### 7、WxChatUtil 微信工具类

```java
package com.ilovesshan.wjhs.utils;


import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class WxChatUtil {
    public static JSONObject getSessionKeyAndOpenId(String code) {
        String requestUrl = "https://api.weixin.qq.com/sns/jscode2session";
        Map<String, String> requestUrlParam = new HashMap<>();
        // https://mp.weixin.qq.com/wxopen/devprofile?action=get_profile&token=164113089&lang=zh_CN
        //小程序appId
        requestUrlParam.put("appid", "wxbfbcf187cabc26d2");
        //小程序secret
        requestUrlParam.put("secret", "f0448294ad1c8ecc2863326fe081c7b0");
        //小程序端返回的code
        requestUrlParam.put("js_code", code);
        //默认参数
        requestUrlParam.put("grant_type", "authorization_code");
        //发送post请求读取调用微信接口获取openid用户唯一标识
        JSONObject jsonObject = JSON.parseObject(HttpClientUtil.doPost(requestUrl, requestUrlParam));
        return jsonObject;
    }
}
```



#### 8、通用响应实体类

```java
package com.ilovesshan.wjhs.utils;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * Created with IntelliJ IDEA.
 *
 * @author: ilovesshan
 * @date: 2022/11/4
 * @description:
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class R implements Serializable {

    private static final long serialVersionUID = 1946123740512009003L;


    public static final int SUCCESS_CODE = 200;
    public static final int ERROR_CODE_CLIENT = -200;
    public static final int ERROR_CODE_AUTHORIZATION = 401;
    public static final int ERROR_CODE_FORBIDDEN = 403;
    public static final int ERROR_CODE_INTERNAL_SERVER = 500;


    public static final String SUCCESS_MESSAGE = "操作成功";
    public static final String SUCCESS_MESSAGE_SELECT = "查询成功";
    public static final String SUCCESS_MESSAGE_INSERT = "新增成功";
    public static final String SUCCESS_MESSAGE_DELETE = "删除成功";
    public static final String SUCCESS_MESSAGE_UPDATE = "更新成功";

    public static final String ERROR_MESSAGE = "操作失败";
    public static final String ERROR_MESSAGE_SELECT = "查询失败";
    public static final String ERROR_MESSAGE_INSERT = "新增失败";
    public static final String ERROR_MESSAGE_DELETE = "删除失败";
    public static final String ERROR_MESSAGE_UPDATE = "更新失败";

    public static final String SUCCESS_MESSAGE_LOGIN = "登录成功";
    public static final String ERROR_MESSAGE_LOGIN = "登录失败";

    public static final String SUCCESS_MESSAGE_REGISTER = "注册成功";
    public static final String ERROR_MESSAGE_REGISTER = "注册失败";

    public static final String SUCCESS_MESSAGE_LOGOUT = "退出登录成功";
    public static final String ERROR_MESSAGE_LOGOUT = "退出登录失败";

    public static final String ERROR_MESSAGE_FORBIDDEN = "暂无权限访问/操作该资源";
    public static final String ERROR_INSUFFICIENT_AUTHENTICATION = "身份认证失败，无效的令牌";
    public static final String ERROR_WX_VALID_CODE = "无效的code,请到微信开发平台校验";

    public static final String ERROR_USER_DISABLED = "账户不可用";
    public static final String ERROR_USER_LOCKED = "账户锁定";
    public static final String ERROR_USER_NAME_OR_PASSWORD = "用户名或者密码错误";
    public static final String ERROR_OLD_PASSWORD = "旧密码错误";
    public static final String ERROR_USER_NOT_FOUND = "用户不存在";
    public static final String ERROR_USER_ALREADY_EXIST = "用户已经存在";


    public static final String ERROR_RESOURCES_NOTFOUND = "资源不存在";
    public static final String ERROR_RESOURCES_EXISTS = "资源已存在";
    public static final String SUCCESS_ATTACHMENT_UPLOAD = "附件上传成功";
    public static final String ERROR_ATTACHMENT_UPLOAD = "附件上传失败";
    public static final String ERROR_ATTACHMENT_NOTFOUND = "附件不存在";


    private Integer code;
    private String message;
    private Object data;


    public static R success() {
        return R.builder().code(R.SUCCESS_CODE).message(R.SUCCESS_MESSAGE).build();
    }

    public static R success(String message) {
        return R.builder().code(R.SUCCESS_CODE).message(message).build();
    }

    public static R success(Object data) {
        return R.builder().code(R.SUCCESS_CODE).message(R.SUCCESS_MESSAGE).data(data).build();
    }

    public static R success(String message, Object data) {
        return R.builder().code(R.SUCCESS_CODE).message(message).data(data).build();
    }


    public static R fail() {
        return R.builder().code(R.ERROR_CODE_CLIENT).message(R.ERROR_MESSAGE).build();
    }

    public static R fail(String message) {
        return R.builder().code(R.ERROR_CODE_CLIENT).message(message).build();
    }

    public static R fail(Object data) {
        return R.builder().code(R.ERROR_CODE_CLIENT).message(R.ERROR_MESSAGE).data(data).build();
    }

    public static R fail(String message, Object data) {
        return R.builder().code(R.ERROR_CODE_CLIENT).message(message).data(data).build();
    }


    public static R error() {
        return R.builder().code(R.ERROR_CODE_INTERNAL_SERVER).message(R.ERROR_MESSAGE).build();
    }

    public static R error(String message) {
        return R.builder().code(R.ERROR_CODE_INTERNAL_SERVER).message(message).build();
    }

    public static R error(Object data) {
        return R.builder().code(R.ERROR_CODE_INTERNAL_SERVER).message(R.SUCCESS_MESSAGE).data(data).build();
    }

    public static R error(String message, Object data) {
        return R.builder().code(R.ERROR_CODE_INTERNAL_SERVER).message(message).data(data).build();
    }

}
```



#### 9、全局异常处理

```java
public class CustomException extends RuntimeException {
    public CustomException(String message) {
        super(message);
    }
}

public class AuthorizationException extends RuntimeException {
    public AuthorizationException(String message) {
        super(message);
    }
}

public class AccessDeniedException extends RuntimeException {
    public AccessDeniedException(String message) {
        super(message);
    }
}
```

```java
package com.ilovesshan.wjhs.core.handler;

import com.ilovesshan.wjhs.core.exception.AccessDeniedException;
import com.ilovesshan.wjhs.core.exception.AuthorizationException;
import com.ilovesshan.wjhs.core.exception.CustomException;
import com.ilovesshan.wjhs.utils.R;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;


@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 自定义异常
     */
    @ExceptionHandler(CustomException.class)
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    public R handleException(CustomException exception) {
        exception.printStackTrace();
        return R.fail(exception.getMessage(), null);
    }


    /**
     * 参数不匹配异常
     */
    @ExceptionHandler(value = {MethodArgumentNotValidException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public R handleMethodArgumentNotValidExceptionHandler(MethodArgumentNotValidException exception) {
        exception.printStackTrace();
        return R.fail(exception.getAllErrors().get(0).getDefaultMessage());
    }

    /**
     * 暂无权限访问/操作该资源
     */
    @ExceptionHandler(value = {AccessDeniedException.class})
    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ResponseBody
    public R handleMethodArgumentNotValidExceptionHandler(AccessDeniedException exception) {
        exception.printStackTrace();
        return R.builder().code(R.ERROR_CODE_FORBIDDEN).message(R.ERROR_MESSAGE_FORBIDDEN).build();
    }


    /**
     * 权限异常
     */
    @ExceptionHandler(value = {AuthorizationException.class})
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ResponseBody
    public R handleMethodArgumentNotValidExceptionHandler(AuthorizationException exception) {
        exception.printStackTrace();
        return R.builder().code(R.ERROR_CODE_AUTHORIZATION).message(exception.getMessage()).build();
    }


    /**
     * 其他异常
     */
    @ExceptionHandler(Exception.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public R handleException(Exception exception) {
        exception.printStackTrace();
        return R.error(exception.getMessage(), null);
    }
}

```



#### 10、Aes加解密工具类

```java
package com.ilovesshan.wjhs.utils;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * AES加密解密工具
 */

public class AesUtils {

    public static final String secretKey = "MIICdQIBADANBgkqhkiG9";
    public static final String AES = "AES";
    public static final String charsetName = "UTF-8";

    public static SecretKeySpec generateKey(String password) throws Exception {
        KeyGenerator keyGenerator = KeyGenerator.getInstance(AES);
        SecureRandom random = SecureRandom.getInstance("SHA1PRNG");
        random.setSeed(password.getBytes());
        keyGenerator.init(128, random);
        SecretKey original_key = keyGenerator.generateKey();
        return new SecretKeySpec(original_key.getEncoded(), AES);
    }

    public static String AESEncode(String content, String password) {
        try {
            Cipher cipher = Cipher.getInstance(AES);
            cipher.init(Cipher.ENCRYPT_MODE, generateKey(password));
            byte[] bytes = cipher.doFinal(content.getBytes(charsetName));
            return Base64.getUrlEncoder().encodeToString(bytes);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static String AESDecode(String content, String password) {
        try {
            byte[] bytes = Base64.getUrlDecoder().decode(content);
            Cipher cipher = Cipher.getInstance(AES);
            cipher.init(Cipher.DECRYPT_MODE, generateKey(password));
            byte[] result = cipher.doFinal(bytes);
            return new String(result, charsetName);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static String encrypt(String content) {
        return AESEncode(AESEncode(content, secretKey), secretKey);
    }

    public static String decrypt(String content) {
        return AESDecode(AESDecode(content, secretKey), secretKey);
    }
}

```



#### 11、系统工具类

```java
public class SystemUtil {
    /**
     * 当前系统环境是否是 windows
     *
     * @return boolean
     */
    public static boolean isWindows() {
        return System.getProperty("os.name").toLowerCase().startsWith("win");
    }
}
```





### 四、用户授权

#### 1、普通用户

```java
@Data
public class UserAuthDto {
    @NotNull(message = "用户名不能为空")
    @Size(max = 24, min = 4, message = "用户名长度在4到24个字符之间")
    private String username;
    @NotNull(message = "密码不能为空")
    @Size(max = 32, min = 6, message = "密码长度在6到32个字符之间")
    private String password;
}
```

```java
@Component
@Mapper(componentModel = "spring")
public interface UserConverter {
    UserVo po2vo(User user);
}
```

```java
@Api(tags = "授权模块")
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @ApiOperation("用户授权")
    @PostMapping
    public R auth(@Validated @RequestBody UserAuthDto userAuthDto) {
        String token = authService.auth(userAuthDto);
        HashMap<String, String> data = new HashMap<>();
        data.put("id", JwtUtil.getUserId(token));
        data.put("username", userAuthDto.getUsername());
        data.put("token", token);
        return R.success(R.SUCCESS_MESSAGE_LOGIN, data);
    }

    @ApiOperation("用户注销")
    @DeleteMapping
    public R logout() {
        authService.logout();
        return R.success(R.SUCCESS_MESSAGE_LOGOUT);
    }
}
```

```java
@Service
@Slf4j
public class AuthServiceImpl implements AuthService {

    @Autowired
    private RedisCache redisCache;

    @Autowired
    private UserService userService;

    @Override
    public String auth(UserAuthDto userAuthDto) {
        User finedUser = userService.findUserByUsername(userAuthDto.getUsername());
        // 用户不存在
        if (Objects.isNull(finedUser)) {
            throw new CustomException(R.ERROR_USER_NOT_FOUND);
        }

        // 用户名或者密码错误
        if (!userAuthDto.getPassword().equals(AesUtils.decrypt(finedUser.getPassword()))) {
            throw new CustomException(R.ERROR_USER_NAME_OR_PASSWORD);
        }

        // 将用户登录信息存在redis中
        redisCache.set(Constants.REDIS_USER_PREFIX + finedUser.getId(), finedUser, Constants.JWT_EXPIRATION);

        //  返回Token
        return JwtUtil.generatorToken(finedUser.getId(), finedUser.getUsername());
    }

    @Override
    public void logout() {
        String userId = UserCache.get("userId");
        String username = UserCache.get("username");

        // 从redis中删除用户信息
        redisCache.remove(Constants.REDIS_USER_PREFIX + userId);

        log.debug("{}退出登录, 用户ID: {}", username, userId);
    }
}
```



#### 2、小程序用户

```java
@Api(tags = "小程序授权模块")
@RestController
@RequestMapping("/wx/auth")
public class WxAuthController {

    @Autowired
    private WxAuthService wxAuthService;

    @Autowired
    private WxUserConverter wxUserConverter;

    @ApiOperation("授权")
    @PostMapping
    public R auth(@RequestParam(value = "code", required = false) String code) {
        WxUser wxUser = wxAuthService.auth(code);
        return R.success(R.SUCCESS_MESSAGE_LOGIN, wxUserConverter.po2AuthVo(wxUser));
    }
}
```

```java
@Service
public class WxAuthServiceImpl implements WxAuthService {

    @Autowired
    private RedisCache redisCache;

    @Autowired
    private WxUserService wxUserService;

    @Override
    public WxUser auth(String code) {
        // 获取sessionKey和openId
        JSONObject SessionKeyOpenId = WxChatUtil.getSessionKeyAndOpenId(code);
        String openid = SessionKeyOpenId.getString("openid");
        String sessionKey = SessionKeyOpenId.getString("session_key");

        // 如果sessionKey或者openId无效
        if (!StringUtils.hasText(openid) || !StringUtils.hasText(sessionKey)) {
            throw new AuthorizationException(R.ERROR_WX_VALID_CODE);
        }

        // 根据openid去数据库查询、不存在就是新用户 存在就更新登录时间
        WxUser selectedUser = wxUserService.findUserByOpenId(openid);
        if (Objects.isNull(selectedUser)) {
            WxUser wxUser = new WxUser();
            wxUser.setId(UuidUtil.generator());
            wxUser.setOpenId(openid);
            wxUser.setSessionKey(sessionKey);
            wxUser.setSkey(UuidUtil.generator());
            wxUser.setLastVisitTime(new Date());
            wxUserService.insert(wxUser);
            // 将用户登录信息存在redis中
            redisCache.set(Constants.REDIS_WX__USER_PREFIX + wxUser.getOpenId(), wxUser, Constants.JWT_EXPIRATION);
            return wxUser;
        } else {
            // 更新最后登录时间
            selectedUser.setLastVisitTime(new Date());
            wxUserService.update(selectedUser);
            // 将用户登录信息存在redis中
            redisCache.set(Constants.REDIS_WX__USER_PREFIX + selectedUser.getOpenId(), selectedUser, Constants.JWT_EXPIRATION);
            return selectedUser;
        }
    }
}
```



#### 3、拦截器鉴权

+ 添加自定义拦截器 `SecurityHandlerInterceptor` 并实现 `HandlerInterceptor`接口，重写 `preHandle` 方法。

  ```java
  public class SecurityHandlerInterceptor implements HandlerInterceptor {
  
      @Autowired
      private RedisCache redisCache;
  
      @Override
      public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
          String authorization = request.getHeader(Constants.HEADER_KEY);
          // 不存在登录凭证(token或者openId)
          if (!StringUtils.hasText(authorization)) {
              ResponseUtil.write(response, R.builder().code(R.ERROR_CODE_AUTHORIZATION).message(R.ERROR_INSUFFICIENT_AUTHENTICATION).build());
              return false;
          }
  
          // 处理小程序端的业务逻辑
          if (authorization.contains(Constants.HEADER_WX_VALUE_PREFIX)) {
              String openId = authorization.replace(Constants.HEADER_WX_VALUE_PREFIX, "");
              WxUser finedUser = redisCache.get(Constants.REDIS_WX__USER_PREFIX + openId, WxUser.class);
              if (Objects.isNull(finedUser)) {
                  throw new AuthorizationException(R.ERROR_INSUFFICIENT_AUTHENTICATION);
              }
              // 将当前用户ID和用户名称存在UserCache中 方便在任意地方获取
              UserCache.set("userId", finedUser.getId());
              UserCache.set("username", finedUser.getNickName());
              UserCache.set("userType", "1");
              return true;
          } else {
              String userId = JwtUtil.getUserId(authorization.replace(Constants.HEADER_VALUE_PREFIX, ""));
              // 去redis中查询用户信息
              User finedUser = redisCache.get(Constants.REDIS_USER_PREFIX + userId, User.class);
              if (Objects.isNull(finedUser)) {
                  throw new AuthorizationException(R.ERROR_INSUFFICIENT_AUTHENTICATION);
              }
              // 将当前用户ID和用户名称存在UserCache中 方便在任意地方获取
              UserCache.set("userId", userId);
              UserCache.set("username", finedUser.getUsername());
              UserCache.set("userType", finedUser.getUserType());
              return true;
          }
      }
  }
  
  ```
  
+ 添加自定类 `WebMvcConfig` 实现 `WebMvcConfigurer` 接口，重写 `addResourceHandlers` 和 `addInterceptors` 方法。

  ```java
  @Configuration
  public class WebMvcConfig implements WebMvcConfigurer {
  
      // 注入拦截器
      @Bean
      public SecurityHandlerInterceptor securityHandlerInterceptor() {
          return new SecurityHandlerInterceptor();
      }
  
      @Override
      public void addInterceptors(InterceptorRegistry registry) {
          registry.addInterceptor(securityHandlerInterceptor())
                  .addPathPatterns("/**")
                  .excludePathPatterns("/auth", "/wx/auth", "/preview/**")
                  .excludePathPatterns("/doc.html", "/webjars/**", "/img.icons/**", "/swagger-resources/**", "/v2/api-docs");
      }
  }
  ```
  



### 五、异步操作日志

#### 1、自定义注解

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Log {
    // 业务模块
    String businessModule();

    // 业务类型
    String businessType();

    // 描述信息
    String businessDescribe() default "";
}

```



#### 2、定义切面

```java
@Aspect
@Component
public class LogAspect {

    @Autowired
    private OperationLogService operationLogService;

    // 最终通知
    @AfterReturning(pointcut = "@annotation(log)")
    public void afterReturningAdvice(JoinPoint joinPoint, Log log) {
        OperationLog operationLog = generatorLogOperation(joinPoint, log, null);
        operationLogService.insert(operationLog);
    }


    // 异常通知
    @AfterThrowing(pointcut = "@annotation(log)", throwing = "exception")
    public void afterThrowingAdvice(JoinPoint joinPoint, Log log, Exception exception) {
        OperationLog operationLog = generatorLogOperation(joinPoint, log, exception);
        operationLogService.insert(operationLog);
    }


    public OperationLog generatorLogOperation(JoinPoint joinPoint, Log log, Exception exception) {
        HttpServletRequest request = ((ServletRequestAttributes) Objects.requireNonNull(RequestContextHolder.getRequestAttributes())).getRequest();
        OperationLog operationLog = new OperationLog();
        operationLog.setId(UuidUtil.generator());
        operationLog.setBusinessModule(log.businessModule());
        operationLog.setBusinessType(log.businessType());
        operationLog.setBusinessDescribe(log.businessDescribe());
        operationLog.setApiMethod(joinPoint.getSignature().getName());
        operationLog.setRequestMethod(request.getMethod());
        operationLog.setUserId(UserCache.get("userId"));
        operationLog.setUserName(UserCache.get("username"));
        operationLog.setUserType(UserCache.get("userType"));
        operationLog.setUrl(request.getRequestURI());
        operationLog.setIp(request.getRemoteAddr());
        if (exception == null) {
            operationLog.setStatus("200");
            operationLog.setErrorMessage("");
        } else {
            operationLog.setStatus("500");
            operationLog.setErrorMessage(exception.getMessage());
        }
        operationLog.setOperationTime(new Date());

        return operationLog;
    }

}
```



#### 3、service层

```java
public interface OperationLogService {
    void insert(OperationLog operationLog);
}
```

```java
@Service
public class OperationLogServiceImpl implements OperationLogService {

    @Autowired
    private OperationLogMapper operationLogMapper;

	// 这里使用 @Async注解、可以实现异步功能提高UI响应速度
    //  @Async注解需要 使用@EnableAsync注解后，才生效
    @Async
    @Override
    public void insert(OperationLog operationLog) {
        operationLogMapper.insert(operationLog);
    }
}
```



#### 4、@EnableAsync 注解

```java
@SpringBootApplication
@EnableAsync
public class WjhsApplication {

    public static void main(String[] args) {
        SpringApplication.run(WjhsApplication.class, args);
    }
}
```



#### 5、`@Log`使用方法

```java
@Log(businessModule = "用户模块", businessType = "UPDATE", businessDescribe = "更新用户信息")   
public void update() {}

@Log(businessModule = "附件模块", businessType = "DELETE", businessDescribe = "根据ID删除附件")
public void deleteById() {}
```



### 六、文件管理

#### 1、配置虚拟路径

```java
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    // 注入拦截器
    // ...


    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 区分当前运行的系统环境
        registry.addResourceHandler("/preview/**").addResourceLocations("file:" + (SystemUtil.isWindows() ? Constants.ATTACHMENT_UPLOAD_WINDOWS_DEST : Constants.ATTACHMENT_UPLOAD_LINUX_DEST));
    }


    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // ...
    }
}
```



#### 2、文件上传controller层

```java
@Api(tags = "附件模块")
@RestController
@RequestMapping("attachments")
public class AttachmentController {

    @Autowired
    private AttachmentService attachmentService;

    @Autowired
    private AttachmentConverter attachmentConverter;

    @ApiOperation("上传附件")
    @PostMapping
    @Log(businessModule = "附件模块", businessType = "POST", businessDescribe = "上传附件")
    public R upload(@RequestParam("file") MultipartFile file) {
        String attachmentId = attachmentService.upload(file);
        Attachment attachment = attachmentService.selectById(attachmentId);
        return R.success(R.SUCCESS_ATTACHMENT_UPLOAD, attachmentConverter.po2vo(attachment));
    }


    @ApiOperation("根据ID查询附件")
    @GetMapping("/{id}")
    public R select(@PathVariable String id) {
        Attachment attachment = attachmentService.selectById(id);
        return R.success(R.SUCCESS_MESSAGE_SELECT, attachmentConverter.po2vo(attachment));
    }


    @Log(businessModule = "附件模块", businessType = "DELETE", businessDescribe = "根据ID删除附件")
    @ApiOperation("根据ID删除附件")
    @DeleteMapping("/{id}")
    public R deleteById(@PathVariable String id) {
        attachmentService.deleteById(id);
        return R.success(R.SUCCESS_MESSAGE_DELETE);
    }
}
```



#### 3、文件上传Service层

```java
public interface AttachmentService {
    String upload(MultipartFile multipartFile);

    boolean saveAttachment(Attachment attachment);

    Attachment selectById(String id);

    boolean deleteById(String id);
}
```

```java
@Service
@Slf4j
public class AttachmentServiceImpl implements AttachmentService {

    @Autowired
    private AttachmentMapper attachmentMapper;

    @Override
    public String upload(MultipartFile multipartFile) {
        // 区分当前运行的系统环境
        File fileDir = new File(SystemUtil.isWindows() ? Constants.ATTACHMENT_UPLOAD_WINDOWS_DEST : Constants.ATTACHMENT_UPLOAD_LINUX_DEST);

        if (!fileDir.exists()) {
            fileDir.mkdirs();
        }
        // 获取文件扩展名
        String ext = multipartFile.getOriginalFilename().substring(multipartFile.getOriginalFilename().lastIndexOf("."));

        // 文件名称
        String fileName = UuidUtil.generator() + ext;

        try {
            multipartFile.transferTo(new File(fileDir + File.separator + fileName));
        } catch (IOException e) {
            e.printStackTrace();
            throw new CustomException(R.ERROR_ATTACHMENT_UPLOAD);
        }

        // 组装一个Attachment对象 新增到数据库
        Attachment attachment = new Attachment();
        attachment.setId(UuidUtil.generator());
        attachment.setUrl(Constants.FILE_PREVIEW_PREFIX + fileName);
        attachment.setCreateByUserId(UserCache.get("userId"));
        attachment.setCreateByUserName(UserCache.get("username"));
        attachment.setCreateByUserType(UserCache.get("userType"));
        saveAttachment(attachment);
        return attachment.getId();
    }


    @Override
    public boolean saveAttachment(Attachment attachment) {
        return attachmentMapper.insert(attachment) > 0;
    }

    @Override
    public Attachment selectById(String id) {
        return attachmentMapper.selectById(id);
    }

    @Override
    public boolean deleteById(String id) {
        Attachment finedAttachment = selectById(id);
        if (Objects.isNull(finedAttachment)) {
            throw new CustomException(R.ERROR_ATTACHMENT_NOTFOUND);
        }

        String filePath = (SystemUtil.isWindows() ? Constants.ATTACHMENT_UPLOAD_WINDOWS_DEST : Constants.ATTACHMENT_UPLOAD_LINUX_DEST) + finedAttachment.getUrl();
        // 删除本地文件  替换掉 "//preview" 预览前缀
        boolean deleteSuccess = new File(filePath.replace("//preview", "")).delete();
        if (deleteSuccess) {
            // 删除数据库文件
            return attachmentMapper.deleteById(id) > 0;
        } else {
            throw new CustomException(R.ERROR_MESSAGE_DELETE);
        }
    }
}
```

