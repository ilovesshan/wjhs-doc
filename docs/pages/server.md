服务端开发文档

### 第一章、数据库设计

#### 1、数据表预览

```
-- 系统字典表
-- 用户操作日志表
-- 用户登录日志表
-- 小程序用户信息表
-- 小程序用户地址信息表
-- 小程序用户信息和地址信息关联表
-- 骑手/回收中心/平台用户表
-- 角色表
-- 用户角色关联表
-- 权限表
-- 角色权限关联表
-- 附件表
-- 轮播图表
-- 公告栏表
-- 回收商品分类表
-- 回收商品表
-- 回收商品订单表
-- 回收商品订单详情表
-- 积分商品分类表
-- 积分商品表
-- 积分商品表订单表
-- 账户表
-- 账户流水表

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



### 第二章、项目初始化

#### 1、项目环境版本说明

+ 操作系统环境：windows11
+ idea版本： 2021.3.1
+ jdk版本：1.8
+ MySQL版本：8.x
+ SpringBoot版本：2.5.14



#### 2、idea初始化SpringBoot项目

+ 参考的教程(2019版本idea)：https://blog.csdn.net/wangmeixi/article/details/100013298
+ 参考的教程(2021版本idea)：https://blog.csdn.net/yxzone/article/details/118728302



#### 3、配置数据库环境

+ 

+ 添加配置文件

  application.yml

  ```yaml
  server:
    port: 80
  
  spring:
    application:
      name: wjhs
  
    profiles:
      active: dev
  
    datasource:
      druid:
        driver-class-name: com.mysql.cj.jdbc.Driver
        url: jdbc:mysql://${MYSQL_ADDRESS}/${MYSQL_DATABASE}?serverTimezone=Asia/Shanghai&allowMultiQueries=true&useUnicode=true&characterEncoding=UTF-8&useSSL=false
        username: ${MYSQL_USER_NAME}
        password: ${MySQL_PASSWORD}
  
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
  ```

  

  application-dev.yml(开发环境地址)

  ```yaml
  MYSQL_ADDRESS: localhost:3306
  MYSQL_DATABASE: wjhs
  MYSQL_USER_NAME: root
  MySQL_PASSWORD: 123456
  ```

  

  application-pro.yml(生产环境地址)

  ```yaml
  MYSQL_ADDRESS: localhost:3306
  MYSQL_DATABASE: wjhs
  MYSQL_USER_NAME: root
  MySQL_PASSWORD: 123456
  ```

  

  application.yml( 测试环境的配置文件)

  ```yaml
  spring:
    application:
      name: imusic
  
    datasource:
      driver-class-name: org.h2.Driver
      url: jdbc:h2:mem:wjhs;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;MODE=MYSQL;
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

  

+ 使用flyway数据库版本管理工具

  不熟悉可以flyway参考：https://developer.aliyun.com/article/842712、https://zhuanlan.zhihu.com/p/304110137

  在项目的`resources`目录下建立 `db/migration`文件，然后分别建立脚本文件 `V20221124.01__init_create_table.sql` 和  `V20221124.02__init_table_data.sql`，第一个文件内容是 1.2(建表sql)章节中的代码，第二个文件内容是 1.3(数据初始化sql)章节中的代码。

  

+ 启动项目注意观察控制台日志，启动成功后，在数据库中可以看到已按照定义好的脚本，完成数据库变更，并在`flyway_schema_history`表插入了sql执行记录。

  

#### 4、搭建swagger文档库

+ knife4j参考文档：https://doc.xiaominfo.com/docs/quick-start

