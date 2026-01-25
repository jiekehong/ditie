import type { CapabilityMapData } from '../types';

export const capabilityMapData: CapabilityMapData = {
  lanes: [
    '门店运营',
    '商品管理',
    '人才管理',
    '区域管理',
    '营销运营',
    '财务收银'
  ],
  tools: [
    { id: 'tool-dashboard', name: '单点仪表盘', system: 'BI' },
    { id: 'tool-taskboard', name: '任务看板', system: '协同' },
    { id: 'tool-bi', name: 'BI报表', system: 'BI' },
    { id: 'tool-wms', name: '库存系统', system: 'WMS' },
    { id: 'tool-pdt', name: 'PDT手持终端', system: '硬件' },
    { id: 'tool-attendance', name: '打卡系统', system: 'HR' },
    { id: 'tool-store-log', name: '门店日志', system: '门店运营' },
    { id: 'tool-merch-guide', name: '陈列指南', system: '标准' },
    { id: 'tool-assistant', name: '导购助手', system: '移动' },
    { id: 'tool-transfer', name: '调拨单', system: 'WMS' },
    { id: 'tool-crm', name: '会员CRM', system: 'CRM' },
    { id: 'tool-miniprogram', name: '微信小程序', system: '渠道' },
    { id: 'tool-inspection', name: '移动巡店App', system: '巡店' },
    { id: 'tool-marketing', name: '营销平台', system: '运营' },
    { id: 'tool-assets', name: '海报素材库', system: '素材' },
    { id: 'tool-pos', name: 'POS收银系统', system: 'POS' },
    { id: 'tool-learning', name: '学习平台', system: 'HR' }
  ],
  responsibilities: [
    { id: 'resp-morning-meeting', name: '早会', toolIds: ['tool-dashboard', 'tool-taskboard', 'tool-bi'] },
    { id: 'resp-merchandize', name: '理货', toolIds: ['tool-wms', 'tool-pdt'] },
    { id: 'resp-open-close', name: '开闭店', toolIds: ['tool-attendance', 'tool-store-log'] },
    { id: 'resp-display', name: '陈列调整', toolIds: ['tool-merch-guide', 'tool-assistant'] },
    { id: 'resp-replenish', name: '补货', toolIds: ['tool-wms', 'tool-transfer'] },
    { id: 'resp-stocktake', name: '盘点', toolIds: ['tool-pdt', 'tool-wms'] },
    { id: 'resp-member', name: '会员维护', toolIds: ['tool-crm', 'tool-miniprogram'] },
    { id: 'resp-performance', name: '业绩追踪', toolIds: ['tool-dashboard', 'tool-bi'] },
    { id: 'resp-inventory', name: '库存管理', toolIds: ['tool-wms'] },
    { id: 'resp-training', name: '培训', toolIds: ['tool-learning'] },
    { id: 'resp-inspection', name: '巡店稽核', toolIds: ['tool-inspection', 'tool-bi'] },
    { id: 'resp-campaign', name: '活动执行', toolIds: ['tool-marketing', 'tool-assets'] },
    { id: 'resp-cashier', name: '收银', toolIds: ['tool-pos'] },
    { id: 'resp-analysis', name: '数据分析', toolIds: ['tool-bi'] }
  ],
  digitalEmployees: [
    { 
      id: 'de-001', 
      name: '数字员工001', 
      alias: '门店运营助手',
      capabilities: ['自动生成晨会报告', '实时业绩播报', '库存异常预警', '陈列合规性检测', '客流热力分析']
    },
    { 
      id: 'de-002', 
      name: '数字员工002', 
      alias: '商品管理助手',
      capabilities: ['畅滞销款分析', '智能补货建议', '库存周转率预测', '调拨路径优化']
    },
    { 
      id: 'de-003', 
      name: '数字员工003', 
      alias: '人才发展助手',
      capabilities: ['员工培训进度追踪', '人效分析报告', '排班自动优化', '考勤异常处理']
    },
    { 
      id: 'de-004', 
      name: '数字员工004', 
      alias: '区域巡店助手',
      capabilities: ['远程巡店报告生成', '问题整改闭环追踪', '区域销售对比分析', '竞品情报汇总']
    },
    { 
      id: 'de-005', 
      name: '数字员工005', 
      alias: '营销运营助手',
      capabilities: ['活动ROI实时测算', '会员画像精准标签', '营销素材自动分发', '社群活跃度监控']
    },
    { 
      id: 'de-006', 
      name: '数字员工006', 
      alias: '收银保障助手',
      capabilities: ['收银差错自动核对', '支付系统状态监控', '会员积分自动抵扣', '电子发票自动推送']
    }
  ],
  roles: [
    {
      id: 'role-store-manager',
      name: '店长',
      lane: '门店运营',
      digitalEmployeeId: 'de-001',
      responsibilityIds: [
        'resp-morning-meeting',
        'resp-performance',
        'resp-open-close',
        'resp-display',
        'resp-replenish',
        'resp-stocktake'
      ],
      aiSupportedResponsibilityIds: [
        'resp-morning-meeting',
        'resp-performance',
        'resp-stocktake'
      ]
    },
    {
      id: 'role-sales',
      name: '导购',
      lane: '门店运营',
      digitalEmployeeId: 'de-001',
      responsibilityIds: [
        'resp-member',
        'resp-merchandize',
        'resp-display',
        'resp-campaign',
        'resp-performance'
      ],
      aiSupportedResponsibilityIds: [
        'resp-member',
        'resp-campaign'
      ]
    },
    {
      id: 'role-merchandiser',
      name: '陈列师',
      lane: '商品管理',
      digitalEmployeeId: 'de-002',
      responsibilityIds: [
        'resp-display',
        'resp-replenish',
        'resp-analysis'
      ],
      aiSupportedResponsibilityIds: [
        'resp-analysis'
      ]
    },
    {
      id: 'role-warehouse',
      name: '仓管',
      lane: '商品管理',
      digitalEmployeeId: 'de-002',
      responsibilityIds: [
        'resp-inventory',
        'resp-stocktake',
        'resp-replenish'
      ],
      aiSupportedResponsibilityIds: [
        'resp-stocktake',
        'resp-inventory'
      ]
    },
    {
      id: 'role-cashier',
      name: '收银员',
      lane: '财务收银',
      digitalEmployeeId: 'de-006',
      responsibilityIds: [
        'resp-cashier',
        'resp-member',
        'resp-performance'
      ],
      aiSupportedResponsibilityIds: [
        'resp-cashier'
      ]
    },
    {
      id: 'role-region-supervisor',
      name: '区域督导',
      lane: '区域管理',
      digitalEmployeeId: 'de-004',
      responsibilityIds: [
        'resp-inspection',
        'resp-training',
        'resp-analysis'
      ],
      aiSupportedResponsibilityIds: [
        'resp-analysis',
        'resp-inspection'
      ]
    },
    {
      id: 'role-hr',
      name: '人事专员',
      lane: '人才管理',
      digitalEmployeeId: 'de-003',
      responsibilityIds: [
        'resp-training',
        'resp-open-close'
      ],
      aiSupportedResponsibilityIds: [
        'resp-training'
      ]
    },
    {
      id: 'role-ops',
      name: '店铺运营专员',
      lane: '门店运营',
      digitalEmployeeId: 'de-001',
      responsibilityIds: [
        'resp-campaign',
        'resp-performance',
        'resp-analysis'
      ],
      aiSupportedResponsibilityIds: [
        'resp-campaign',
        'resp-analysis'
      ]
    }
  ]
};
