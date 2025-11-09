# 新能源汽车销售数据分析与可视化系统

## 项目概述

本项目旨在构建一个完整的新能源汽车销售数据分析与可视化系统，通过数据爬取、数据清洗、数据仓库构建、数据迁移和数据可视化等环节，实现对新能源汽车销售数据的全面分析和预测。

## 系统架构

### 技术栈
- **数据爬取**: Python + Requests + BeautifulSoup + Pandas
- **数据存储**: HDFS + Hive + MySQL
- **数据处理**: Hive SQL + Sqoop
- **数据可视化**: SpringBoot + ECharts + MySQL
- **预测算法**: Python + ARIMA

### 系统分层架构

#### 1. 数据采集层
- 爬取懂车帝新能源汽车销量数据
- 数据清洗和预处理

#### 2. 数据存储层
- **HDFS**: 原始数据存储
- **Hive数据仓库**:
  - ODS层: 原始数据层
  - DWD层: 数据明细层
  - DWS层: 数据汇总层
  - ADS层: 数据应用层

#### 3. 数据处理层
- Hive SQL进行数据ETL处理
- Sqoop数据迁移工具

#### 4. 数据应用层
- SpringBoot后端服务
- ECharts前端可视化
- ARIMA销量预测算法

## 功能模块

### 1. 数据爬取模块
- **功能**: 爬取懂车帝新能源汽车销量数据
- **技术**: Python + Requests + BeautifulSoup
- **输出**: 原始CSV数据文件

### 2. 数据清洗模块
- **功能**: 数据清洗、格式转换、缺失值处理
- **技术**: Pandas + Python
- **输出**: 清洗后的数据文件

### 3. 数据仓库模块
- **功能**: 构建Hive数据仓库，实现四层数据架构
- **技术**: Hive + HDFS
- **分层**:
  - ODS层: 存储原始数据
  - DWD层: 数据清洗和维度建模
  - DWS层: 数据聚合和汇总
  - ADS层: 业务指标和应用数据

### 4. 数据迁移模块
- **功能**: 将ADS层数据迁移到MySQL
- **技术**: Sqoop
- **输出**: MySQL数据库表

### 5. 可视化模块
- **功能**: 数据可视化展示
- **技术**: SpringBoot + ECharts + MySQL
- **图表类型**:
  - 销量趋势图
  - 品牌占比饼图
  - 车型销量排行
  - 区域分布图

### 6. 预测模块
- **功能**: 基于ARIMA算法预测新能源汽车销量
- **技术**: Python + statsmodels
- **输入**: 历史销量数据
- **输出**: 未来销量预测

## 数据流程

1. **数据采集** → 2. **数据清洗** → 3. **HDFS存储** → 4. **Hive ETL** → 5. **MySQL迁移** → 6. **可视化展示** → 7. **销量预测**

## 数据库设计

### Hive数据仓库表结构

#### ODS层表
```sql
-- 原始销量数据表
CREATE TABLE ods_car_sales_raw (
    brand STRING,           -- 品牌
    model STRING,           -- 车型
    sales_month STRING,     -- 销售月份
    sales_volume INT,       -- 销量
    price_range STRING,     -- 价格区间
    region STRING,          -- 区域
    create_time TIMESTAMP   -- 创建时间
);
```

#### DWD层表
```sql
-- 明细数据表
CREATE TABLE dwd_car_sales_detail (
    brand_id INT,           -- 品牌ID
    model_id INT,           -- 车型ID
    sales_date DATE,        -- 销售日期
    sales_volume INT,       -- 销量
    price DECIMAL(10,2),    -- 价格
    region_id INT,          -- 区域ID
    is_new_energy BOOLEAN   -- 是否新能源
);
```

#### DWS层表
```sql
-- 品牌月度汇总表
CREATE TABLE dws_brand_monthly_sales (
    brand_id INT,           -- 品牌ID
    sales_month STRING,     -- 销售月份
    total_sales INT,        -- 总销量
    avg_price DECIMAL(10,2), -- 平均价格
    sales_growth DECIMAL(5,2) -- 销量增长率
);
```

#### ADS层表
```sql
-- 应用数据表
CREATE TABLE ads_car_sales_analysis (
    analysis_date DATE,     -- 分析日期
    brand_name STRING,      -- 品牌名称
    monthly_sales INT,      -- 月销量
    market_share DECIMAL(5,2), -- 市场份额
    sales_rank INT          -- 销量排名
);
```

### MySQL业务数据库表

```sql
-- 可视化数据表
CREATE TABLE visualization_data (
    id INT PRIMARY KEY AUTO_INCREMENT,
    chart_type VARCHAR(50),     -- 图表类型
    data_json TEXT,             -- 图表数据
    update_time TIMESTAMP       -- 更新时间
);

-- 预测结果表
CREATE TABLE prediction_results (
    id INT PRIMARY KEY AUTO_INCREMENT,
    brand_name VARCHAR(100),    -- 品牌名称
    prediction_date DATE,       -- 预测日期
    predicted_sales INT,        -- 预测销量
    confidence DECIMAL(5,2),    -- 置信度
    create_time TIMESTAMP       -- 创建时间
);
```

## 开发计划

### 第一阶段：数据采集与清洗
- 完成数据爬取脚本
- 实现数据清洗功能
- 测试数据质量

### 第二阶段：数据仓库构建
- 搭建HDFS环境
- 创建Hive数据仓库
- 实现四层数据架构

### 第三阶段：数据处理与迁移
- 编写Hive ETL脚本
- 配置Sqoop数据迁移
- 验证数据一致性

### 第四阶段：可视化开发
- 开发SpringBoot后端API
- 实现ECharts前端可视化
- 集成MySQL数据库

### 第五阶段：预测算法
- 实现ARIMA预测模型
- 集成预测结果到可视化
- 系统测试和优化

## 技术要点

1. **数据质量保证**: 多层数据清洗和验证
2. **性能优化**: Hive分区表和索引优化
3. **可扩展性**: 模块化设计，易于扩展新数据源
4. **可视化交互**: 支持多维度数据筛选和钻取
5. **预测准确性**: ARIMA参数调优和模型验证

## 预期成果

1. 完整的新能源汽车销售数据分析平台
2. 实时的数据可视化展示
3. 准确的销量预测模型
4. 可扩展的数据处理架构
5. 完整的项目文档和代码