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

/**
 * Подписка на {@link QueryObserver}: результат запроса хранится в MobX-поле `result`
 * и обновляется при каждом уведомлении TanStack Query.
 */
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
  private unsubscribe: (() => void) | null

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
      setOptions: action,
      dispose: action,
    })
    this.unsubscribe = this.observer.subscribe((next) => {
      runInAction(() => {
        this.result = next
      })
    })
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
  }

  refetch(options?: RefetchOptions): Promise<QueryObserverResult<TData, TError>> {
    return this.observer.refetch(options)
  }

  dispose(): void {
    this.unsubscribe?.()
    this.unsubscribe = null
  }
}
