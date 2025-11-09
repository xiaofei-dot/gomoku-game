# 新能源汽车销售数据分析与可视化系统 - 代码规范

## 项目结构

```
方案二/
├── data/                    # 数据目录
│   ├── raw/                # 原始数据
│   ├── cleaned/            # 清洗后数据
│   └── processed/          # 处理后数据
├── python/                 # Python代码
│   ├── crawler/           # 数据爬取
│   ├── data_processing/   # 数据处理
│   ├── prediction/        # 预测算法
│   └── utils/             # 工具函数
├── java/                  # Java代码
│   ├── springboot/        # SpringBoot后端
│   └── utils/             # Java工具类
├── sql/                   # SQL脚本
│   ├── hive/              # Hive建表语句
│   ├── mysql/             # MySQL建表语句
│   └── etl/               # ETL处理脚本
├── config/                # 配置文件
└── docs/                  # 项目文档
```

## 开发规范

### Python代码规范

#### 导入规范
```python
# 使用ES模块语法
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from statsmodels.tsa.arima.model import ARIMA

# 避免使用通配符导入
# 错误: from module import *
# 正确: from module import specific_function
```

#### 函数规范
```python
# 函数定义示例
def clean_car_sales_data(raw_data: pd.DataFrame) -> pd.DataFrame:
    """
    清洗汽车销售数据

    参数:
        raw_data: 原始数据DataFrame

    返回:
        清洗后的DataFrame

    功能说明:
        - 处理缺失值
        - 格式转换
        - 数据验证
    """
    try:
        # 数据清洗逻辑
        cleaned_data = raw_data.dropna()
        cleaned_data['sales_date'] = pd.to_datetime(cleaned_data['sales_date'])
        return cleaned_data
    except Exception as e:
        logger.error(f"数据清洗失败: {e}")
        raise
```

#### 类规范
```python
class CarDataCrawler:
    """汽车数据爬取类"""

    def __init__(self, base_url: str, headers: dict = None):
        """
        初始化爬虫

        参数:
            base_url: 基础URL
            headers: 请求头
        """
        self.base_url = base_url
        self.headers = headers or {}
        self.session = requests.Session()

    def crawl_monthly_sales(self, month: str) -> pd.DataFrame:
        """爬取月度销售数据"""
        # 实现爬取逻辑
        pass
```

### Java代码规范

#### 包结构
```java
// 使用合理的包命名
package com.newenergy.car.analysis.controller;
package com.newenergy.car.analysis.service;
package com.newenergy.car.analysis.entity;
package com.newenergy.car.analysis.repository;
```

#### 类规范
```java
/**
 * 汽车销售数据服务类
 * 提供销售数据的业务逻辑处理
 */
@Service
@Slf4j
public class CarSalesService {

    private final CarSalesRepository carSalesRepository;

    @Autowired
    public CarSalesService(CarSalesRepository carSalesRepository) {
        this.carSalesRepository = carSalesRepository;
    }

    /**
     * 获取品牌月度销售数据
     * @param brandName 品牌名称
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 销售数据列表
     */
    public List<SalesDataDTO> getBrandMonthlySales(
        String brandName,
        LocalDate startDate,
        LocalDate endDate
    ) {
        log.info("查询品牌{}在{}到{}期间的销售数据", brandName, startDate, endDate);

        try {
            return carSalesRepository.findByBrandAndDateRange(
                brandName, startDate, endDate
            );
        } catch (Exception e) {
            log.error("查询销售数据失败", e);
            throw new BusinessException("查询销售数据失败");
        }
    }
}
```

#### 实体类规范
```java
/**
 * 汽车销售数据实体类
 */
@Entity
@Table(name = "car_sales")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarSales {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "brand_name", nullable = false)
    private String brandName;

    @Column(name = "model_name", nullable = false)
    private String modelName;

    @Column(name = "sales_date", nullable = false)
    private LocalDate salesDate;

    @Column(name = "sales_volume", nullable = false)
    private Integer salesVolume;

    @Column(name = "price")
    private BigDecimal price;

    @Column(name = "create_time")
    private LocalDateTime createTime;
}
```

### SQL规范

#### Hive建表规范
```sql
-- 创建ODS层数据表
CREATE TABLE IF NOT EXISTS ods_car_sales_raw (
    brand STRING COMMENT '汽车品牌',
    model STRING COMMENT '车型名称',
    sales_month STRING COMMENT '销售月份',
    sales_volume INT COMMENT '销售数量',
    price_range STRING COMMENT '价格区间',
    region STRING COMMENT '销售区域',
    create_time TIMESTAMP COMMENT '创建时间'
)
COMMENT '原始汽车销售数据表'
PARTITIONED BY (dt STRING COMMENT '分区字段')
ROW FORMAT DELIMITED
FIELDS TERMINATED BY ','
STORED AS TEXTFILE;
```

#### MySQL建表规范
```sql
-- 创建可视化数据表
CREATE TABLE IF NOT EXISTS visualization_data (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    chart_type VARCHAR(50) NOT NULL COMMENT '图表类型',
    data_json TEXT NOT NULL COMMENT '图表数据JSON',
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='可视化数据表';
```

