import {
  QueryObserver,
  type DefaultError,
  type QueryClient,
  type QueryKey,
  type QueryObserverOptions,
  type QueryObserverResult,
  type RefetchOptions,
} from '@tanstack/react-query'
import { action, makeObservable, observable, runInAction } from 'mobx'

export class MobxQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> {
  result: QueryObserverResult<TData, TError>

  private readonly observer: QueryObserver<
    TQueryFnData,
    TError,
    TData,
    TQueryFnData,
    TQueryKey
  >
  private unsubscribe: (() => void) | null = null
  private readonly resultListeners = new Set<() => void>()

  constructor(
    client: QueryClient,
    options: QueryObserverOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryFnData,
      TQueryKey
    >,
  ) {
    this.observer = new QueryObserver(client, options)
    this.result = this.observer.getCurrentResult()
    makeObservable(this, {
      result: observable.ref,
      attach: action,
      setOptions: action,
      dispose: action,
    })
    this.attach()
  }

  attach(): void {
    if (this.unsubscribe) return
    this.result = this.observer.getCurrentResult()
    this.emitResultChange()
    this.unsubscribe = this.observer.subscribe((next) => {
      runInAction(() => {
        this.result = next
      })
      this.emitResultChange()
    })
  }

  subscribeResult(onChange: () => void): () => void {
    this.resultListeners.add(onChange)
    return () => {
      this.resultListeners.delete(onChange)
    }
  }

  private emitResultChange(): void {
    for (const cb of this.resultListeners) {
      cb()
    }
  }

  setOptions(
    options: QueryObserverOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryFnData,
      TQueryKey
    >,
  ): void {
    this.observer.setOptions(options)
    runInAction(() => {
      this.result = this.observer.getCurrentResult()
    })
    this.emitResultChange()
  }

  refetch(options?: RefetchOptions): Promise<QueryObserverResult<TData, TError>> {
    return this.observer.refetch(options)
  }

  dispose(): void {
    this.unsubscribe?.()
    this.unsubscribe = null
  }
}
