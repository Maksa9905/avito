import {
  InfiniteQueryObserver,
  type DefaultError,
  type FetchNextPageOptions,
  type FetchPreviousPageOptions,
  type InfiniteData,
  type InfiniteQueryObserverOptions,
  type InfiniteQueryObserverResult,
  type QueryClient,
  type QueryKey,
  type RefetchOptions,
} from '@tanstack/react-query'
import { action, makeObservable, observable, runInAction } from 'mobx'


export class MobxInfiniteQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
> {
  result: InfiniteQueryObserverResult<TData, TError>

  private readonly observer: InfiniteQueryObserver<
    TQueryFnData,
    TError,
    TData,
    TQueryKey,
    TPageParam
  >
  private unsubscribe: (() => void) | null = null
  private readonly resultListeners = new Set<() => void>()

  constructor(
    client: QueryClient,
    options: InfiniteQueryObserverOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryKey,
      TPageParam
    >,
  ) {
    this.observer = new InfiniteQueryObserver(client, options)
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
    options: InfiniteQueryObserverOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryKey,
      TPageParam
    >,
  ): void {
    this.observer.setOptions(options)
    runInAction(() => {
      this.result = this.observer.getCurrentResult()
    })
    this.emitResultChange()
  }

  refetch(
    options?: RefetchOptions,
  ): Promise<InfiniteQueryObserverResult<TData, TError>> {
    return this.observer.refetch(options) as Promise<
      InfiniteQueryObserverResult<TData, TError>
    >
  }

  fetchNextPage(
    options?: FetchNextPageOptions,
  ): Promise<InfiniteQueryObserverResult<TData, TError>> {
    return this.observer.fetchNextPage(options)
  }

  fetchPreviousPage(
    options?: FetchPreviousPageOptions,
  ): Promise<InfiniteQueryObserverResult<TData, TError>> {
    return this.observer.fetchPreviousPage(options)
  }

  dispose(): void {
    this.unsubscribe?.()
    this.unsubscribe = null
  }
}
