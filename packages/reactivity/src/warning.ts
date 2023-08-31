/** 核心提醒模块 */
export function warn(msg: string, ...args: any[]) {
  console.warn(`[Docue warn] ${msg}`, ...args);
}
