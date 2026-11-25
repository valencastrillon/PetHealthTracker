import { useEffect } from 'react';
import NutritionSection from '../Components/nutrition/NutritionSection';
import NutritionPageSkeleton from '../Components/nutrition/NutritionPageSkeleton';
import { usePets } from '../hooks/usePets';

export default function NutritionPage() {
  const { pets, getPets, loading } = usePets();

  useEffect(() => {
    getPets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading && pets.length === 0) {
    return <NutritionPageSkeleton />;
  }

  return <NutritionSection />;
}