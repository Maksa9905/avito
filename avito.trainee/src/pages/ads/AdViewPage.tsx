import NeedsRevisionAlert from '@/entities/items/ui/NeedsRevisionAlert'

export const AdViewPage = () => {
  return <NeedsRevisionAlert fieldsNeeded={['title', 'description', 'price']} />
}

export default AdViewPage
