import '../public/styles.css';

declare const echarts: any;
declare const Swal: any;

// === Types ===
type Assistant = {
  id: string;
  name: string;
  role: string;
  trigger: string;
  avatar: string;
  color: string;
  complexity: 'simple' | 'complex';
  action: (query: string) => string;
};

// === Mock Data ===
const salesData = {
  dates: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  revenue: [12000, 13200, 10100, 13400, 9000, 23000, 21000],
  categories: [
    { value: 1048, name: '男装' },
    { value: 735, name: '女装' },
    { value: 580, name: '童装' },
    { value: 484, name: '配饰' },
    { value: 300, name: '鞋履' }
  ]
};

const ordersData = [
  { id: 'ORD-2024001', customer: '张三', items: '羽绒服 x1, 围巾 x1', amount: '¥1,299.00', status: '已完成' },
  { id: 'ORD-2024002', customer: '李四', items: '牛仔裤 x2', amount: '¥598.00', status: '配送中' },
  { id: 'ORD-2024003', customer: '王五', items: '羊毛衫 x1', amount: '¥899.00', status: '待发货' },
  { id: 'ORD-2024004', customer: '赵六', items: '运动鞋 x1', amount: '¥459.00', status: '已完成' },
  { id: 'ORD-2024005', customer: '钱七', items: '卫衣 x1, 袜子 x3', amount: '¥320.00', status: '已取消' },
];

const inventoryData = [
  { sku: 'SKU-001', name: '经典白T恤', stock: 12, threshold: 20, status: 'low' },
  { sku: 'SKU-002', name: '黑色修身裤', stock: 5, threshold: 15, status: 'critical' },
  { sku: 'SKU-003', name: '印花连衣裙', stock: 45, threshold: 10, status: 'normal' },
  { sku: 'SKU-004', name: '加厚羽绒服', stock: 8, threshold: 10, status: 'low' },
];

// === Rendering Functions ===

const renderWelcome = () => {
  const container = document.getElementById('work-content')!;
  container.innerHTML = `
    <div class="empty-state">
      <i class="ri-robot-2-line" style="font-size: 64px; color: #d9d9d9; margin-bottom: 24px;"></i>
      <h3>你好，我是您的智能工作助理</h3>
      <p>请在右侧对话框中 @ 相应的数字员工来获取帮助</p>
      <div class="assistant-tips">
        <span class="tip-tag">@数据 查看销售报表</span>
        <span class="tip-tag">@订单 查询最近订单</span>
        <span class="tip-tag">@库存 检查库存预警</span>
        <span class="tip-tag">@日报 生成今日总结</span>
        <span class="tip-tag">@营销 策划活动方案</span>
      </div>
    </div>
  `;
};

const renderCanvasWorkspace = () => {
  const container = document.getElementById('work-content')!;
  // Use the local result image based on user request
  const resultImage = "/public/images/result_tryon.svg";
  
  container.innerHTML = `
    <div class="canvas-view">
      <div class="canvas-header">
        <h2><i class="ri-brush-line"></i> 智能设计工坊</h2>
        <div class="actions">
           <button class="btn small"><i class="ri-arrow-go-back-line"></i> 撤销</button>
           <button class="btn small primary"><i class="ri-download-2-line"></i> 导出图片</button>
        </div>
      </div>
      <div class="canvas-area">
        <div class="canvas-toolbar">
          <button class="tool-btn" title="Move"><i class="ri-drag-move-2-line"></i></button>
          <button class="tool-btn" title="Crop"><i class="ri-crop-line"></i></button>
          <button class="tool-btn" title="Filter"><i class="ri-magic-line"></i></button>
          <button class="tool-btn" title="Text"><i class="ri-text"></i></button>
        </div>
        <img src="${resultImage}" class="canvas-img" alt="Design Result">
      </div>
    </div>
  `;
};

