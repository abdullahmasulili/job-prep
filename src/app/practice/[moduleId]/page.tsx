import { PracticeView } from '@/components/practice-view';
import { moduleIds } from '@/content/catalog';

export const dynamicParams = false;

export function generateStaticParams() {
  return moduleIds.map((moduleId) => ({ moduleId }));
}

export default async function Page({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  return <PracticeView moduleId={moduleId} />;
}
