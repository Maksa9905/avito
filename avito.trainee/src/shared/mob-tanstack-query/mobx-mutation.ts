import {
  MutationObserver,
  type DefaultError,
  type MutateOptions,
  type MutationObserverOptions,
  type MutationObserverResult,
  type QueryClient,
} from '@tanstack/react-query'
import { action, makeObservable, observable, runInAction } from 'mobx'

/**
 * Обёртка над {@link MutationObserver}: состояние мутации в MobX-поле `result`.
 */
export class MobxMutation<
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TOnMutateResult = unknown,
> {
  result: MutationObserverResult<TData, TError, TVariables, TOnMutateResult>

  private readonly observer: MutationObserver<
    TData,
    TError,
    TVariables,
    TOnMutateResult
  >
  private unsubscribe: (() => void) | null

  constructor(
    client: QueryClient,
    options: MutationObserverOptions<
      TData,
      TError,
      TVariables,
      TOnMutateResult
    >,
  ) {
    this.observer = new MutationObserver(client, options)
    this.result = this.observer.getCurrentResult()
    makeObservable(this, {
      result: observable.ref,
      setOptions: action,
      reset: action,
      dispose: action,
    })
    this.unsubscribe = this.observer.subscribe((next) => {
      runInAction(() => {
        this.result = next
      })
    })
  }

  setOptions(
    options: MutationObserverOptions<
      TData,
      TError,
      TVariables,
      TOnMutateResult
    >,
  ): void {
    this.observer.setOptions(options)
    runInAction(() => {
      this.result = this.observer.getCurrentResult()
    })
  }

  mutate(
    variables: TVariables,
    options?: MutateOptions<TData, TError, TVariables, TOnMutateResult>,
  ): Promise<TData> {
    return this.observer.mutate(variables, options)
  }

  reset(): void {
    this.observer.reset()
  }

  dispose(): void {
    this.unsubscribe?.()
    this.unsubscribe = null
  }
}