### 配置文件规范

#### Python配置文件
```python
# config.py
import os
from dataclasses import dataclass

@dataclass
class DatabaseConfig:
    """数据库配置"""
    host: str = os.getenv('DB_HOST', 'localhost')
    port: int = int(os.getenv('DB_PORT', '3306'))
    username: str = os.getenv('DB_USERNAME', 'root')
    password: str = os.getenv('DB_PASSWORD', '')
    database: str = os.getenv('DB_DATABASE', 'car_analysis')

@dataclass
class CrawlerConfig:
    """爬虫配置"""
    base_url: str = "https://www.dongchedi.com"
    timeout: int = 30
    retry_times: int = 3
    user_agent: str = "Mozilla/5.0..."
```

#### SpringBoot配置文件
```yaml
# application.yml
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/car_analysis
    username: root
    password: ${DB_PASSWORD:}
    driver-class-name: com.mysql.cj.jdbc.Driver

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL8Dialect

logging:
  level:
    com.newenergy.car.analysis: DEBUG
```

## 开发流程规范

### 1. 代码提交前检查
```bash
# Python项目
python -m pylint python/
python -m black python/
python -m isort python/

# Java项目
mvn checkstyle:check
mvn spotbugs:check
```

### 2. 测试规范
```python
# Python测试示例
import pytest
from car_data_crawler import CarDataCrawler

class TestCarDataCrawler:
    """汽车数据爬取测试类"""

    def test_crawl_monthly_sales_success(self):
        """测试成功爬取月度销售数据"""
        crawler = CarDataCrawler("https://example.com")
        result = crawler.crawl_monthly_sales("2024-01")

        assert result is not None
        assert isinstance(result, pd.DataFrame)
        assert len(result) > 0
```

```java
// Java测试示例
@SpringBootTest
class CarSalesServiceTest {

    @Autowired
    private CarSalesService carSalesService;

    @Test
    void testGetBrandMonthlySales() {
        // 测试获取品牌月度销售数据
        List<SalesDataDTO> result = carSalesService.getBrandMonthlySales(
            "比亚迪",
            LocalDate.of(2024, 1, 1),
            LocalDate.of(2024, 12, 31)
        );

        assertNotNull(result);
        assertFalse(result.isEmpty());
    }
}
```

### 3. 日志规范
```python
# Python日志配置
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)
```

```java
// Java日志使用
@Slf4j
@Service
public class DataProcessingService {

    public void processSalesData(SalesData data) {
        log.info("开始处理销售数据: {}", data.getId());

        try {
            // 处理逻辑
            log.debug("数据处理完成");
        } catch (Exception e) {
            log.error("数据处理失败: {}", data.getId(), e);
            throw e;
        }
    }
}
```

## 数据安全规范

### 1. 敏感信息保护
```python
# 使用环境变量存储敏感信息
import os

db_password = os.getenv('DATABASE_PASSWORD')
api_key = os.getenv('CRAWLER_API_KEY')
```

### 2. SQL注入防护
```java
// 使用预编译语句
@Query("SELECT s FROM CarSales s WHERE s.brandName = :brandName AND s.salesDate BETWEEN :startDate AND :endDate")
List<CarSales> findByBrandAndDateRange(
    @Param("brandName") String brandName,
    @Param("startDate") LocalDate startDate,
    @Param("endDate") LocalDate endDate
);
```

## 性能优化规范

### 1. 数据库优化
```sql
-- 添加索引
CREATE INDEX idx_brand_sales_date ON car_sales(brand_name, sales_date);
CREATE INDEX idx_sales_volume ON car_sales(sales_volume);
```

### 2. 缓存使用
```java
// Spring缓存注解
@Cacheable(value = "brandSales", key = "#brandName + '-' + #month")
public List<SalesData> getBrandSalesByMonth(String brandName, String month) {
    // 数据库查询逻辑
}
```

## 部署规范

### Docker配置
```dockerfile
# Python服务Dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["python", "main.py"]
```

```dockerfile
# SpringBoot服务Dockerfile
FROM openjdk:11-jre-slim

WORKDIR /app

COPY target/car-analysis.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
```

## 文档规范

### 1. API文档
```java
/**
 * 汽车销售数据API控制器
 */
@RestController
@RequestMapping("/api/sales")
@Api(tags = "销售数据API")
public class SalesDataController {

    /**
     * 获取品牌销售趋势
     * @param request 请求参数
     * @return 销售趋势数据
     */
    @GetMapping("/trend")
    @ApiOperation("获取品牌销售趋势")
    public ResponseEntity<SalesTrendResponse> getSalesTrend(
        @Valid SalesTrendRequest request
    ) {
        // 业务逻辑
    }
}
```

### 2. 代码注释
- 所有公共方法和类必须添加文档注释
- 复杂算法需要详细注释说明
- 关键业务逻辑需要注释说明
- 使用中文注释，保持注释与代码同步更新

通过遵循这些规范，确保项目代码的质量、可维护性和可扩展性。