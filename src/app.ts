import { capabilityMapData } from './data/mock';
import '../public/styles.css';
import type { CapabilityMapData, RoleStation, Responsibility, Tool, DigitalEmployee } from './types';

declare const Swal: any;
declare const tippy: any;

const data: CapabilityMapData = capabilityMapData;

const laneColor = (lane: string): string => {
  switch (lane) {
    case '门店运营': return '#1890ff';
    case '商品管理': return '#52c41a';
    case '人才管理': return '#722ed1';
    case '区域管理': return '#fa8c16';
    case '营销运营': return '#eb2f96';
    case '财务收银': return '#faad14';
    default: return '#8c8c8c';
  }
};

const findTools = (toolIds: string[]): Tool[] =>
  toolIds.map((id) => data.tools.find((t) => t.id === id)).filter(Boolean) as Tool[];

const findResponsibilities = (ids: string[]): Responsibility[] =>
  ids.map((id) => data.responsibilities.find((r) => r.id === id)).filter(Boolean) as Responsibility[];

const findDE = (id?: string): DigitalEmployee | undefined =>
  data.digitalEmployees.find((d) => d.id === id);

const qs = (sel: string) => document.querySelector(sel) as HTMLElement;
const ce = (tag: string, className?: string) => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  return el;
};

const showDEModal = (de: DigitalEmployee) => {
  Swal.fire({
    title: `<div style="display:flex;align-items:center;gap:12px"><i class="ri-robot-line" style="font-size:28px;color:#1890ff"></i> ${de.name}</div>`,
    html: `
      <div style="text-align:left">
        <div style="color:#666;margin-bottom:20px;font-size:14px;background:#f5f7fa;padding:8px 12px;border-radius:6px">${de.alias}</div>
        <div style="font-weight:600;margin-bottom:12px;color:#333;display:flex;align-items:center;gap:6px"><i class="ri-flashlight-fill" style="color:#faad14"></i> 核心能力</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          ${(de.capabilities || []).map(cap => 
            `<span style="background:#e6f7ff;color:#1890ff;padding:6px 12px;border-radius:20px;font-size:13px;border:1px solid #bae7ff">${cap}</span>`
          ).join('')}
        </div>
      </div>
    `,
    showConfirmButton: false,
    showCloseButton: true,
    width: 480,
    padding: '24px',
    customClass: {
      popup: 'de-swal-popup'
    }
  });
};

// 拖拽滚动逻辑
const initDragScroll = () => {
  const viewport = qs('#viewport');
  if (!viewport) return; // 某些页面可能没有 viewport
  
  let isDown = false;
  let startX: number;
  let startY: number;
  let scrollLeft: number;
  let scrollTop: number;

  viewport.addEventListener('mousedown', (e) => {
    isDown = true;
    viewport.classList.add('active');
    startX = e.pageX - viewport.offsetLeft;
    startY = e.pageY - viewport.offsetTop;
    scrollLeft = viewport.scrollLeft;
    scrollTop = viewport.scrollTop;
  });

  viewport.addEventListener('mouseleave', () => {
    isDown = false;
    viewport.classList.remove('active');
  });

  viewport.addEventListener('mouseup', () => {
    isDown = false;
    viewport.classList.remove('active');
  });

  viewport.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - viewport.offsetLeft;
    const y = e.pageY - viewport.offsetTop;
    const walkX = (x - startX) * 1.5; // 滚动速度系数
    const walkY = (y - startY) * 1.5;
    viewport.scrollLeft = scrollLeft - walkX;
    viewport.scrollTop = scrollTop - walkY;
  });
};

