import { ComponentInternalInstance } from './component'

export interface SchedulerJob extends Function {
  id?: number
  pre?: boolean
  active?: boolean
  computed?: boolean
  /**
   * Indicates whether the effect is allowed to recursively trigger itself
   * when managed by the scheduler.
   *
   * By default, a job cannot trigger itself because some built-in method calls,
   * e.g. Array.prototype.push actually performs reads as well (#1740) which
   * can lead to confusing infinite loops.
   * The allowed cases are component update functions and watch callbacks.
   * Component update functions may update child component props, which in turn
   * trigger flush: "pre" watch callbacks that mutates state that the parent
   * relies on (#1801). Watch callbacks doesn't track its dependencies so if it
   * triggers itself again, it's likely intentional and it is the user's
   * responsibility to perform recursive state mutation that eventually
   * stabilizes (#1727).
   */
  allowRecurse?: boolean
  /**
   * Attached by renderer.ts when setting up a component's render effect
   * Used to obtain component information when reporting max recursive updates.
   * dev only.
   */
  ownerInstance?: ComponentInternalInstance
}

export type SchedulerJobs = SchedulerJob | SchedulerJob[]

let isFlushing = false
let isFlushPending = false

// const queue: SchedulerJob[] = []
// let flushIndex = 0

// const pendingPostFlushCbs: SchedulerJob[] = []
// let activePostFlushCbs: SchedulerJob[] | null = null
// let postFlushIndex = 0

const resolvedPromise = /*#__PURE__*/ Promise.resolve() as Promise<any>
let currentFlushPromise: Promise<void> | null = null

// const RECURSION_LIMIT = 100
type CountMap = Map<SchedulerJob, number>

export function nextTick<T = void, R = void>(
  this: T,
  fn?: (this: T) => R
): Promise<Awaited<R>> {
  const p = currentFlushPromise || resolvedPromise
  return fn ? p.then(this ? fn.bind(this) : fn) : p
}

export function queueJob(job: SchedulerJob) {
  // the dedupe search uses the startIndex argument of Array.includes()
  // by default the search index includes the current job that is being run
  // so it cannot recursively trigger itself again.
  // if the job is a watch() callback, the search will start with a +1 index to
  // allow it recursively trigger itself - it is the user's responsibility to
  // ensure it doesn't end up in an infinite loop.
  // if (
  //   !queue.length ||
  //   !queue.includes(
  //     job,
  //     isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex
  //   )
  // ) {
  //   if (job.id == null) {
  //     queue.push(job)
  //   } else {
  //     queue.splice(findInsertionIndex(job.id), 0, job)
  //   }
  queueFlush()
  // }
}

function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true
    currentFlushPromise = resolvedPromise.then(flushJobs)
  }
}

function flushJobs(seen?: CountMap) {
  // sFlushPending = false
  // isFlushing = true
  // if (__DEV__) {
  //   seen = seen || new Map()
  // }
  // // Sort queue before flush.
  // // This ensures that:
  // // 1. Components are updated from parent to child. (because parent is always
  // //    created before the child so its render effect will have smaller
  // //    priority number)
  // // 2. If a component is unmounted during a parent component's update,
  // //    its update can be skipped.
  // queue.sort(comparator)
  // // conditional usage of checkRecursiveUpdate must be determined out of
  // // try ... catch block since Rollup by default de-optimizes treeshaking
  // // inside try-catch. This can leave all warning code unshaked. Although
  // // they would get eventually shaken by a minifier like terser, some minifiers
  // // would fail to do that (e.g. https://github.com/evanw/esbuild/issues/1610)
  // const check = __DEV__
  //   ? (job: SchedulerJob) => checkRecursiveUpdates(seen!, job)
  //   : NOOP
  // try {
  //   for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
  //     const job = queue[flushIndex]
  //     if (job && job.active !== false) {
  //       if (__DEV__ && check(job)) {
  //         continue
  //       }
  //       // console.log(`running:`, job.id)
  //       callWithErrorHandling(job, null, ErrorCodes.SCHEDULER)
  //     }
  //   }
  // } finally {
  //   flushIndex = 0
  //   queue.length = 0
  //   flushPostFlushCbs(seen)
  //   isFlushing = false
  //   currentFlushPromise = null
  //   // some postFlushCb queued jobs!
  //   // keep flushing until it drains.
  //   if (queue.length || pendingPostFlushCbs.length) {
  //     flushJobs(seen)
  //   }
  // }
}