const renderTryOnModal = () => {
  let modelUploaded = false;
  let clothUploaded = false;

  const checkStatus = () => {
    const btn = document.getElementById('btn-generate') as HTMLButtonElement;
    if (btn) {
      btn.disabled = !(modelUploaded && clothUploaded);
    }
  };

  Swal.fire({
    width: 900,
    padding: '32px',
    showConfirmButton: false,
    showCloseButton: true,
    customClass: {
      popup: 'de-swal-popup'
    },
    html: `
      <div class="try-on-modal-content">
        <h3>模特上身</h3>
        <p class="subtitle">支持包袋、帽子、项链、耳饰、眼镜等配饰的智能试戴与换装</p>
        
        <div class="try-on-container">
          <div class="upload-box" id="upload-model">
            <i class="ri-user-smile-line"></i>
            <p>拖拽或点击上传模特图</p>
            <button class="btn-upload"><i class="ri-upload-2-line"></i> 本地上传</button>
          </div>
          
          <div class="upload-box" id="upload-cloth">
            <i class="ri-t-shirt-line"></i>
            <p>拖拽或点击上传服饰图</p>
            <button class="btn-upload"><i class="ri-upload-2-line"></i> 本地上传</button>
          </div>
        </div>

        <div class="generate-section">
           <button id="btn-generate" class="btn-generate" disabled>
             <i class="ri-sparkling-2-fill"></i> 开始生成效果
           </button>
        </div>
        
        <div class="example-section">
          <h4>快速尝试以下案例</h4>
          <div class="example-grid">
             <div class="example-item"><img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&h=200&fit=crop"></div>
             <div class="example-item"><img src="https://images.unsplash.com/photo-1529139574466-a302c27e3844?w=200&h=200&fit=crop"></div>
             <div class="example-item"><img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&h=200&fit=crop"></div>
          </div>
        </div>
      </div>
    `,
    didOpen: () => {
      // Bind Model Upload
      const modelBox = document.getElementById('upload-model');
      modelBox?.addEventListener('click', () => {
        if (modelUploaded) return;
        modelBox.innerHTML = `<img src="/public/images/model_boy.svg" class="preview-img">`;
        modelBox.classList.add('uploaded');
        modelUploaded = true;
        checkStatus();
      });

      // Bind Cloth Upload
      const clothBox = document.getElementById('upload-cloth');
      clothBox?.addEventListener('click', () => {
        if (clothUploaded) return;
        clothBox.innerHTML = `<img src="/public/images/cloth_jacket.svg" class="preview-img">`;
        clothBox.classList.add('uploaded');
        clothUploaded = true;
        checkStatus();
      });

      // Bind Generate Button
      const genBtn = document.getElementById('btn-generate');
      genBtn?.addEventListener('click', () => {
         Swal.close();
         // Simulate processing delay
         const container = document.getElementById('work-content')!;
         container.innerHTML = `
           <div class="empty-state">
             <div class="thinking-process" style="align-items:center">
               <i class="ri-loader-4-line spinner" style="font-size:48px;color:#1890ff;margin-bottom:16px"></i>
               <h3 style="color:#333">AI 正在进行融合设计...</h3>
               <p style="color:#999">正在识别骨骼关键点、调整光影融合...</p>
             </div>
           </div>`;
         
         setTimeout(() => {
           renderCanvasWorkspace();
         }, 2000);
      });
      
      // Bind Examples
      const items = document.querySelectorAll('.example-item');
      items.forEach(item => {
        item.addEventListener('click', () => {
           Swal.close();
           renderCanvasWorkspace();
        });
      });
    }
  });
};

const renderSalesDashboard = () => {
  const container = document.getElementById('work-content')!;
  container.innerHTML = `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h2>销售数据大屏</h2>
        <span class="date-badge">2024-03-20 实时</span>
      </div>
      <div class="chart-row">
        <div class="chart-card" id="chart-trend"></div>
        <div class="chart-card" id="chart-pie"></div>
      </div>
      <div class="stats-row">
        <div class="stat-card">
          <div class="label">今日营收</div>
          <div class="value">¥23,400</div>
          <div class="trend up">+12% <i class="ri-arrow-up-line"></i></div>
        </div>
        <div class="stat-card">
          <div class="label">客单价</div>
          <div class="value">¥450</div>
          <div class="trend down">-2% <i class="ri-arrow-down-line"></i></div>
        </div>
        <div class="stat-card">
          <div class="label">总订单</div>
          <div class="value">52</div>
          <div class="trend up">+5% <i class="ri-arrow-up-line"></i></div>
        </div>
      </div>
    </div>
  `;

  // Init Charts
  const trendChart = echarts.init(document.getElementById('chart-trend'));
  trendChart.setOption({
    title: { text: '近7日营收趋势' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: salesData.dates },
    yAxis: { type: 'value' },
    series: [{ data: salesData.revenue, type: 'line', smooth: true, itemStyle: { color: '#1890ff' }, areaStyle: { opacity: 0.1 } }]
  });

  const pieChart = echarts.init(document.getElementById('chart-pie'));
  pieChart.setOption({
    title: { text: '品类销售占比' },
    tooltip: { trigger: 'item' },
    series: [{ 
      type: 'pie', 
      radius: ['40%', '70%'], 
      data: salesData.categories,
      itemStyle: { borderRadius: 5 }
    }]
  });
};