const renderMap = () => {
  const root = qs('#lanes');
  if (!root) return;
  root.innerHTML = '';
  
  data.lanes.forEach((lane, laneIndex) => {
    const laneWrapper = ce('div', 'lane-wrapper');
    
    const laneTitle = ce('div', 'lane-title');
    laneTitle.textContent = lane;
    laneTitle.style.backgroundColor = laneColor(lane);
    laneWrapper.appendChild(laneTitle);

    const track = ce('div', 'roles-track');
    
    const roles = data.roles.filter((r) => r.lane === lane);

    roles.forEach((role, roleIndex) => {
      const roleGroup = ce('div', 'role-group');
      
      // 鼠标悬停聚焦效果
      roleGroup.onmouseenter = () => {
        document.querySelectorAll('.role-group').forEach(el => {
          if (el !== roleGroup) el.classList.add('dimmed');
        });
      };
      roleGroup.onmouseleave = () => {
        document.querySelectorAll('.role-group').forEach(el => el.classList.remove('dimmed'));
      };

      const isTop = roleIndex % 2 === 0;

      const topArea = ce('div', 'branches-top-area');
      
      const nodeWrapper = ce('div', 'role-node-wrapper');
      
      // Calculate Metrics
      const resps = findResponsibilities(role.responsibilityIds);
      const totalResps = resps.length;
      const digitizedResps = resps.filter(r => r.toolIds && r.toolIds.length > 0).length;
      const digitalRate = totalResps > 0 ? Math.round((digitizedResps / totalResps) * 100) : 0;

      // 2. Intelligence: Intersection of total responsibilities and AI supported ones
      const aiSupportedIds = role.aiSupportedResponsibilityIds || [];
      const validAiSupportedCount = role.responsibilityIds.filter(id => aiSupportedIds.includes(id)).length;
      const intelligentRate = totalResps > 0 ? Math.round((validAiSupportedCount / totalResps) * 100) : 0;

      const roleNode = ce('div', 'role-node');
      roleNode.innerHTML = `
        <div class="role-name">${role.name}</div>
        <div class="role-metrics">
          <div class="metric-item">
            <span class="label">数</span>
            <span class="value ${digitalRate >= 80 ? 'high' : ''}">${digitalRate}%</span>
          </div>
          <div class="metric-item">
            <span class="label">智</span>
            <span class="value ${intelligentRate >= 80 ? 'high' : ''}">${intelligentRate}%</span>
          </div>
        </div>
      `;
      // 使用 borderTopColor 等来设置边框颜色，避免覆盖所有 border 属性
      roleNode.style.borderColor = laneColor(lane);
      nodeWrapper.appendChild(roleNode);

      const bottomArea = ce('div', 'branches-bottom-area');

      const de = findDE(role.digitalEmployeeId);
      if (de) {
        const deCard = ce('div', 'de-card');
        deCard.innerHTML = `
          <div class="de-title"><i class="ri-robot-line"></i> ${de.name}</div>
          <div class="de-desc">${de.alias}</div>
        `;
        deCard.style.pointerEvents = 'auto'; // Enable clicks
        deCard.style.cursor = 'pointer';
        deCard.onclick = (e) => {
          e.stopPropagation(); // Prevent drag
          showDEModal(de);
        };
        roleGroup.appendChild(deCard);
      }

      if (resps.length > 0) {
        const branchContainer = ce('div', 'branches-container');
        
        resps.forEach(resp => {
          const respCard = ce('div', 'resp-card');
          
          const rTitle = ce('div', 'resp-title');
          rTitle.textContent = resp.name;
          respCard.appendChild(rTitle);

          const tools = findTools(resp.toolIds);
          if (tools.length > 0) {
            const toolList = ce('div', 'tool-list');
            tools.forEach(t => {
              const tag = ce('span', 'tool-tag');
              tag.textContent = t.name;
              toolList.appendChild(tag);
            });
            respCard.appendChild(toolList);
          }

          branchContainer.appendChild(respCard);
        });

        if (isTop) {
          topArea.appendChild(branchContainer);
          roleGroup.classList.add('has-top');
        } else {
          bottomArea.appendChild(branchContainer);
          roleGroup.classList.add('has-bottom');
        }
      }

      roleGroup.appendChild(topArea);
      roleGroup.appendChild(nodeWrapper);
      roleGroup.appendChild(bottomArea);

      track.appendChild(roleGroup);
    });

    laneWrapper.appendChild(track);
    root.appendChild(laneWrapper);
  });
};