+ 添加pom依赖

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
  package com.ilovesshan.wjhs.config;
  
  import org.springframework.context.annotation.Bean;
  import org.springframework.context.annotation.Configuration;
  import springfox.documentation.builders.ApiInfoBuilder;
  import springfox.documentation.builders.PathSelectors;
  import springfox.documentation.builders.RequestHandlerSelectors;
  import springfox.documentation.service.Contact;
  import springfox.documentation.spi.DocumentationType;
  import springfox.documentation.spring.web.plugins.Docket;
  import springfox.documentation.swagger2.annotations.EnableSwagger2WebMvc;
  
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
  package com.ilovesshan.wjhs.controller;
  
  import io.swagger.annotations.Api;
  import io.swagger.annotations.ApiOperation;
  import org.springframework.stereotype.Controller;
  import org.springframework.web.bind.annotation.GetMapping;
  import org.springframework.web.bind.annotation.RequestMapping;
  import org.springframework.web.bind.annotation.ResponseBody;
  
  
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

为了开发方便、这里直接统一后端处理跨域，可以在前端通过代理方式解决跨域问题。

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



### 第三章、工具类

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
    public static final String ERROR_USER_NOT_FOUND = "用户不存在";
    public static final String ERROR_USER_ALREADY_EXIST = "用户已经存在";


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



### 第四章、用户授权接口

在之后的代码中：主要贴出controller和service代码、dao层基本就是编写sql语句，代码比较繁琐，详细代码请参考github。

项目中对于各层之间的参数传递，采用了 `POJO，DTO,VO`等相关概念模型，同时使用 ` mapstruct` 工具进行转换。



#### 1、导入依赖

```xml
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
```



#### 2、常量配置

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

}
```



#### 3、更新用户密码sql脚本

更新原因：项目中使用了一套`AES`的加解密算法工具，我们在 `V20221124.02__init_table_data.sql` 文件中初始化数据时，填写的是明文，这里需要更新对明文进行加密，让其 `AES`能够正确的识别。

```tex
admin初始密码：123456
加密密码：_hSF8lwCW9Ha2zdsii0AjaOSsVwKQ28Ti3SUe144KXU=

sunlei初始密码：sunlei123456!@#
加密密码：qtLSKnRZzQ6j7ERhHQLLfu9Nx1WsdWe87EfQ6mABoTU=

ilovesshan初始密码：ilovesshan123456!@#
加密密码：Vm4gI_I5r6uH6FaHvT17168U_HhMxNfQCYgN1Ro6Jz23fkEPuSL_W0PkYsW1u27P
```



新增脚本名称：`V20221203.01__update_user_password.sql`

```sql
update
    `user`
set
    password = '_hSF8lwCW9Ha2zdsii0AjaOSsVwKQ28Ti3SUe144KXU='
where
    id = '369BCFE480454D22A07A8644F6DF0349';



update
    `user`
set
    password = 'qtLSKnRZzQ6j7ERhHQLLfu9Nx1WsdWe87EfQ6mABoTU='
where
    id = 'ADBD5F0E46474696B65140568E43385E';



    update
        `user`
    set
        password = 'Vm4gI_I5r6uH6FaHvT17168U_HhMxNfQCYgN1Ro6Jz23fkEPuSL_W0PkYsW1u27P'
    where
        id = 'F2532E33786F4B8D9FA2DB00F03352FB';
