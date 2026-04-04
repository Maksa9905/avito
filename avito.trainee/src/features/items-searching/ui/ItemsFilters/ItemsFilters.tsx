import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Stack,
  Switch,
  Title,
} from '@mantine/core'

import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import IconButton from '@/shared/ui/IconButton'
import CaretDownIcon from '@/shared/icons/CaretDownIcon'
import { cn } from '@/shared/utils/cn'

import { EItemCategory } from '@/entities/items'

import useCatigoriesOptions from '../../lib/useCategoriesOptions'

import styles from './ItemsFilters.module.css'
import { useItemsListQueryParams } from '../../lib/useItemsListQueryParams'

type ItemsFiltersProps = {
  className?: string
}

const ItemsFilters = ({ className }: ItemsFiltersProps) => {
  const { t } = useTranslation('items')
  const { query, setQuery } = useItemsListQueryParams()

  const handleChangeExpandedFilters = useCallback(() => {
    setQuery({ expandedFilters: !query.expandedFilters })
  }, [query.expandedFilters, setQuery])

  const handleResetFilters = useCallback(() => {
    setQuery({
      needsRevision: false,
      categories: [],
    })
  }, [setQuery])

  const handleChangeCategories = useCallback(
    (category: EItemCategory, checked: boolean) => {
      const existingCategories = query.categories || []

      const newCategories = checked
        ? Array.from(new Set([...existingCategories, category]))
        : existingCategories.filter((c) => c !== category)

      setQuery({
        categories: newCategories,
      })
    },
    [query.categories, setQuery],
  )

  const categories = useCatigoriesOptions()

  return (
    <Stack>
      <Box
        component="aside"
        className={cn(styles.filters, className)}
      >
        <Title
          className={styles.title}
          order={2}
        >
          {t('filters.title')}
        </Title>
        <Box className={styles.categories}>
          <Box className={styles.categoriesHeader}>
            <Title
              className={styles.title}
              order={3}
            >
              {t('filters.categories')}
            </Title>
            <IconButton
              onClick={handleChangeExpandedFilters}
              className={styles.iconContainer}
              aria-label={t('filters.toggleCategories')}
              aria-expanded={query.expandedFilters}
            >
              <CaretDownIcon
                className={styles.icon}
                aria-hidden
              />
            </IconButton>
          </Box>

          <Collapse
            orientation="vertical"
            expanded={query.expandedFilters || false}
          >
            <Stack className={styles.checkboxes}>
              {categories.map((category) => (
                <Checkbox
                  checked={Boolean(
                    query.categories?.find((c) => c === category.value),
                  )}
                  onChange={(event) =>
                    handleChangeCategories(category.value, event.target.checked)
                  }
                  key={category.value}
                  label={category.label}
                />
              ))}
            </Stack>
          </Collapse>
        </Box>

        <span className={styles.divider} />

        <Box className={cn(styles.categories, styles.title)}>
          <Switch
            label={t('filters.needsRevisionOnly')}
            checked={query.needsRevision}
            onChange={(event) =>
              setQuery({ needsRevision: event.target.checked })
            }
            classNames={{
              label: styles.bold,
              body: styles.switchBody,
            }}
            withThumbIndicator={false}
            labelPosition="left"
          />
        </Box>
      </Box>

      <Button
        variant="default"
        h={41}
        onClick={handleResetFilters}
        className={styles.reset}
      >
        {t('filters.reset')}
      </Button>
    </Stack>
  )
}

export default ItemsFilters
