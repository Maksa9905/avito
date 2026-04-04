import type { UseFormReturnType } from '@mantine/form'
import { useCallback, useEffect, useRef, useState } from 'react'

import { EItemCategory } from '@/entities/items'

import {
  getItemEditDraftStorageKey,
  ITEM_EDIT_DRAFT_VERSION,
  parseItemEditDraft,
  serializeItemEditDraft,
  type ItemEditDraftPayloadV1,
} from '../lib/itemEditDraftStorage'
import type {
  AutoFormValues,
  CommonItemsEditingFormValues,
  ElecrtonicFormValues,
  RealEstateFormValues,
} from './types'

const AUTOSAVE_INTERVAL_MS = 5_000

export type DetailedEditingFormsMap = {
  [EItemCategory.AUTO]: UseFormReturnType<AutoFormValues>
  [EItemCategory.REAL_ESTATE]: UseFormReturnType<RealEstateFormValues>
  [EItemCategory.ELECTRONICS]: UseFormReturnType<ElecrtonicFormValues>
}

export type UseFormValuesAutosaveParams = {
  itemId: string | undefined
  commonForm: UseFormReturnType<CommonItemsEditingFormValues>
  detailedForms: DetailedEditingFormsMap
}

export type ItemEditRestoreDraftDialogControl = {
  opened: boolean
  onRestore: () => void
  onDiscard: () => void
}

export function useFormValuesAutosave({
  itemId,
  commonForm,
  detailedForms,
}: UseFormValuesAutosaveParams) {
  const storageKey = itemId ? getItemEditDraftStorageKey(itemId) : null

  const formsRef = useRef({ commonForm, detailedForms })

  const [restorePromptOpen, setRestorePromptOpen] = useState(false)
  const [autosaveEnabled, setAutosaveEnabled] = useState(false)

  const clearDraft = useCallback(() => {
    if (!storageKey || typeof window === 'undefined') {
      return
    }
    localStorage.removeItem(storageKey)
  }, [storageKey])

  const saveDraft = useCallback(() => {
    if (!storageKey || !itemId || typeof window === 'undefined') {
      return
    }
    const { commonForm: common, detailedForms: detailed } = formsRef.current
    const payload: ItemEditDraftPayloadV1 = {
      v: ITEM_EDIT_DRAFT_VERSION,
      itemId,
      common: common.getValues(),
      [EItemCategory.AUTO]: detailed[EItemCategory.AUTO].getValues(),
      [EItemCategory.REAL_ESTATE]:
        detailed[EItemCategory.REAL_ESTATE].getValues(),
      [EItemCategory.ELECTRONICS]:
        detailed[EItemCategory.ELECTRONICS].getValues(),
    }
    localStorage.setItem(storageKey, serializeItemEditDraft(payload))
  }, [itemId, storageKey])

  useEffect(() => {
    if (!storageKey || !itemId || typeof window === 'undefined') {
      return
    }

    const raw = localStorage.getItem(storageKey)
    if (!raw) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAutosaveEnabled(true)
      return
    }

    const draft = parseItemEditDraft(raw, itemId)
    if (draft) {
      setRestorePromptOpen(true)
    } else {
      localStorage.removeItem(storageKey)
      setAutosaveEnabled(true)
    }
  }, [itemId, storageKey])

  const enableAutosaveAfterPrompt = useCallback(() => {
    setRestorePromptOpen(false)
    setAutosaveEnabled(true)
  }, [])

  const applyRestore = useCallback(() => {
    if (!storageKey || !itemId || typeof window === 'undefined') {
      enableAutosaveAfterPrompt()
      return
    }

    const raw = localStorage.getItem(storageKey)
    const draft = raw ? parseItemEditDraft(raw, itemId) : null

    if (draft) {
      const { commonForm: common, detailedForms: detailed } = formsRef.current
      common.setValues(draft.common)
      detailed[EItemCategory.AUTO].setValues(draft[EItemCategory.AUTO])
      detailed[EItemCategory.REAL_ESTATE].setValues(
        draft[EItemCategory.REAL_ESTATE],
      )
      detailed[EItemCategory.ELECTRONICS].setValues(
        draft[EItemCategory.ELECTRONICS],
      )
    }

    clearDraft()
    enableAutosaveAfterPrompt()
  }, [clearDraft, enableAutosaveAfterPrompt, itemId, storageKey])

  const discardDraft = useCallback(() => {
    clearDraft()
    enableAutosaveAfterPrompt()
  }, [clearDraft, enableAutosaveAfterPrompt])

  useEffect(() => {
    const isDirty =
      commonForm.isDirty() ||
      detailedForms[EItemCategory.AUTO].isDirty() ||
      detailedForms[EItemCategory.REAL_ESTATE].isDirty() ||
      detailedForms[EItemCategory.ELECTRONICS].isDirty()

    if (!autosaveEnabled || !storageKey || !isDirty) {
      return
    }

    const id = window.setInterval(() => {
      saveDraft()
    }, AUTOSAVE_INTERVAL_MS)

    return () => {
      window.clearInterval(id)
    }
  }, [
    autosaveEnabled,
    commonForm,
    commonForm.isDirty,
    detailedForms,
    saveDraft,
    storageKey,
  ])

  const restoreDraftDialog: ItemEditRestoreDraftDialogControl = {
    opened: restorePromptOpen,
    onRestore: applyRestore,
    onDiscard: discardDraft,
  }

  return {
    clearDraft,
    restoreDraftDialog,
  }
}