```



#### 4、集成Redis

+ 配置Redis连接环境

  ```yaml
  # application.yml
  
  spring
    # redis 配置
    redis:
      port: ${REDIS_PORT}
      host: ${REDIS_HOST}
  ```

  ```yaml
  # application-dev.yml
  
  REDIS_HOST: localhost
  REDIS_PORT: 6379
  ```

  

#### 5、用户授权接口

+ 普通用户

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
  package com.ilovesshan.wjhs.controller;
  
  import com.ilovesshan.wjhs.beans.dto.UserAuthDto;
  import com.ilovesshan.wjhs.service.AuthService;
  import com.ilovesshan.wjhs.utils.JwtUtil;
  import com.ilovesshan.wjhs.utils.R;
  import io.swagger.annotations.Api;
  import io.swagger.annotations.ApiOperation;
  import org.springframework.beans.factory.annotation.Autowired;
  import org.springframework.validation.annotation.Validated;
  import org.springframework.web.bind.annotation.*;
  
  import java.util.HashMap;
  
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
  package com.ilovesshan.wjhs.service.impl;
  
  import com.ilovesshan.wjhs.beans.dto.UserAuthDto;
  import com.ilovesshan.wjhs.beans.pojo.User;
  import com.ilovesshan.wjhs.contants.Constants;
  import com.ilovesshan.wjhs.core.base.UserCache;
  import com.ilovesshan.wjhs.core.config.RedisCache;
  import com.ilovesshan.wjhs.core.exception.CustomException;
  import com.ilovesshan.wjhs.service.AuthService;
  import com.ilovesshan.wjhs.service.UserService;
  import com.ilovesshan.wjhs.utils.AesUtils;
  import com.ilovesshan.wjhs.utils.JwtUtil;
  import com.ilovesshan.wjhs.utils.R;
  import lombok.extern.slf4j.Slf4j;
  import org.springframework.beans.factory.annotation.Autowired;
  import org.springframework.stereotype.Service;
  
  import java.util.Objects;
  
  
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

  ```java
  @Mapper
  public interface UserMapper {
      // 根据用户名查用户
      User findUserByUsername(String username);
     // 根据ID查用户
      User findUserById(String id);
  }
  ```

  

+ 小程序用户

  ```java
  package com.ilovesshan.wjhs.controller;
  
  import com.ilovesshan.wjhs.beans.converter.WxUserConverter;
  import com.ilovesshan.wjhs.beans.pojo.WxUser;
  import com.ilovesshan.wjhs.service.WxAuthService;
  import com.ilovesshan.wjhs.utils.R;
  import io.swagger.annotations.Api;
  import io.swagger.annotations.ApiOperation;
  import org.springframework.beans.factory.annotation.Autowired;
  import org.springframework.web.bind.annotation.PostMapping;
  import org.springframework.web.bind.annotation.RequestMapping;
  import org.springframework.web.bind.annotation.RequestParam;
  import org.springframework.web.bind.annotation.RestController;
  
  
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

  

  `WxAuthService` 调用 `WxUserService` 中的业务方法、`WxUserService` 调用 `WxUserMapper` 进行增删改查。

  ```java
  package com.ilovesshan.wjhs.service.impl;
  
  import com.alibaba.fastjson.JSONObject;
  import com.ilovesshan.wjhs.beans.pojo.WxUser;
  import com.ilovesshan.wjhs.contants.Constants;
  import com.ilovesshan.wjhs.core.config.RedisCache;
  import com.ilovesshan.wjhs.core.exception.AuthorizationException;
  import com.ilovesshan.wjhs.service.WxAuthService;
  import com.ilovesshan.wjhs.service.WxUserService;
  import com.ilovesshan.wjhs.utils.R;
  import com.ilovesshan.wjhs.utils.UuidUtil;
  import com.ilovesshan.wjhs.utils.WxChatUtil;
  import org.springframework.beans.factory.annotation.Autowired;
  import org.springframework.stereotype.Service;
  import org.springframework.util.StringUtils;
  
  import java.util.Date;
  import java.util.Objects;
  
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

  ```java
  public interface WxUserService {
      WxUser findUserByOpenId(String openid);
  
      boolean insert(WxUser wxUser);
  
      boolean update(WxUser wxUser);
  
      WxUser findUserById(String id);
  }
  
  
  
  @Mapper
  public interface WxUserMapper {
      WxUser findUserByOpenId(String openid);
  
      int insert(WxUser wxUser);
  
      int update(WxUser wxUser);
  
      WxUser findUserById(String id);
  }
  
  ```

  

#### 7、获取用户信息接口

+ 普通用户

  ```java
  @Api(tags = "用户模块")
  @RestController
  @RequestMapping("/users")
  public class UserController {
  
      @Autowired
      private UserService userService;
  
      @Autowired
      private UserConverter userConverter;
  
  
      @ApiOperation("根据ID获取用户信息")
      @GetMapping("/{id}")
      public R selectById(@PathVariable String id) {
          User user = userService.findUserById(id);
          return R.success(R.SUCCESS_MESSAGE_SELECT, userConverter.po2vo(user));
      }
  }
  ```

  

+ 小程序用户

  ```java
  @Api(tags = "小程序用户模块")
  @RestController
  @RequestMapping("/wx/users")
  public class WxUserController {
  
      @Autowired
      private WxUserService wxUserService;
  
      @Autowired
      private WxUserConverter wxUserConverter;
  
      @ApiOperation("根据ID获取用户信息")
      @GetMapping("/{id}")
      public R auth(@PathVariable String id) {
          WxUser wxUser = wxUserService.findUserById(id);
          return R.success(R.SUCCESS_MESSAGE_SELECT, wxUserConverter.po2vo(wxUser));
      }
  }
  ```



#### 8、获取数据字典接口

+ 具体的字段设计请参考数据库设计

  ```java
  @Api(tags = "字典模块")
  @RestController
  @RequestMapping("/systemDict")
  public class SystemDictController {
  
      @Autowired
      private SystemDictService systemDictService;
  
      @Autowired
      private SystemDictConverter systemDictConverter;
  
      @GetMapping
      @ApiOperation("查询字典列表")
      public R selectAll() {
          List<SystemDict> systemDicts = systemDictService.selectAll();
          List<SystemDictVo> systemDictVos = systemDicts.stream().map(systemDict -> systemDictConverter.po2vo(systemDict)).collect(Collectors.toList());
          return R.success(R.SUCCESS_MESSAGE_SELECT, systemDictVos);
      }
  }
  ```

  ```java
  public interface SystemDictService {
      List<SystemDict> selectAll();
  }
  
  @Mapper
  public interface SystemDictMapper {
      List<SystemDict> selectAll();
  }
  ```

  

#### 10、使用拦截器进行鉴权

会发现，现在项目的全部接口是不安全的，可以任意访问，这存在一定的安全隐患，所以下面配置拦截器，对部分接口实现拦截，需要客户端带有一定的凭证才能够访问。

+ 添加自定义拦截器 `SecurityHandlerInterceptor` 并实现 `HandlerInterceptor`接口，重写 `preHandle` 方法。

  ```java
  package com.ilovesshan.wjhs.core.inceptor;
  
  import com.ilovesshan.wjhs.beans.pojo.User;
  import com.ilovesshan.wjhs.beans.pojo.WxUser;
  import com.ilovesshan.wjhs.contants.Constants;
  import com.ilovesshan.wjhs.core.base.UserCache;
  import com.ilovesshan.wjhs.core.config.RedisCache;
  import com.ilovesshan.wjhs.core.exception.AuthorizationException;
  import com.ilovesshan.wjhs.utils.JwtUtil;
  import com.ilovesshan.wjhs.utils.R;
  import com.ilovesshan.wjhs.utils.ResponseUtil;
  import org.springframework.beans.factory.annotation.Autowired;
  import org.springframework.util.StringUtils;
  import org.springframework.web.servlet.HandlerInterceptor;
  
  import javax.servlet.http.HttpServletRequest;
  import javax.servlet.http.HttpServletResponse;
  import java.util.Objects;
  
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
              UserCache.set("wxUserId", finedUser.getId());
              UserCache.set("wxUsername", finedUser.getNickName());
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
              return true;
          }
      }
  }
  ```

+ 添加自定类 `WebMvcConfig` 实现 `WebMvcConfigurer` 接口，重写 `addResourceHandlers` 和 `addInterceptors` 方法。

  ```java
  package com.ilovesshan.wjhs.core.config;
  
  import com.ilovesshan.wjhs.core.inceptor.SecurityHandlerInterceptor;
  import org.springframework.context.annotation.Bean;
  import org.springframework.context.annotation.Configuration;
  import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
  import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
  import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
  
  
  @Configuration
  public class WebMvcConfig implements WebMvcConfigurer {
  
      // 注入拦截器
      @Bean
      public SecurityHandlerInterceptor securityHandlerInterceptor() {
          return new SecurityHandlerInterceptor();
      }
  
      @Override
      public void addResourceHandlers(ResourceHandlerRegistry registry) {
          // 配置虚拟路径
          registry.addResourceHandler("/preview/**").addResourceLocations("file:D:/www/wjhs/upload/");
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

  
