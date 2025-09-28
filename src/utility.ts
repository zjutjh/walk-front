import exp from 'constants'
import Server from './config/server'
import axios from 'axios'

import { useRouter } from 'vue-router'

import { useMessage } from 'naive-ui'
import path from 'path'


export function getQueryVariable(variable: string): string {
  let query = window.location.search.substring(1)
  let vars = query.split('&')
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split('=')
    if (pair[0] == variable) {
      return pair[1]
    }
  }
  return ''
}

// 加载时用来存储个人信息的函数
export function storeUserInfo(respData: any) {
  localStorage.setItem('user_data', JSON.stringify(respData['data']))
}

// 加载并存储团队信息的函数
export async function storeTeamInfo(userInfoApiRespData: any, jwt: string) {
  const getTeamInfoUrl = Server.urlPrefix + Server.apiMap['team']['info']
  const response = await axios.get(getTeamInfoUrl, {
    timeout: 3000,
    headers: {
      Authorization: 'Bearer ' + jwt,
    },
  })

  const respData: any = response.data
  localStorage.setItem('team_data', JSON.stringify(respData['data']))
}

// 加载并存储个人消息
export async function storeUserMesage(jwt: string) {
  const getMessagesUrl = Server.urlPrefix + Server.apiMap['message']['list']
  const response = await axios.get(getMessagesUrl, {
    timeout: 3000,
    headers: {
      Authorization: 'Bearer ' + jwt,
    },
  })

  const respData: any = response.data
  if (respData['code'] == 200)
    localStorage.setItem('message_data', JSON.stringify(respData['data']))
  else 
    localStorage.setItem('message_data', '')
}

// 校验一个 key 是否在 object 中的函数
export function isValidKey(key: string | number | symbol, object: object): key is keyof object {
  return key in object
}

// 判断是否是老师
export function isTeacher(): boolean {
  const userData = getUserData()
  return userData['campus'] === 5
}

// 查询 info 页面应该显示哪个 tab
export function defaultTab(): string {
  let parentPathOfLoading: string
  if (localStorage.getItem('parentPathOfLoading') === null) {
    parentPathOfLoading = '/'
  } else {
    parentPathOfLoading = localStorage.getItem('parentPathOfLoading') as string
  }

  const defaultTabTable = {
    '/info/user/showteacher': 'user',
    '/info/team/teaminfo': 'team',
    '/info/team/updateteam': 'team',
    '/info/team/managemember': 'team',
    '/info/update/teacher': 'user',
    '/info/update/student': 'user',
    '/info/team/notjoin': 'team',
    '/info/team/join': 'team',
    '/info/team/create': 'team',
    '/poster': 'team',
    '/info/message/showlist': 'message',
    '/info/message/nomessage': 'message',
  }

  // 根据 loading 页面的父页面来选择默认 tab
  if (isValidKey(parentPathOfLoading, defaultTabTable)) {
    return defaultTabTable[parentPathOfLoading]
  } else {
    return 'user'
  }
}

export function getUserData(): any {
  return JSON.parse(localStorage.getItem('user_data') as string)
}

export function getTeamData(): any {
  return JSON.parse(localStorage.getItem('team_data') as string)
}

export function parseGender(genderNumber: number): string {
  return genderNumber == 1 ? '男' : '女'
}

export function parseCampus(campusNumber: number): string {
  if (campusNumber == 1) {
    return '朝晖校区'
  } else if (campusNumber == 2) {
    return '屏峰校区'
  } else if (campusNumber == 3) {
    return '莫干山校区'
  } else {
    return ''
  }
}


export const useRefresh = () => {
  const router = useRouter();
  const message = useMessage(); 
  return function refresh(from?: string) { //是否回到当前页面
    if (localStorage.getItem('canLoadInfo') == null || localStorage.getItem('canLoadInfo') == 'yes') {
      localStorage.setItem('canLoadInfo', 'no')
      router.push({
        path: "/loading",
        query: {
          from: from
        }
      })
      setTimeout(() => {
        localStorage.setItem('canLoadInfo', 'yes')
      }, 1000)
    } else {
      message.warning('让生产队的驴休息一下吧')
    }
  }
}

export interface WeChatShareOptions {
  title?: string
  desc?: string
  imgUrl?: string
  link?: string
}

interface WeChatSharePayload {
  title: string
  desc: string
  imgUrl: string
  link: string
}

interface WeChatShareApi {
  ready?: (callback: () => void) => void
  updateAppMessageShareData?: (config: WeChatSharePayload) => void
  updateTimelineShareData?: (config: WeChatSharePayload) => void
  onMenuShareAppMessage?: (config: WeChatSharePayload) => void
  onMenuShareTimeline?: (config: WeChatSharePayload) => void
}

interface WeixinJSBridgeApi {
  on?: (event: string, handler: () => void) => void
  invoke?: (method: string, data: Record<string, string>, callback?: () => void) => void
  call?: (method: string, data?: Record<string, unknown>) => void
}

function resolveToAbsolute(url: string): string {
  if (typeof window === 'undefined') {
    return url
  }
  try {
    return new URL(url, window.location.origin).toString()
  } catch {
    return url
  }
}

export function isWeChatBrowser(): boolean {
  if (typeof navigator === 'undefined') {
    return false
  }
  return /micromessenger/i.test(navigator.userAgent)
}