const renderOrderList = () => {
  const container = document.getElementById('work-content')!;
  const rows = ordersData.map(o => `
    <tr>
      <td>${o.id}</td>
      <td>${o.customer}</td>
      <td>${o.items}</td>
      <td style="font-weight:bold">${o.amount}</td>
      <td><span class="status-badge ${getStatusClass(o.status)}">${o.status}</span></td>
      <td><button class="action-btn">查看</button></td>
    </tr>
  `).join('');

  container.innerHTML = `
    <div class="list-container">
      <div class="list-header">
        <h2>最近订单列表</h2>
        <div class="actions">
          <button class="btn primary"><i class="ri-download-line"></i> 导出</button>
        </div>
      </div>
      <table class="workspace-table">
        <thead>
          <tr>
            <th>订单号</th>
            <th>客户</th>
            <th>商品内容</th>
            <th>金额</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
};

const renderInventory = () => {
  const container = document.getElementById('work-content')!;
  const rows = inventoryData.map(i => `
    <tr>
      <td>${i.sku}</td>
      <td>${i.name}</td>
      <td style="color:${i.stock < i.threshold ? '#ff4d4f' : '#333'};font-weight:bold">${i.stock}</td>
      <td>${i.threshold}</td>
      <td><span class="status-badge ${i.status === 'normal' ? 'success' : 'error'}">${i.status === 'normal' ? '正常' : '缺货预警'}</span></td>
      <td><button class="action-btn">补货</button></td>
    </tr>
  `).join('');

  container.innerHTML = `
    <div class="list-container">
      <div class="list-header">
        <h2>库存预警中心</h2>
        <div class="actions">
          <button class="btn primary">一键补货</button>
        </div>
      </div>
      <div class="alert-banner error">
        <i class="ri-alarm-warning-line"></i> 当前有 ${inventoryData.filter(i => i.status !== 'normal').length} 款商品库存低于警戒线，请及时处理。
      </div>
      <table class="workspace-table">
        <thead>
          <tr>
            <th>SKU</th>
            <th>商品名称</th>
            <th>当前库存</th>
            <th>警戒线</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
};

const renderReport = (withSalesData: boolean = false) => {
  const container = document.getElementById('work-content')!;
  
  let salesSection = `<p>今日总销售额 ¥23,400，达成日目标的 112%。客流人数 1,208 人，转化率 4.3%。</p>`;
  
  if (withSalesData) {
     const todayRevenue = salesData.revenue[salesData.revenue.length - 1];
     const topCategory = salesData.categories.sort((a: any, b: any) => b.value - a.value)[0];
     salesSection = `
        <div class="highlight-box" style="background: #e6f7ff; padding: 10px; border-left: 4px solid #1890ff; margin: 10px 0; border-radius: 4px;">
            <strong><i class="ri-database-2-line"></i> 数据助手协同数据：</strong><br>
            今日实时营收：<span style="color: #cf1322; font-weight: bold;">¥${todayRevenue.toLocaleString()}</span><br>
            热销品类TOP1：${topCategory.name} (销量 ${topCategory.value})
        </div>
        <p>今日总销售额 ¥${todayRevenue.toLocaleString()}，达成日目标的 112%。客流人数 1,208 人，转化率 4.3%。</p>
     `;
  }

  container.innerHTML = `
    <div class="report-paper">
      <div class="paper-header">
        <h1>2024-03-20 门店运营日报</h1>
        <div class="meta">生成时间：18:30 | 生成人：汇报助手001</div>
      </div>
      <div class="paper-content">
        <h3>一、核心指标达成</h3>
        ${salesSection}
        
        <h3>二、商品销售概况</h3>
        <p>男装品类表现优异，特别是春季新款夹克售罄率达到 85%。童装区受促销活动影响，销量较昨日环比增长 20%。</p>
        
        <h3>三、门店运营异常</h3>
        <p>1. 试衣间排队时间平均超过 15 分钟，建议周末增加临时试衣区。</p>
        <p>2. SKU-002 黑色修身裤库存严重不足，已触发紧急补货申请。</p>
        
        <h3>四、明日计划</h3>
        <p>重点推广新到货的夏季T恤系列，调整橱窗陈列主题为“清凉一夏”。</p>
      </div>
      <div class="paper-footer">
        <button class="btn primary">确认并归档</button>
        <button class="btn">分享到群</button>
      </div>
    </div>
  `;
};