const renderTable = () => {
  const root = qs('#table-container');
  if (!root) return;
  
  root.innerHTML = '';
  
  const table = ce('table', 'data-table');
  
  // Header
  const thead = ce('thead');
  thead.innerHTML = `
    <tr>
      <th width="10%">业务板块</th>
      <th width="10%">岗位名称</th>
      <th width="10%">
        <span class="th-with-tooltip" data-tippy-content="计算公式：(使用了数字化工具的职责数 / 岗位总职责数) * 100%">
          数字化程度 <i class="ri-question-line"></i>
        </span>
      </th>
      <th width="10%">
        <span class="th-with-tooltip" data-tippy-content="计算公式：(由数字员工支持或替代的职责数 / 岗位总职责数) * 100%">
          智能化程度 <i class="ri-question-line"></i>
        </span>
      </th>
      <th width="15%">数字员工</th>
      <th width="25%">核心职责</th>
      <th width="20%">主要工具</th>
    </tr>
  `;
  table.appendChild(thead);
  
  const tbody = ce('tbody');
  
  data.lanes.forEach(lane => {
    const roles = data.roles.filter(r => r.lane === lane);
    roles.forEach(role => {
      const tr = ce('tr');
      
      const resps = findResponsibilities(role.responsibilityIds);
      const totalResps = resps.length;
      const digitizedResps = resps.filter(r => r.toolIds && r.toolIds.length > 0).length;
      const digitalRate = totalResps > 0 ? Math.round((digitizedResps / totalResps) * 100) : 0;
      
      const aiSupportedIds = role.aiSupportedResponsibilityIds || [];
      const validAiSupportedCount = role.responsibilityIds.filter(id => aiSupportedIds.includes(id)).length;
      const intelligentRate = totalResps > 0 ? Math.round((validAiSupportedCount / totalResps) * 100) : 0;
      
      const de = findDE(role.digitalEmployeeId);
      
      // Collect all tools
      const allTools = new Set<string>();
      resps.forEach(r => {
        const tools = findTools(r.toolIds);
        tools.forEach(t => allTools.add(t.name));
      });
      
      tr.innerHTML = `
        <td><span class="lane-tag" style="background:${laneColor(lane)}20; color:${laneColor(lane)}">${lane}</span></td>
        <td style="font-weight:600">${role.name}</td>
        <td><span class="rate-tag ${digitalRate >= 80 ? 'high' : ''}">${digitalRate}%</span></td>
        <td><span class="rate-tag ${intelligentRate >= 80 ? 'high' : ''}">${intelligentRate}%</span></td>
        <td></td>
        <td class="small-text">${resps.map(r => r.name).join('、')}</td>
        <td>
          <div class="table-tool-list">
            ${Array.from(allTools).map(t => `<span class="tool-tag">${t}</span>`).join('')}
          </div>
        </td>
      `;
      
      // Manually insert DE pill to attach event listener
      const deCell = tr.children[4] as HTMLElement;
      if (de) {
        const dePill = ce('div', 'de-pill');
        dePill.innerHTML = `<i class="ri-robot-line"></i> ${de.name}`;
        dePill.style.cursor = 'pointer';
        dePill.onclick = () => showDEModal(de);
        deCell.appendChild(dePill);
      }
      
      tbody.appendChild(tr);
    });
  });
  
  table.appendChild(tbody);
  root.appendChild(table);
  
  // Init Tippy
  tippy('[data-tippy-content]', {
    placement: 'top',
    animation: 'scale',
    theme: 'light-border'
  });
};

document.addEventListener('DOMContentLoaded', () => {
  // 根据页面元素决定渲染什么
  if (qs('#lanes')) {
    renderMap();
    initDragScroll();
  }
  if (qs('#table-container')) {
    renderTable();
  }
});
