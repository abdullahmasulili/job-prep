import { PracticeView } from '@/components/practice-view';
export default async function Page({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  return <PracticeView moduleId={moduleId} />;
}
