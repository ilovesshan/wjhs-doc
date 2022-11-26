### 第一章、数据库设计
#### 1.1、数据表预览

```
-- 骑手/回收中心/平台用户表
-- 小程序用户信息表
-- 角色表
-- 用户角色关联表
-- 用户操作日志表
-- 用户登录日志表
-- 附件表
-- 系统字典表
-- 小程序用户地址信息表
-- 小程序用户信息和地址信息关联表
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



#### 1.2、数据表设计

```sql
DROP DATABASE IF EXISTS wjhs;
CREATE DATABASE wjhs;

USE  wjhs;

-- 备注： 
-- 			1、省市区街道sql语句, 从文件中自行导入(github地址<https://github.com/wecatch/china_regions>)
-- 			2、CODE状态码参考：系统字典表(system_dict)



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
    `login_localtion` VARCHAR(50) DEFAULT NULL COMMENT '用户登录地址',
    `is_delete` CHAR(3) DEFAULT 15 NOT NULL COMMENT '是否删除(14:已删除、15:未删除)',
    `browser` VARCHAR(50)  NULL DEFAULT '' COMMENT '浏览器类型',
    `system_os` VARCHAR(50)  NULL DEFAULT '' COMMENT '操作系统',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT= '用户登录表';



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
-- 创建 角色表
-- ----------------------------
DROP TABLE IF EXISTS `role`;
create table `role`(
    `id` CHAR(3) COMMENT '主键id',
    `code` VARCHAR(10) NOT NULL COMMENT '角色编码',
    `name` VARCHAR(20) NOT NULL COMMENT '角色名称',
    `create_time` DATETIME(0) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME(0) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='角色表';


-- ----------------------------
-- 创建 用户角色关联表
-- ----------------------------
DROP TABLE IF EXISTS `user_role`;
create table `user_role`(
    `id` VARCHAR(32) COMMENT '主键id',
    `user_id` VARCHAR(32) COMMENT '用户id',
    `role_id` VARCHAR(32) COMMENT '角色id',
    `create_time` DATETIME(0) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME(0) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户角色关联表';


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



#### 1.3、初始化数据

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
  `wjhs`.`role` (`id`, `code`, `name`, `create_time`, `update_time`) 
VALUES 
  (0, 'PTYH', '平台用户', '2022-11-24 10:22:34', '2022-11-24 10:22:34'),
  (1, 'WXYH', '微信用户', '2022-11-24 10:22:34', '2022-11-24 10:22:34'),
  (2, 'QSYH', '骑手用户', '2022-11-24 10:22:34', '2022-11-24 10:22:34'),
  (3, 'HSZXYH', '回收中心用户', '2022-11-24 10:22:34', '2022-11-24 10:22:34');


	

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
  ('679E12B38C91481AB6D6DA7B2B2D75C7', 28, '交易方式(jyfs)', '平台交易', 1 , 'admin', '369BCFE480454D22A07A8644F6DF0349', NULL, NULL, 15, '2022-11-24 10:22:34', '2022-11-24 10:22:34');




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



### 第二章、SpringBoot项目初始化

#### 2.1、项目环境版本说明

+ 操作系统环境：windows11
+ idea版本： 2021.3.1
+ MySQL版本：8.x
+ SpringBoot版本：2.5.14



#### 2.2、idea初始化SpringBoot项目

+ 参考的教程(2019版本idea)：https://blog.csdn.net/wangmeixi/article/details/100013298
+ 参考的教程(2021版本idea)：https://blog.csdn.net/yxzone/article/details/118728302



#### 2.3、配置数据库环境

+ 添加pom依赖

  ```xml
  <!-- mysql 驱动 -->
  <dependency>
      <groupId>mysql</groupId>
      <artifactId>mysql-connector-java</artifactId>
  </dependency>
  
  <!-- druid -->
  <dependency>
      <groupId>com.alibaba</groupId>
      <artifactId>druid-spring-boot-starter</artifactId>
      <version>1.2.14</version>
  </dependency>
  
  <!-- flyway -->
  <dependency>
      <groupId>org.flywaydb</groupId>
      <artifactId>flyway-core</artifactId>
      <version>5.2.4</version>
  </dependency>
  
  <!-- h2 数据库(测试) -->
  <dependency>
      <groupId>com.h2database</groupId>
      <artifactId>h2</artifactId>
      <scope>runtime</scope>
  </dependency>
  ```

  

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

  

#### 2.4、搭建swagger文档库

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
  
  /**
   * Created with IntelliJ IDEA.
   *
   * @author: ilovesshan
   * @date: 2022/11/24
   * @description:
   */
  
  
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
  
  /**
   * Created with IntelliJ IDEA.
   *
   * @author: ilovesshan
   * @date: 2022/11/24
   * @description:
   */
  
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

  

#### 2.5、配置跨域

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