export function setupWeChatShare(options: WeChatShareOptions = {}): void {
  if (typeof window === 'undefined') {
    return
  }

  const sharePayload: WeChatSharePayload = {
    title: options.title ?? (typeof document !== 'undefined' ? document.title : ''),
    desc: options.desc ?? (typeof document !== 'undefined' ? document.title : ''),
    imgUrl: resolveToAbsolute(options.imgUrl ?? '/favicon.ico'),
    link: resolveToAbsolute(options.link ?? '/'),
  }

  let applied = false

  const applyWithBridge = () => {
    const bridge = (window as Window & { WeixinJSBridge?: WeixinJSBridgeApi }).WeixinJSBridge
    if (!bridge || typeof bridge.on !== 'function' || typeof bridge.invoke !== 'function') {
      return false
    }

    bridge.on('menu:share:appmessage', () => {
      bridge.invoke?.('sendAppMessage', {
        title: sharePayload.title,
        desc: sharePayload.desc,
        link: sharePayload.link,
        imgUrl: sharePayload.imgUrl,
      })
    })

    bridge.on('menu:share:timeline', () => {
      bridge.invoke?.('shareTimeline', {
        title: sharePayload.title,
        link: sharePayload.link,
        imgUrl: sharePayload.imgUrl,
      })
    })

    bridge.on('menu:share:qq', () => {
      bridge.invoke?.('shareQQ', {
        title: sharePayload.title,
        desc: sharePayload.desc,
        link: sharePayload.link,
        imgUrl: sharePayload.imgUrl,
      })
    })

    bridge.on('menu:share:weibo', () => {
      bridge.invoke?.('shareWeibo', {
        title: sharePayload.title,
        desc: sharePayload.desc,
        link: sharePayload.link,
        imgUrl: sharePayload.imgUrl,
      })
    })

    bridge.on?.('menu:copyurl', () => {
      bridge.invoke?.('copyUrl', {
        link: sharePayload.link,
      })
    })

    applied = true
    return true
  }

  const applyWithWx = () => {
    const wxApi = (window as Window & { wx?: WeChatShareApi }).wx
    if (!wxApi) {
      return false
    }

    const applyShare = () => {
      if (applied) {
        return
      }
      applied = true
      if (typeof wxApi.updateAppMessageShareData === 'function') {
        wxApi.updateAppMessageShareData(sharePayload)
        wxApi.updateTimelineShareData?.(sharePayload)
      } else {
        wxApi.onMenuShareAppMessage?.(sharePayload)
        wxApi.onMenuShareTimeline?.(sharePayload)
      }
    }

    if (typeof wxApi.ready === 'function') {
      wxApi.ready(applyShare)
    } else {
      applyShare()
    }
    return true
  }

  const assignShareData = () => {
    if (applied) {
      return
    }
    if (applyWithWx()) {
      return
    }
    applyWithBridge()
  }

  const handleBridgeReady = () => {
    assignShareData()
    if (applied) {
      document.removeEventListener('WeixinJSBridgeReady', handleBridgeReady)
    }
  }

  assignShareData()
  if (typeof document !== 'undefined') {
    document.addEventListener('WeixinJSBridgeReady', handleBridgeReady)
  }
}

const shareRelatedMenuItems = [
  'menuItem:share:appMessage',
  'menuItem:share:timeline',
  'menuItem:share:qq',
  'menuItem:share:weiboApp',
  'menuItem:share:facebook',
  'menuItem:share:QZone',
  'menuItem:share:email',
  'menuItem:favorite',
  'menuItem:copyUrl',
  'menuItem:share:brand',
]

export function disableWeChatShare(): void {
  if (typeof window === 'undefined') {
    return
  }

  let disabled = false

  const disableWithWx = () => {
    const wxApi = (window as Window & {
      wx?: WeChatShareApi & {
        hideMenuItems?: (config: { menuList: string[] }) => void
        hideAllNonBaseMenuItem?: () => void
      }
    }).wx

    if (!wxApi) {
      return false
    }

    const hide = () => {
      if (disabled) {
        return
      }
      disabled = true
      wxApi.hideMenuItems?.({ menuList: shareRelatedMenuItems })
      wxApi.hideAllNonBaseMenuItem?.()
    }

    if (typeof wxApi.ready === 'function') {
      wxApi.ready(hide)
    } else {
      hide()
    }

    return true
  }

  const disableWithBridge = () => {
    const bridge = (window as Window & { WeixinJSBridge?: WeixinJSBridgeApi }).WeixinJSBridge
    if (!bridge) {
      return false
    }

    bridge.call?.('hideOptionMenu')
    bridge.call?.('hideMenuItems', { menuList: shareRelatedMenuItems })
    bridge.invoke?.('hideOptionMenu', {})
    bridge.invoke?.('hideMenuItems', { menuList: shareRelatedMenuItems })

    disabled = true
    return true
  }

  const disableMenus = () => {
    if (disabled) {
      return
    }
    if (disableWithWx()) {
      return
    }
    disableWithBridge()
  }

  const handleBridgeReady = () => {
    disableMenus()
    if (disabled && typeof document !== 'undefined') {
      document.removeEventListener('WeixinJSBridgeReady', handleBridgeReady)
    }
  }

  disableMenus()
  if (!disabled && typeof document !== 'undefined') {
    document.addEventListener('WeixinJSBridgeReady', handleBridgeReady)
  }
}
