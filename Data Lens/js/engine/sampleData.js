/**
 * DataLens - Built-in Sample Datasets
 * Rich datasets for immediate analytics exploration out-of-the-box.
 */

const SAMPLE_DATASETS = [
  {
    id: 'sample-retail-ecommerce-2024',
    name: 'Global Retail & E-Commerce 2024',
    description: 'Multi-region omnichannel retail sales, orders, discounts, and profit margins across tech, furniture, and office supplies.',
    csv: `Order ID,Order Date,Segment,Region,Country,Category,Sub-Category,Product Name,Sales,Quantity,Discount,Profit,Shipping Mode,Returned
ORD-2024-1001,2024-01-04,Corporate,North America,United States,Technology,Phones,iPhone 15 Pro Max 256GB,$1199.00,2,0.0%,$359.70,Express Air,No
ORD-2024-1002,2024-01-05,Consumer,Europe,United Kingdom,Technology,Laptops,MacBook Air 15 M3,$1499.00,1,5.0%,$299.80,Standard Ground,No
ORD-2024-1003,2024-01-08,Small Business,Asia Pacific,Japan,Furniture,Chairs,Herman Miller Aeron Chair,$1250.00,3,10.0%,$412.50,Standard Ground,No
ORD-2024-1004,2024-01-12,Consumer,North America,Canada,Office Supplies,Storage,Heavy Duty Filing Cabinet,$289.50,4,0.0%,$86.85,Second Class,No
ORD-2024-1005,2024-01-15,Corporate,Europe,Germany,Technology,Accessories,Logitech MX Master 3S,$99.99,10,15.0%,$254.97,Express Air,No
ORD-2024-1006,2024-01-18,Consumer,North America,United States,Furniture,Bookcases,Oakwood 5-Shelf Bookcase,$450.00,2,20.0%,-$45.00,Standard Ground,Yes
ORD-2024-1007,2024-01-22,Consumer,Asia Pacific,Australia,Technology,Monitors,Dell UltraSharp 32 4K,$899.00,2,0.0%,$269.70,Express Air,No
ORD-2024-1008,2024-01-25,Small Business,Europe,France,Office Supplies,Paper,Premium Multipurpose Paper 5-Pack,$45.00,25,5.0%,$320.62,Standard Ground,No
ORD-2024-1009,2024-02-02,Corporate,North America,United States,Technology,Laptops,Dell XPS 15 OLED,$1899.00,3,10.0%,$569.70,Express Air,No
ORD-2024-1010,2024-02-05,Consumer,Europe,Spain,Furniture,Tables,Nordic Solid Oak Dining Table,$850.00,1,0.0%,$212.50,Standard Ground,No
ORD-2024-1011,2024-02-09,Consumer,Asia Pacific,Singapore,Technology,Phones,Samsung Galaxy S24 Ultra,$1299.00,2,5.0%,$363.72,Express Air,No
ORD-2024-1012,2024-02-14,Corporate,North America,United States,Office Supplies,Binders,Heavy Duty Locking Binders,$18.50,40,25.0%,$111.00,Standard Ground,No
ORD-2024-1013,2024-02-18,Small Business,Latin America,Brazil,Furniture,Chairs,Ergonomic Mesh Task Chair,$340.00,5,10.0%,$255.00,Second Class,No
ORD-2024-1014,2024-02-23,Consumer,Europe,Italy,Technology,Accessories,Apple Magic Keyboard,$179.00,4,0.0%,$143.20,Express Air,No
ORD-2024-1015,2024-02-27,Corporate,North America,United States,Technology,Monitors,LG 34 UltraWide Curved,$750.00,4,15.0%,$382.50,Standard Ground,No
ORD-2024-1016,2024-03-03,Small Business,Europe,Netherlands,Office Supplies,Appliances,Compact Beverage Cooler,$320.00,2,0.0%,$80.00,Standard Ground,No
ORD-2024-1017,2024-03-07,Consumer,Asia Pacific,India,Technology,Phones,Google Pixel 8 Pro,$999.00,3,10.0%,$269.73,Express Air,No
ORD-2024-1018,2024-03-12,Corporate,North America,United States,Furniture,Tables,Conference Room Table 10ft,$2100.00,1,30.0%,-$189.00,Standard Ground,Yes
ORD-2024-1019,2024-03-16,Consumer,Europe,Sweden,Technology,Laptops,Lenovo ThinkPad X1 Carbon,$1650.00,2,5.0%,$396.00,Express Air,No
ORD-2024-1020,2024-03-20,Consumer,North America,United States,Office Supplies,Art,Professional Marker Set 72ct,$68.00,8,0.0%,$163.20,Second Class,No
ORD-2024-1021,2024-03-24,Small Business,Asia Pacific,South Korea,Technology,Monitors,Samsung Odyssey OLED G9,$1499.00,2,10.0%,$404.73,Express Air,No
ORD-2024-1022,2024-03-28,Corporate,Europe,Germany,Furniture,Bookcases,Modular Steel Library Shelf,$620.00,3,5.0%,$176.70,Standard Ground,No
ORD-2024-1023,2024-04-02,Consumer,North America,United States,Technology,Accessories,Anker 100W GaN Fast Charger,$59.99,15,0.0%,$269.95,Express Air,No
ORD-2024-1024,2024-04-06,Corporate,Latin America,Mexico,Office Supplies,Storage,Steel Storage Cabinet,$410.00,3,10.0%,$98.40,Standard Ground,No
ORD-2024-1025,2024-04-11,Small Business,North America,United States,Technology,Laptops,ASUS ROG Zephyrus G16,$1999.00,2,0.0%,$499.75,Express Air,No
ORD-2024-1026,2024-04-15,Consumer,Europe,United Kingdom,Furniture,Chairs,Steelcase Gesture Chair,$1380.00,1,5.0%,$393.30,Standard Ground,No
ORD-2024-1027,2024-04-19,Corporate,Asia Pacific,Japan,Technology,Phones,Sony Xperia 1 VI,$1299.00,4,15.0%,$441.66,Express Air,No
ORD-2024-1028,2024-04-24,Consumer,North America,United States,Office Supplies,Paper,LaserJet Recycled Paper 10 Reams,$85.00,12,0.0%,$255.00,Standard Ground,No
ORD-2024-1029,2024-04-28,Small Business,Europe,France,Furniture,Tables,Adjustable Height Standing Desk,$720.00,4,10.0%,$388.80,Standard Ground,No
ORD-2024-1030,2024-05-03,Corporate,North America,United States,Technology,Monitors,Apple Studio Display 27 5K,$1599.00,3,0.0%,$575.64,Express Air,No`
  },
  {
    id: 'sample-saas-churn-2024',
    name: 'SaaS Metrics & Customer Churn 2024',
    description: 'B2B SaaS subscription analytics including MRR, NPS, seats, support ticket volume, contract duration, and churn predictions.',
    csv: `Customer ID,Company Name,Plan Tier,Industry,Monthly Recurring Revenue,Seats,NPS Score,Support Tickets,Usage Frequency,Contract Term,Churned
CUST-801,Acme Cloud Analytics,Enterprise,Technology,$4500.00,85,9,2,Daily,Annual,No
CUST-802,Vertex Financial Services,Enterprise,Finance,$6200.00,120,8,1,Daily,Multi-Year,No
CUST-803,HealthBridge Global,Professional,Healthcare,$1800.00,30,4,8,Weekly,Monthly,Yes
CUST-804,OmniLogistics Worldwide,Enterprise,Logistics,$3900.00,65,7,3,Daily,Annual,No
CUST-805,Apex Media Digital,Starter,Media,$499.00,8,10,0,Daily,Annual,No
CUST-806,BrightPath Education,Professional,Education,$1200.00,25,3,12,Monthly,Monthly,Yes
CUST-807,Nova Dynamics AI,Enterprise,Technology,$7800.00,160,9,2,Daily,Multi-Year,No
CUST-808,Summit Retail Group,Professional,Retail,$2200.00,40,6,5,Weekly,Annual,No
CUST-809,Cobalt Security Labs,Enterprise,Cybersecurity,$5400.00,95,10,1,Daily,Annual,No
CUST-810,Zenith Solar Energy,Starter,Energy,$499.00,10,5,4,Monthly,Monthly,Yes
CUST-811,Pulse Gaming Studios,Professional,Entertainment,$2800.00,50,8,3,Daily,Annual,No
CUST-812,Beacon Legal Partners,Professional,Legal,$2100.00,35,7,2,Weekly,Annual,No
CUST-813,Quantex Capital,Enterprise,Finance,$9200.00,210,10,1,Daily,Multi-Year,No
CUST-814,Horizon Biotech,Professional,Healthcare,$2600.00,45,8,4,Daily,Annual,No
CUST-815,Aura Creative Agency,Starter,Media,$499.00,6,2,9,Rarely,Monthly,Yes
CUST-816,Skyline Aerospace,Enterprise,Aerospace,$8500.00,180,9,3,Daily,Multi-Year,No
CUST-817,Pinnacle Real Estate,Professional,Real Estate,$1600.00,28,6,6,Weekly,Monthly,No
CUST-818,Stratos Cloud Infra,Enterprise,Technology,$6800.00,140,9,2,Daily,Annual,No
CUST-819,Swift Delivery Direct,Starter,Logistics,$499.00,12,4,7,Monthly,Monthly,Yes
CUST-820,Tidal Wave Telecom,Enterprise,Telecommunications,$7100.00,150,8,4,Daily,Annual,No`
  },
  {
    id: 'sample-tech-financials-2024',
    name: 'Global Tech Giants Financials 2024',
    description: 'Comprehensive financial performance of top global technology leaders: Market Cap, Revenue, Net Margin, PE ratio, and Headcount.',
    csv: `Company,Ticker,Primary Sector,Country,Market Cap ($B),Annual Revenue ($B),Net Income ($B),PE Ratio,Profit Margin,YoY Revenue Growth,Headcount
Microsoft,MSFT,Cloud & Software,United States,$3120.0,$245.1,$88.1,35.4,35.9%,15.6%,221000
Apple,AAPL,Consumer Tech,United States,$3450.0,$385.7,$100.4,34.3,26.0%,5.1%,161000
NVIDIA,NVDA,Semiconductors & AI,United States,$3190.0,$122.5,$60.9,52.3,49.7%,122.4%,29600
Alphabet (Google),GOOGL,Advertising & Cloud,United States,$2150.0,$307.4,$73.8,29.1,24.0%,13.8%,182500
Amazon,AMZN,E-Commerce & AWS,United States,$1980.0,$574.8,$30.4,45.2,5.3%,12.5%,1525000
Meta Platforms,META,Social Media & AI,United States,$1340.0,$134.9,$39.1,34.2,29.0%,23.2%,67300
TSMC,TSM,Semiconductors,Taiwan,$870.0,$69.3,$26.8,32.4,38.7%,16.5%,76400
ASML Holding,ASML,Lithography Equipment,Netherlands,$380.0,$29.8,$8.4,45.2,28.2%,18.1%,42400
Tencent Holdings,TCEHY,Gaming & Fintech,China,$460.0,$86.5,$16.2,28.4,18.7%,10.3%,105000
Salesforce,CRM,Enterprise CRM,United States,$260.0,$34.8,$4.1,43.8,11.8%,11.2%,72600
Adobe,ADBE,Creative Software,United States,$230.0,$19.4,$5.4,42.5,27.8%,10.5%,29900
SAP,SAP,Enterprise ERP,Germany,$245.0,$33.5,$6.2,39.5,18.5%,8.4%,107600
Broadcom,AVGO,Semiconductors & Infra,United States,$780.0,$51.6,$14.2,54.9,27.5%,43.8%,20000
Oracle,ORCL,Database & Cloud,United States,$370.0,$52.9,$10.5,35.2,19.8%,6.0%,159000
ServiceNow,NOW,Enterprise Workflow,United States,$175.0,$8.9,$1.7,58.3,19.1%,23.8%,22600`
  }
];

window.SAMPLE_DATASETS = SAMPLE_DATASETS;
