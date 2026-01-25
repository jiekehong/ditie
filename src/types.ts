export type Tool = {
  id: string;
  name: string;
  system?: string;
  description?: string;
};

export type Responsibility = {
  id: string;
  name: string;
  toolIds: string[];
};

export type DigitalEmployee = {
  id: string;
  name: string;
  alias: string;
  capabilities?: string[]; // 新增能力列表
};

export type RoleStation = {
  id: string;
  name: string;
  lane: string;
  digitalEmployeeId?: string;
  responsibilityIds: string[];
  // 新增：明确哪些职责是由数字员工支持/替代的
  aiSupportedResponsibilityIds?: string[];
};

export type CapabilityMapData = {
  lanes: string[];
  tools: Tool[];
  responsibilities: Responsibility[];
  roles: RoleStation[];
  digitalEmployees: DigitalEmployee[];
};
