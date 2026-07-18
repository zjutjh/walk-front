export const CAMPUS_OPTIONS = [
  { label: '朝晖', value: 'zh' },
  { label: '屏峰', value: 'pf' },
  { label: '莫干山', value: 'mgs' },
]

export const ROUTE_OPTIONS = [
  { label: '屏峰半程', value: 'pf-half' },
  { label: '屏峰全程', value: 'pf-full' },
  { label: '莫干山全程', value: 'mgs' },
]

const CAMPUS_TEXT: Record<string, string> = {
  zh: '朝晖校区',
  pf: '屏峰校区',
  mgs: '莫干山校区',
}

const ROUTE_TEXT: Record<string, string> = {
  'pf-half': '屏峰半程',
  'pf-full': '屏峰全程',
  mgs: '莫干山全程',
}

const POINT_TEXT: Record<string, string> = {
  pfxq: '屏峰校区',
  jls: '金莲寺',
  blt: '白龙潭',
  cmq: '慈母桥',
  gzsgy: '古樟树公园',
  pfs: '屏峰山',
  pfsy: '屏峰山园',
  ljs: '老焦山',
  mgsxq: '莫干山校区',
  zfgy: '肇丰公园',
  hbgy: '花瓣公园',
  tayg: '天安云谷',
  dtx: '东苕溪',
}

const USER_TYPE_TEXT: Record<string, string> = {
  student: '学生',
  teacher: '教职工',
  alumnus: '校友',
  alumni: '校友',
}

const WALK_STATUS_TEXT: Record<string, string> = {
  not_start: '未开始',
  pending: '待出发',
  abandoned: '已放弃',
  in_progress: '进行中',
  withdrawn: '已下撤',
  violated: '已违规',
  completed: '已完成',
}

const TEAM_STATUS_TEXT: Record<string, string> = {
  not_start: '未开始',
  in_progress: '进行中',
  withdrawn: '未完成',
  completed: '完成',
}

export function campusText(campus: string): string {
  return CAMPUS_TEXT[campus] ?? campus
}

export function routeText(routeName: string): string {
  return ROUTE_TEXT[routeName] ?? routeName
}

export function pointText(pointName: string): string {
  if (!pointName) return '未开始'
  return POINT_TEXT[pointName] ?? pointName
}

export function userTypeText(type: string): string {
  return USER_TYPE_TEXT[type] ?? type
}

export function walkStatusText(status: string): string {
  return WALK_STATUS_TEXT[status] ?? status
}

export function teamStatusText(status: string): string {
  return TEAM_STATUS_TEXT[status] ?? status
}

export function isCaptain(role: string): boolean {
  return role === 'captain'
}
