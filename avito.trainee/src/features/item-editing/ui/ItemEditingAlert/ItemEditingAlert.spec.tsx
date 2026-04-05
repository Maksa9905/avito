import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AllProviders } from '@/test/renderWithProviders'

const { notificationsShow } = vi.hoisted(() => ({
  notificationsShow: vi.fn(),
}))

vi.mock('@mantine/notifications', () => ({
  notifications: {
    show: notificationsShow,
  },
}))

import { ENotificationAlertType, useNotificationAlert } from './ItemEditingAlert'

const wrapper = ({ children }: { children: ReactNode }) => (
  <AllProviders>{children}</AllProviders>
)

describe('useNotificationAlert', () => {
  beforeEach(() => {
    notificationsShow.mockClear()
  })

  it('показывает уведомление об ошибке с локализованным текстом и стилем', () => {
    const { result } = renderHook(() => useNotificationAlert(), { wrapper })

    act(() => {
      result.current(ENotificationAlertType.ERROR)
    })

    expect(notificationsShow).toHaveBeenCalledTimes(1)
    expect(notificationsShow.mock.calls[0][0]).toMatchObject({
      title: 'Ошибка сохранения',
      message:
        'При попытке сохранить изменения произошла ошибка. Попробуйте ещё раз или зайдите позже.',
      color: 'red',
      autoClose: 5000,
      w: '330px',
      position: 'top-right',
      withCloseButton: false,
    })

    const payload = notificationsShow.mock.calls[0][0] as {
      icon?: unknown
      classNames?: Record<string, string>
    }
    expect(payload.icon).toBeDefined()
    expect(payload.classNames?.root).toEqual(expect.any(String))
    expect(payload.classNames?.title).toEqual(expect.any(String))
    expect(payload.classNames?.description).toEqual(expect.any(String))
    expect(payload.classNames?.icon).toEqual(expect.any(String))
  })

  it('показывает уведомление об успехе с локализованным заголовком', () => {
    const { result } = renderHook(() => useNotificationAlert(), { wrapper })

    act(() => {
      result.current(ENotificationAlertType.SUCCESS)
    })

    expect(notificationsShow).toHaveBeenCalledTimes(1)
    expect(notificationsShow.mock.calls[0][0]).toMatchObject({
      title: 'Изменения сохранены',
      message: '',
      color: 'green',
      autoClose: 5000,
      w: '330px',
      position: 'top-right',
      withCloseButton: false,
    })

    const payload = notificationsShow.mock.calls[0][0] as { icon?: unknown }
    expect(payload.icon).toBeDefined()
  })
})