const renderMarketing = () => {
  const container = document.getElementById('work-content')!;
  container.innerHTML = `
    <div class="marketing-plan">
      <div class="plan-header">
        <h2>夏季新品推广方案</h2>
        <span class="status-badge processing">进行中</span>
      </div>
      <div class="plan-grid">
        <div class="plan-card">
          <div class="icon-box"><i class="ri-wechat-line"></i></div>
          <h4>私域流量</h4>
          <p>目标：触达 5000+ 会员</p>
          <div class="progress-bar"><div class="fill" style="width: 60%"></div></div>
        </div>
        <div class="plan-card">
          <div class="icon-box"><i class="ri-store-line"></i></div>
          <h4>门店陈列</h4>
          <p>主题：海岛度假风</p>
          <div class="progress-bar"><div class="fill" style="width: 100%"></div></div>
        </div>
        <div class="plan-card">
          <div class="icon-box"><i class="ri-coupon-3-line"></i></div>
          <h4>优惠券发放</h4>
          <p>满500减50，发放1000张</p>
          <div class="progress-bar"><div class="fill" style="width: 30%"></div></div>
        </div>
      </div>
      <div class="ai-suggestion">
        <h4><i class="ri-sparkling-fill"></i> AI 优化建议</h4>
        <p>根据历史数据分析，建议将“满500减50”的门槛降低至400元，预计可提升转化率 15%。</p>
        <button class="btn primary small">采纳建议</button>
      </div>
    </div>
  `;
};

// === Assistants Configuration ===
const assistants: Assistant[] = [
  {
    id: 'data',
    name: '数据分析师',
    role: 'Data Analyst',
    trigger: '数据',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Data',
    color: '#1890ff',
    complexity: 'simple',
    action: () => {
      renderSalesDashboard();
      return `
        已为您生成今日最新的销售数据大屏，请查看左侧工作区。
        <div class="confirm-box" style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #f0f0f0;">
          <p style="margin-bottom: 8px; font-size: 13px; color: #595959;">是否需要根据今日的运营情况完成日报编写？</p>
          <div style="display: flex; gap: 8px;">
            <button class="btn small primary btn-yes">是，生成日报</button>
            <button class="btn small btn-no">否</button>
          </div>
        </div>
      `;
    }
  },
  {
    id: 'order',
    name: '订单助手',
    role: 'Order Specialist',
    trigger: '订单',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Order',
    color: '#52c41a',
    complexity: 'simple',
    action: () => {
      renderOrderList();
      return '已检索到最近的 5 笔订单记录，您可以进行查看或导出。';
    }
  },
  {
    id: 'stock',
    name: '库存管理员',
    role: 'Inventory Manager',
    trigger: '库存',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Stock',
    color: '#ff4d4f',
    complexity: 'simple',
    action: () => {
      renderInventory();
      return '库存检查完成。发现 2 款商品库存不足，已在左侧列出预警清单。';
    }
  },
  {
    id: 'report',
    name: '汇报助手',
    role: 'Reporter',
    trigger: '日报',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Report',
    color: '#722ed1',
    complexity: 'complex',
    action: (query: string) => {
      const withData = query.includes('@数据') || query.includes('数据分析师') || query.includes('@Data');
      renderReport(withData);
      if (withData) {
        return '收到！已协同 @数据分析师 获取最新营收数据，并为您生成了包含详细指标的运营日报。';
      }
      return '今日运营日报已自动生成，汇总了销售、客流及异常情况，请审阅。';
    }
  },
  {
    id: 'marketing',
    name: '营销策划',
    role: 'Marketing',
    trigger: '营销',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Market',
    color: '#fa8c16',
    complexity: 'complex',
    action: () => {
      renderMarketing();
      return '已加载夏季新品推广方案，并根据数据提供了 AI 优化建议。';
    }
  },
  {
    id: 'design',
    name: '设计助手',
    role: 'Creative Design',
    trigger: '设计',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Design',
    color: '#eb2f96',
    complexity: 'simple',
    action: () => {
      renderTryOnModal();
      return '正在为您打开智能设计工坊，请在弹窗中上传素材。';
    }
  }
];

// === Helpers ===
const getStatusClass = (status: string) => {
  if (status === '已完成') return 'success';
  if (status === '已取消') return 'error';
  return 'processing';
};

const addMessage = (text: string, type: 'user' | 'system' | 'assistant', assistant?: Assistant): HTMLElement => {
  const container = document.getElementById('chat-messages')!;
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${type}`;
  
  if (type === 'assistant' && assistant) {
    msgDiv.innerHTML = `
      <div class="avatar"><img src="${assistant.avatar}"></div>
      <div class="content">
        <div class="name">${assistant.name} <span class="role">${assistant.role}</span></div>
        <div class="bubble">${text}</div>
      </div>
    `;
  } else if (type === 'user') {
    msgDiv.innerHTML = `
      <div class="bubble">${text}</div>
      <div class="avatar"><img src="https://ui-avatars.com/api/?name=Admin&background=1890ff&color=fff"></div>
    `;
  } else {
    msgDiv.innerHTML = `<div class="bubble">${text}</div>`;
  }
  
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
  return msgDiv;
};

// Simulate Thinking Process
const simulateThinking = async (ast: Assistant) => {
  const container = document.getElementById('chat-messages')!;
  const msgDiv = document.createElement('div');
  msgDiv.className = 'message assistant thinking';
  msgDiv.innerHTML = `
    <div class="avatar"><img src="${ast.avatar}"></div>
    <div class="content">
      <div class="name">${ast.name} <span class="role">${ast.role}</span></div>
      <div class="bubble">
        <div class="thinking-process">
          <div class="thinking-step"><i class="ri-loader-4-line spinner"></i> 正在理解意图...</div>
        </div>
        <div class="typing-indicator">
          <div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>
        </div>
      </div>
    </div>
  `;
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;

  const steps = [
    '正在查询相关数据...',
    '正在分析业务逻辑...',
    '正在生成可视化报表...',
    '整理最终结果...'
  ];

  const processDiv = msgDiv.querySelector('.thinking-process')!;
  
  for (const step of steps) {
    await new Promise(r => setTimeout(r, 800)); // Delay between steps
    // Mark prev as done
    const prev = processDiv.lastElementChild as HTMLElement;
    if (prev) {
      prev.innerHTML = `<i class="ri-checkbox-circle-fill" style="color:#52c41a"></i> ${prev.innerText.replace('...', '')}`;
      prev.classList.add('done');
    }
    // Add new step
    const next = document.createElement('div');
    next.className = 'thinking-step';
    next.innerHTML = `<i class="ri-loader-4-line spinner"></i> ${step}`;
    processDiv.appendChild(next);
    container.scrollTop = container.scrollHeight;
  }
  
  await new Promise(r => setTimeout(r, 800));
  msgDiv.remove(); // Remove thinking bubble
};

// Render Suggestion List
const renderSuggestionList = () => {
  let list = document.querySelector('.suggestion-list');
  if (!list) {
    list = document.createElement('div');
    list.className = 'suggestion-list';
    document.querySelector('.chat-input-area')!.appendChild(list);
  }
  
  const items = assistants.map(ast => `
    <div class="suggestion-item" data-trigger="${ast.trigger}">
      <img src="${ast.avatar}">
      <div style="flex:1">
        <div class="name">${ast.name}</div>
      </div>
      <span class="trigger">@${ast.trigger}</span>
    </div>
  `).join('');
  
  list.innerHTML = items;
  
  list.querySelectorAll('.suggestion-item').forEach(item => {
    item.addEventListener('click', () => {
      const trigger = (item as HTMLElement).dataset.trigger;
      const input = document.getElementById('chat-input') as HTMLTextAreaElement;
      const val = input.value;
      const lastAt = val.lastIndexOf('@');
      input.value = val.substring(0, lastAt) + `@${trigger} `;
      input.focus();
      list!.classList.remove('visible');
    });
  });
};

const handleInput = async () => {
  const input = document.getElementById('chat-input') as HTMLTextAreaElement;
  const list = document.querySelector('.suggestion-list');
  const text = input.value.trim();
  
  if (!text) return;

  list?.classList.remove('visible');
  addMessage(text, 'user');
  input.value = '';

  await executeCommand(text);
};

const executeCommand = async (text: string) => {
  let matched = false;
  for (const ast of assistants) {
    if (text.startsWith(`@${ast.trigger}`) || text.includes(ast.name)) {
      matched = true;
      
      if (ast.complexity === 'complex') {
        await simulateThinking(ast);
      } else {
        await new Promise(r => setTimeout(r, 500)); // Short delay for simple
      }
      
      const reply = ast.action(text);
      const msgNode = addMessage(reply, 'assistant', ast);
      
      // Special logic for Data Assistant confirm box
      if (ast.id === 'data') {
        const yesBtn = msgNode.querySelector('.btn-yes');
        const noBtn = msgNode.querySelector('.btn-no');
        const confirmBox = msgNode.querySelector('.confirm-box');
        
        if (yesBtn && confirmBox) {
          yesBtn.addEventListener('click', () => {
            // Disable buttons to prevent double click
            confirmBox.innerHTML = '<span style="color:#52c41a; font-size:12px"><i class="ri-checkbox-circle-fill"></i> 已确认，正在唤起汇报助手...</span>';
            executeCommand('@汇报助手 根据@数据助手的今日数据，生成今天的工作日报');
          });
        }
        
        if (noBtn && confirmBox) {
          noBtn.addEventListener('click', () => {
             confirmBox.remove();
          });
        }
      }

      break;
    }
  }

  if (!matched) {
    setTimeout(() => {
      addMessage('抱歉，我没有找到相关的数字员工。您可以尝试 @数据、@订单、@库存、@日报 或 @营销。', 'system');
    }, 600);
  }
};

// === Init ===
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('chat-input') as HTMLTextAreaElement;
  const sendBtn = document.getElementById('send-btn')!;

  renderSuggestionList();
  const list = document.querySelector('.suggestion-list')!;
  let selectedSuggestionIndex = 0;

  const updateSelection = () => {
    const items = list.querySelectorAll('.suggestion-item');
    items.forEach((item, index) => {
      if (index === selectedSuggestionIndex) {
        item.classList.add('active');
        (item as HTMLElement).scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('active');
      }
    });
  };

  input.addEventListener('input', (e) => {
    const val = input.value;
    const lastChar = val.slice(-1);
    
    // Simple logic: show list if ends with @ or just typed @
    if (val.includes('@')) {
      const afterAt = val.split('@').pop();
      if (afterAt !== undefined && afterAt.length < 15 && !afterAt.includes(' ')) {
         list.classList.add('visible');
         // If previously hidden or index invalid, reset to 0
         if (!list.classList.contains('visible') || selectedSuggestionIndex < 0) {
            selectedSuggestionIndex = 0;
         }
         updateSelection();
      } else if (lastChar === '@') {
         list.classList.add('visible');
         selectedSuggestionIndex = 0;
         updateSelection();
      } else {
         list.classList.remove('visible');
         selectedSuggestionIndex = 0;
      }
    } else {
      list.classList.remove('visible');
      selectedSuggestionIndex = 0;
    }
  });

  input.addEventListener('keydown', (e) => {
    const isVisible = list.classList.contains('visible');
    
    if (isVisible) {
      const items = list.querySelectorAll('.suggestion-item');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedSuggestionIndex = (selectedSuggestionIndex + 1) % items.length;
        updateSelection();
        return;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedSuggestionIndex = (selectedSuggestionIndex - 1 + items.length) % items.length;
        updateSelection();
        return;
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedSuggestionIndex >= 0 && items[selectedSuggestionIndex]) {
          (items[selectedSuggestionIndex] as HTMLElement).click();
          // Reset after selection
          selectedSuggestionIndex = 0;
          updateSelection();
        }
        return;
      }
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleInput();
    }
  });

  sendBtn.addEventListener('click', handleInput);

  // Sidebar Interactions
  document.querySelectorAll('.shortcut-item').forEach(item => {
    item.addEventListener('click', () => {
      const name = item.querySelector('span')?.textContent;
      addMessage(`唤起快捷功能：${name}`, 'system');
      
      // Map shortcuts to assistant commands
      if (name === '新建报表') executeCommand('@汇报助手 生成一份新的销售报表');
      if (name === '库存预警') executeCommand('@库存管理员 检查当前库存状态');
      if (name === '员工排班') addMessage('排班系统正在同步数据，请稍后...', 'system');
      if (name === '营销策划') executeCommand('@营销策划 开启夏季新品推广方案');
    });
  });

  document.querySelectorAll('.bookmark-item').forEach(item => {
    item.addEventListener('click', () => {
      const name = item.querySelector('.name')?.textContent;
      addMessage(`正在打开收藏记录：${name}`, 'system');
      
      if (name?.includes('销售分析')) executeCommand('@数据分析师 展示销售分析大屏');
      if (name?.includes('KPI')) addMessage('正在加载 KPI 考评详情...', 'system');
      if (name?.includes('补货')) executeCommand('@库存管理员 查看智能补货建议');
    });
  });

  renderWelcome();
});
